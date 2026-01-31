/**
 * @module ObsidianSheetPlusRestApiService
 * @description
 * This module provides the core implementation for the Obsidian Sheet Plus REST API service.
 * It encapsulates the logic for making authenticated requests to the API endpoints.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import https from "node:https";
import { config } from "../../config/index.js";
import { BaseErrorCode, McpError } from "../../types-global/errors.js";
import {
  ErrorHandler,
  logger,
  RequestContext,
  requestContextService,
} from "../../utils/index.js";
import {
  ObsidianSheetPlusApiStatusResponse,
  SheetInfo,
  SheetData,
  WorkbookData,
  SetSheetDataParams,
  CreateSheetParams,
  SetFormulaParams,
  SetRangeStyleParams,
  SetDataValidationParams,
  SetFilterParams,
  ClearFilterParams,
  ClearContentsParams,
  ClearFormatParams,
  ClearCommentsParams,
  ClearHyperlinksParams,
  ClearAllParams,
  ClearDataValidationParams,
} from "./types.js";

export class ObsidianSheetPlusRestApiService {
  private axiosInstance: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = config.obsidianSheetPlusApiKey || '';
    
    const httpsAgent = new https.Agent({
      rejectUnauthorized: config.obsidianSheetPlusVerifySsl !== false,
    });

    this.axiosInstance = axios.create({
      baseURL: config.obsidianSheetPlusBaseUrl?.replace(/\/$/, "") || "http://localhost:3000",
      headers: {
        "X-API-KEY": this.apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      timeout: 60000,
      httpsAgent,
    });

    logger.info(
      `ObsidianSheetPlusRestApiService initialized with base URL: ${this.axiosInstance.defaults.baseURL}, Verify SSL: ${config.obsidianSheetPlusVerifySsl !== false}`,
      requestContextService.createRequestContext({
        operation: "ObsidianSheetPlusServiceInit",
      }),
    );
  }

  /**
   * Private helper to make requests and handle common errors.
   * @param config - Axios request configuration.
   * @param context - Request context for logging.
   * @param operationName - Name of the operation for logging context.
   * @returns The response data.
   * @throws {McpError} If the request fails.
   */
  private async _request<T = any>(
    requestConfig: AxiosRequestConfig,
    context: RequestContext,
    operationName: string,
  ): Promise<T> {
    const operationContext = {
      ...context,
      operation: `ObsidianSheetPlusAPI_${operationName}`,
    };
    logger.debug(
      `Making Obsidian Sheet Plus API request: ${requestConfig.method} ${requestConfig.url}`,
      operationContext,
    );

    return await ErrorHandler.tryCatch(
      async () => {
        try {
          const response = await this.axiosInstance.request<T>(requestConfig);
          logger.debug(
            `Obsidian Sheet Plus API request successful: ${requestConfig.method} ${requestConfig.url}`,
            { ...operationContext, status: response.status },
          );
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          let errorCode = BaseErrorCode.INTERNAL_ERROR;
          let errorMessage = `Obsidian Sheet Plus API request failed: ${axiosError.message}`;
          const errorDetails: Record<string, any> = {
            requestUrl: requestConfig.url,
            requestMethod: requestConfig.method,
            responseStatus: axiosError.response?.status,
            responseData: axiosError.response?.data,
          };

          if (axiosError.response) {
            // Handle specific HTTP status codes
            switch (axiosError.response.status) {
              case 400:
                errorCode = BaseErrorCode.VALIDATION_ERROR;
                errorMessage = `Obsidian Sheet Plus API Bad Request: ${JSON.stringify(axiosError.response.data)}`;
                break;
              case 401:
                errorCode = BaseErrorCode.UNAUTHORIZED;
                errorMessage = "Obsidian Sheet Plus API Unauthorized: Invalid API Key.";
                break;
              case 403:
                errorCode = BaseErrorCode.FORBIDDEN;
                errorMessage = "Obsidian Sheet Plus API Forbidden: Check permissions.";
                break;
              case 404:
                errorCode = BaseErrorCode.NOT_FOUND;
                errorMessage = `Obsidian Sheet Plus API Not Found: ${requestConfig.url}`;
                logger.debug(errorMessage, {
                  ...operationContext,
                  ...errorDetails,
                });
                throw new McpError(errorCode, errorMessage, operationContext);
              case 405:
                errorCode = BaseErrorCode.VALIDATION_ERROR;
                errorMessage = `Obsidian Sheet Plus API Method Not Allowed: ${requestConfig.method} on ${requestConfig.url}`;
                break;
              case 503:
                errorCode = BaseErrorCode.SERVICE_UNAVAILABLE;
                errorMessage = "Obsidian Sheet Plus API Service Unavailable.";
                break;
            }
            logger.error(errorMessage, {
              ...operationContext,
              ...errorDetails,
            });
            throw new McpError(errorCode, errorMessage, operationContext);
          } else if (axiosError.request) {
            // Network error (no response received)
            errorCode = BaseErrorCode.SERVICE_UNAVAILABLE;
            errorMessage = `Obsidian Sheet Plus API Network Error: No response received from ${requestConfig.url}. This may be due to Obsidian not running, the Obsidian Sheet Plus plugin being disabled, or a network issue.`;
            logger.error(errorMessage, {
              ...operationContext,
              ...errorDetails,
            });
            throw new McpError(errorCode, errorMessage, operationContext);
          } else {
            // Other errors (e.g., setup issues)
            logger.error(
              errorMessage,
              error instanceof Error ? error : undefined,
              {
                ...operationContext,
                ...errorDetails,
                originalError: String(error),
              },
            );
            throw new McpError(errorCode, errorMessage, operationContext);
          }
        }
      },
      {
        operation: `ObsidianSheetPlusAPI_${operationName}_Wrapper`,
        context: context,
        input: requestConfig,
        errorCode: BaseErrorCode.INTERNAL_ERROR,
      },
    );
  }

  // --- API Methods ---

  /**
   * Checks the status and authentication of the Obsidian Sheet Plus REST API.
   * @param context - The request context for logging and correlation.
   * @returns {Promise<ObsidianSheetPlusApiStatusResponse>} - The status object from the API.
   */
  async checkStatus(context: RequestContext): Promise<ObsidianSheetPlusApiStatusResponse> {
    return this._request<ObsidianSheetPlusApiStatusResponse>(
      {
        method: "GET",
        url: "/",
      },
      context,
      "checkStatus",
    );
  }

  /**
   * Gets the list of sheets in the workbook.
   * @param context - Request context.
   * @returns A list of sheet information objects.
   */
  async getSheetList(context: RequestContext): Promise<SheetInfo[]> {
    const response = await this._request<{ success: boolean; data: SheetInfo[] }>(
      {
        method: "GET",
        url: "/get_sheet_list",
      },
      context,
      "getSheetList",
    );
    return response.data || [];
  }

  /**
   * Gets data from a specific sheet.
   * @param sheetName - The name of the sheet to get data from (optional, defaults to active sheet).
   * @param range - The range of cells to get data from.
   * @param context - Request context.
   * @returns The sheet data.
   */
  async getSheetData(sheetName: string | undefined, range: string | undefined, context: RequestContext): Promise<SheetData> {
    const response = await this._request<{ success: boolean; data: SheetData }>(
      {
        method: "GET",
        url: "/get_sheet_data",
        params: { sheetName, range },
      },
      context,
      "getSheetData",
    );
    return response.data;
  }

  /**
   * Sets data to a specific sheet.
   * @param params - Parameters for setting sheet data.
   * @param context - Request context.
   * @returns A success message.
   */
  async setSheetData(params: SetSheetDataParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/set_sheet_data",
        data: params,
      },
      context,
      "setSheetData",
    );
  }

  /**
   * Creates a new sheet in the workbook.
   * @param params - Parameters for creating a new sheet.
   * @param context - Request context.
   * @returns Information about the created sheet.
   */
  async createSheet(params: CreateSheetParams, context: RequestContext): Promise<{ success: boolean; data: SheetInfo }> {
    return this._request<{ success: boolean; data: SheetInfo }>(
      {
        method: "POST",
        url: "/create_sheet",
        data: params,
      },
      context,
      "createSheet",
    );
  }

  /**
   * Sets a formula in a specific cell.
   * @param params - Parameters for setting a formula.
   * @param context - Request context.
   * @returns A success message.
   */
  async setFormula(params: SetFormulaParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/set_formula",
        data: params,
      },
      context,
      "setFormula",
    );
  }

  /**
   * Sets style for a range of cells.
   * @param params - Parameters for setting range style.
   * @param context - Request context.
   * @returns A success message.
   */
  async setRangeStyle(params: SetRangeStyleParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/set_range_style",
        data: params,
      },
      context,
      "setRangeStyle",
    );
  }

  /**
   * Gets full workbook data including all sheets and plugin data.
   * @param context - Request context.
   * @returns The workbook data.
   */
  async getWorkbookData(context: RequestContext): Promise<{ success: boolean; data: any; message: string }> {
    return this._request<{ success: boolean; data: any; message: string }>(
      {
        method: "GET",
        url: "/get_workbook_data",
      },
      context,
      "getWorkbookData",
    );
  }

  /**
   * Sets data validation for a range of cells.
   * @param params - Parameters for setting data validation.
   * @param context - Request context.
   * @returns A success message.
   */
  async setDataValidation(params: SetDataValidationParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/set_data_validation",
        data: params,
      },
      context,
      "setDataValidation",
    );
  }

  /**
   * Sets filter for a range of cells.
   * @param params - Parameters for setting filter.
   * @param context - Request context.
   * @returns A success message.
   */
  async setFilter(params: SetFilterParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/set_filter",
        data: params,
      },
      context,
      "setFilter",
    );
  }

  /**
   * Clears filter for a sheet.
   * @param params - Parameters for clearing filter.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearFilter(params: ClearFilterParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_filter",
        data: params,
      },
      context,
      "clearFilter",
    );
  }

  /**
   * Clears contents for a range of cells.
   * @param params - Parameters for clearing contents.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearContents(params: ClearContentsParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_contents",
        data: params,
      },
      context,
      "clearContents",
    );
  }

  /**
   * Clears format for a range of cells.
   * @param params - Parameters for clearing format.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearFormat(params: ClearFormatParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_format",
        data: params,
      },
      context,
      "clearFormat",
    );
  }

  /**
   * Clears comments for a range of cells.
   * @param params - Parameters for clearing comments.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearComments(params: ClearCommentsParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_comments",
        data: params,
      },
      context,
      "clearComments",
    );
  }

  /**
   * Clears hyperlinks for a range of cells.
   * @param params - Parameters for clearing hyperlinks.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearHyperlinks(params: ClearHyperlinksParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_hyperlinks",
        data: params,
      },
      context,
      "clearHyperlinks",
    );
  }

  /**
   * Clears all content and format for a range of cells.
   * @param params - Parameters for clearing all.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearAll(params: ClearAllParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_all",
        data: params,
      },
      context,
      "clearAll",
    );
  }

  /**
   * Clears data validation for a range of cells.
   * @param params - Parameters for clearing data validation.
   * @param context - Request context.
   * @returns A success message.
   */
  async clearDataValidation(params: ClearDataValidationParams, context: RequestContext): Promise<{ success: boolean; message: string }> {
    return this._request<{ success: boolean; message: string }>(
      {
        method: "POST",
        url: "/clear_data_validation",
        data: params,
      },
      context,
      "clearDataValidation",
    );
  }
}
