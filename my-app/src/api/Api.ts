/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */


export interface DsTaskResolutions {
  task_Res_ID?: number;
  task_ID?: number;
  number?: number;
  resolution_ID?: number;
}

export interface DsTasks {
  id: number;
  description?: string;
  image?: string;
  minutes?: number;
  title?: string;
  answer?: string;

}

export interface DsResolutions {
  car_License_Plate?: string;
  date_Created?: string;
  date_Done?: string;
  date_Formed?: string;
  head_Of_Depart_ID?: number;
  resolution_ID?: number;
  sale?: boolean;
  status?: string;
  total_Price?: number;
  user_ID?: number;
}

export interface DsUsers {
  id?: number;
  is_admin?: boolean;
  login?: string;
  password?: string;
}

export interface ModelsTasksListWithRes {
  tasks?: DsTasks[];
  resCount?: number;
  resId?: number;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8080" });

        // Добавляем интерцептор для автоматического добавления заголовка Authorization
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }



  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Tasks for scooter
 * @version 1.0
 * @baseUrl http://localhost:8080
 * @contact
 *
 * API server
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    task = {
    /**
     * @description Get list of all fines or search fines by keyword
     *
     * @tags tasks
     * @name TaskList
     * @summary Get all tasks
     * @request GET:/task
     */
    fineList: (
      query?: {
        /** Search tasks */
        minutesFrom?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ModelsTasksListWithRes, Record<string, string>>({
        path: `/task`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Add task to a user's resolution
     *
     * @tags Tasks
     * @name PostFine
     * @summary Add a task to a resolution
     * @request POST:/task/add/{id}
     */
    postFine: (id: number, params: RequestParams = {}) =>
      this.request<string, Record<string, string>>({
        path: `/task/add/${id}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new fine
     *
     * @tags Tasks
     * @name CreateCreate
     * @summary Create a new task
     * @request POST:/task/create
     */
    createCreate: (fine: DsTasks, params: RequestParams = {}) =>
      this.request<DsTasks, Record<string, string>>({
        path: `/task/create`,
        method: "POST",
        body: fine,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload an image for a specific ID
     *
     * @tags Images
     * @name PostFine2
     * @summary Upload an image by ID
     * @request POST:/task/img/{id}
     * @originalName postFine
     * @duplicate
     */
    postFine2: (
      id: number,
      data: {
        /** Image file */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/task/img/${id}`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Update fine details by its ID
     *
     * @tags task
     * @name UpdateUpdate
     * @summary Update a task by ID
     * @request PUT:/task/update/{id}
     */
    updateUpdate: (id: number, task: DsTasks, params: RequestParams = {}) =>
      this.request<DsTasks, Record<string, string>>({
        path: `/task/update/${id}`,
        method: "PUT",
        body: task,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a fine by its ID
     *
     * @tags Task
     * @name TaskDetail
     * @summary Get task by ID
     * @request GET:/task/{id}
     */
    fineDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsTasks, string | Record<string, string>>({
        path: `/task/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  tasks = {
    /**
     * @description Delete fine by its ID
     *
     * @tags Task
     * @name DeleteDelete
     * @summary Delete a Task by ID
     * @request DELETE:/task/delete/{id}
     */
    deleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, Record<string, string>>({
        path: `/task/delete/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  fr = {
    /**
     * @description Update the count of a fine-resolution link
     *
     * @tags Task-Resolutions
     * @name CountUpdate
     * @summary Update task-resolution count
     * @request PUT:/fr/count/{id}
     */
    countUpdate: (id: number, request: DsTaskResolutions, params: RequestParams = {}) =>
      this.request<DsTaskResolutions, Record<string, string>>({
        path: `/fr/count/${id}`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete fine-resolution link by its ID
     *
     * @tags Tasks-Resolutions
     * @name DeleteDelete
     * @summary Delete task-resolution link by ID
     * @request DELETE:/tl/delete/{id}
     */
    deleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, Record<string, string>>({
        path: `/tl/delete/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  resolution = {
    /**
     * @description Get list of all resolutions with optional filters for date range and status
     *
     * @tags Resolutions
     * @name ResolutionList
     * @summary Get all resolutions
     * @request GET:/resolution
     */
    lessonsList: (
      query?: {
          date_to?: string;

        /** Filter by start date (YYYY-MM-DD) */
        date_from?: string;
        /** Filter by end date (YYYY-MM-DD) */
        /** Filter by resolution status */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsResolutions[], Record<string, string>>({
        path: `/lesson`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Set status of a resolution by admin
     *
     * @tags Resolutions
     * @name CompleteUpdate
     * @summary Set status of resolution by admin
     * @request PUT:/resolution/complete/{id}
     */
    completeUpdate: (id: number, params: RequestParams = {}) =>
      this.request<DsResolutions, Record<string, string>>({
        path: `/lesson/complete/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description Delete resolution by its ID
     *
     * @tags Resolutions
     * @name DeleteDelete
     * @summary Delete a resolution by ID
     * @request DELETE:/resolution/delete/{id}
     */
    deleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<DsResolutions, Record<string, string>>({
        path: `/resolution/delete/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Set status of a resolution for a user
     *
     * @tags Resolutions
     * @name FormUpdate
     * @summary Set status of resolution by user
     * @request PUT:/resolution/form
     */
    formUpdate: (params: RequestParams = {}) =>
      this.request<DsResolutions, Record<string, string>>({
        path: `/resolution/form`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description Get a resolution by its ID
     *
     * @tags Resolutions
     * @name ResolutionDetail
     * @summary Get resolution by ID
     * @request GET:/resolution/{id}
     */
    resolutionDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsResolutions, string | Record<string, string>>({
        path: `/lesson/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  resolutions = {
    /**
     * @description Update resolution details by its ID
     *
     * @tags Resolutions
     * @name UpdateUpdate
     * @summary Update a resolution by ID
     * @request PUT:/resolutions/update/{id}
     */
    updateUpdate: (id: number, resolution: DsResolutions, params: RequestParams = {}) =>
      this.request<DsResolutions, Record<string, string>>({
        path: `/resolutions/update/${id}`,
        method: "PUT",
        body: resolution,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * @description Login a user and generate a token
     *
     * @tags Users
     * @name LoginCreate
     * @summary Login a user
     * @request POST:/user/login
     */
    loginCreate: (user: DsUsers, params: RequestParams = {}) =>
      this.request<string, Record<string, string>>({
        path: `/user/login`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout a user by invalidating the token
     *
     * @tags Users
     * @name LogoutCreate
     * @summary Logout a user
     * @request POST:/user/logout
     */
    logoutCreate: ( user: DsUsers, params: RequestParams = {}) => {
        return this.request<string, Record<string, string>>({
            path: `/user/logout`,
            method: "POST",
            body: user,
            type: ContentType.Json,
            format: "json",
            ...params,
        });
    },


      /**
     * @description Register a new user by providing login and password
     *
     * @tags Users
     * @name RegisterCreate
     * @summary Register a new user
     * @request POST:/user/register
     */
    registerCreate: (user: DsUsers, params: RequestParams = {}) =>
      this.request<DsUsers, Record<string, string>>({
        path: `/user/register`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Update user details by its ID
     *
     * @tags Users
     * @name UpdateUpdate
     * @summary Update user by ID
     * @request PUT:/users/update
     */
    // @ts-ignore
    updateUpdate: (id: number, user: DsUsers, params: RequestParams = {}) =>
      this.request<DsUsers, Record<string, string>>({
        path: `/users/update`,
        method: "PUT",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
