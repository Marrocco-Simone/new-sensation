import backend_url from "./backend_url";

export interface ApiResult<T> {
  status: "success";
  data?: T;
}

export interface ApiError {
  status: "error";
  message: string;
  code: number;
}

export type ApiResponse<T> = ApiResult<T> | ApiError;

export class ApiException extends Error {
  constructor(response: ApiError) {
    super(response.message);
  }
}

/**
 * It takes a uri, a method and some data, and returns the data from the response
 * @param {string} uri - the uri of the api call, which is combined with the server url
 * @param [method=get] - the HTTP method to use, defaults to 'get'
 * @param {any} [data] - the data to send to the server, if any
 * @returns the data property of the res object.
 */
async function apiCall<T>(
  uri: string,
  method = "get",
  data?: any,
  access_token?: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const url = uri.includes("http") ? uri : `${backend_url}${uri}`;

    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }

    if (access_token) {
      headers.Authorization = `Bearer ${access_token}`;
    }

    let body;
    if (!data) {
      body = undefined;
    } else if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (response.status >= 400) {
      return {
        status: "error",
        message: "Risposta negativa dal server",
        code: response.status,
      };
    }

    try {
      const response_json: T = await response.json();
      return { status: "success", data: response_json };
    } catch (e) {
      return { status: "success" };
    }
  } catch (e: any) {
    const message: string = e.message;
    console.error(message);
    console.log(e);
    const error_json: ApiError = {
      status: "error",
      message,
      code: 0,
    };
    return error_json;
  }
}

/**
 * It makes a POST request to the given uri with the given data, and returns a promise that resolves to
 * the response data
 * @param {string} uri - The uri to call.
 * @param {object} data - The data to send to the server.
 * @returns A promise that resolves to a generic type T.
 */
export function apiPost<T>(uri: string, data: any, access_token?: string, headers?: Record<string, string>) {
  return apiCall<T>(uri, "post", data, access_token, headers);
}

/**
 * "This function returns a promise that resolves to the response body of a GET request to the given
 * uri."
 *
 * The function is generic, which means that it can be used to return any type of data. The default
 * type is any, which means that the function will return a JavaScript object by default
 * @param {string} uri - The uri to call.
 * @returns A promise that resolves to a generic type T.
 */
export function apiGet<T>(uri: string, access_token?: string, headers?: Record<string, string>) {
  return apiCall<T>(uri, "get", null, access_token, headers);
}

/**
 * "This function makes a DELETE request to the given uri and returns the response as a promise."
 *
 * The function is generic, which means that it can return any type of data. The default type is any,
 * which means that the function will return any type of data by default
 * @param {string} uri - The uri to make the request to.
 * @returns A function that takes a uri and returns a promise that resolves to the response of the api
 * call.
 */
export function apiDelete<T>(uri: string, access_token?: string, headers?: Record<string, string>) {
  return apiCall<T>(uri, "delete", null, access_token, headers);
}

/**
 * "Make a PUT request to the given uri with the given data and return the response as a promise."
 *
 * The function is generic, which means that it can return any type of data. The default type is any,
 * which means that the function will return any type of data by default
 * @param {string} uri - The uri to make the request to.
 * @param {object} data - The data to send to the server.
 * @returns A promise that resolves to a generic type T.
 */
export function apiPut<T>(uri: string, data: any, access_token?: string, headers?: Record<string, string>) {
  return apiCall<T>(uri, "put", data, access_token, headers);
}
