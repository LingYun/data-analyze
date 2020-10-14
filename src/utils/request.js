import { message } from "antd";
import service from "../helpers/service";
import { downloadBlob, delay, objectToQueryString } from "./base";
import { isEmptyValue } from "./validate";
import { useState, useEffect } from "react";

const REQUEST_CACHE = {};

// 默认的响应数据解析器
const defaultResponseParser = (xhr, param) => {
  let responseData = null;

  try {
    responseData = JSON.parse(xhr.responseText);
  } catch {
    return {
      code: -1,
      message: "无法解析接口返回结果",
    };
  }

  if (responseData === null) {
    return {
      code: -1,
      message: "无法解析接口返回结果",
    };
  }

  const code = Number(responseData.code);

  if (code === 200) {
    return responseData;
  }

  if (code !== 200 && !param.noErrorToast) {
    message.error(responseData.message);
  }

  //   if (authorize.checkIfNeedAuthorize(responseData.code)) {
  //     return false;
  //   }

  responseData = responseData || {
    code: -2,
    message: "接口返回数据无效",
  };

  return responseData;
};
const parseBlobText = (response) =>
  new Promise((resolve, reject) => {
    try {
      if (!response) {
        reject({
          code: "500",
          message: "网络错误",
        });
      } else if (response.text) {
        response.text().then((text) => {
          resolve(JSON.parse(text));
        });
      } else {
        const fileReader = new FileReader();
        fileReader.onloadend = (event) => {
          resolve(JSON.parse(event.srcElement.result));
        };
        fileReader.readAsText(response);
      }
    } catch (error) {
      reject(error);
    }
  });

const downloadResponseParser = (xhr) => {
  const disposition = xhr.getResponseHeader("Content-Disposition");
  const filename = disposition
    ? disposition
        .slice(disposition.toLowerCase().indexOf("filename=") + 9)
        .replace(/"|'/g, "")
    : `文件_${new Date().getTime()}`;

  if (xhr.response.type === "application/json") {
    return parseBlobText(xhr.response).catch((error) => {
      return {
        code: 500,
        message: "导出失败",
      };
    });
  }

  return {
    code: 200,
    data: {
      blob: xhr.response,
      filename: filename,
    },
  };
};

// AJAX请求
const request = (param) => {
  let {
    url,
    data,
    headers,
    timeout,
    isFormData,
    ignoreEmptyParams,
    trimStringFields,
    ingoreCodeError,
    method,
    responseType,
    responseParser,
    useCache,
    cacheTimeout = 500,
  } = param;
  data = data || {};
  // 相对路径自动加/api/前缀
  !/^https?:\/\//.test(url) &&
    (url = `${window.publicPathPrefixPath}/api${url}`);

  if (
    useCache &&
    REQUEST_CACHE[url] &&
    Date.now() - REQUEST_CACHE[url].createTime < cacheTimeout
  ) {
    return REQUEST_CACHE[url].promise;
  }

  const requestPromise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 参数和默认参数处理
    method = method || request.defaultParameters.method;
    method = method.toUpperCase();
    timeout = timeout || request.defaultParameters.timeout;
    responseType = responseType || request.defaultParameters.responseType;
    responseParser = responseParser || request.defaultParameters.responseParser;
    headers = { ...request.defaultParameters.headers, ...headers };

    if (method === "POST" && (data instanceof FormData || isFormData)) {
      isFormData = true;
      Object.keys(request.defaultParameters.data).forEach((key) => {
        data.append(key, request.defaultParameters[key]);
      });

      /**
       * **formData类型的请求，由xhr自行控制Content-Type，为此需要删除headers中指定的Content-Type**
       */
      timeout = 300000;
      delete headers["Content-Type"];
      headers["Accept"] = "application/json";
    } else {
      // FIXME: 当data 为数组时，会被转化成object ，不适宜
      // data = { ...request.defaultParameters.data, ...data }
    }

    // get请求需要重新处理data和url
    if (method === "GET") {
      if (Object.keys(data).length > 0) {
        url = `${url}?${objectToQueryString(data)}`;
      }
      data = null;
    }

    // 开启请求连接
    xhr.open(method, url, true);
    xhr.responseType = responseType;
    xhr.timeout = timeout;

    // 设置请求头
    Object.keys(headers).forEach((name) => {
      xhr.setRequestHeader(name, headers[name]);
    });

    // 监听请求状态变更
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            let response = responseParser(xhr, param);
            if (response && response.then) {
              response
                .then((nestedResponse) => {
                  if (`${nestedResponse.code}` === "200") {
                    resolve(nestedResponse);
                  } else {
                    ingoreCodeError
                      ? resolve(nestedResponse)
                      : reject(nestedResponse);
                  }
                })
                .catch((error) => {
                  reject(error);
                });
            } else if (`${response.code}` === "200") {
              resolve(response);
            } else {
              ingoreCodeError ? resolve(response) : reject(response);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject({
            code: xhr.status,
            message: "接口请求失败",
          });
        }
      }
    };

    // 监听接口请求超时
    xhr.ontimeout = () => {
      reject({
        code: 408,
        message: "接口请求超时",
      });
    };

    data &&
      Object.keys(data).forEach((key) => {
        if (ignoreEmptyParams && isEmptyValue(data[key])) {
          delete data[key];
        } else {
          if (typeof data[key] === "string" && trimStringFields) {
            data[key] = data[key].trim();
          }
        }
      });

    // 发送请求
    xhr.send(isFormData ? data : JSON.stringify(data));
  })
    .then((data) => {
      return data;
    })
    .catch((data) => {
      throw data;
    });

  if (useCache) {
    REQUEST_CACHE[url] = {
      createTime: Date.now(),
      promise: requestPromise,
    };

    delay(cacheTimeout).then(() => {
      delete REQUEST_CACHE[url];
    });
  }

  return requestPromise;
};

// 默认的请求参数，可通过request.setDefaultParameters来进行更改
request.defaultParameters = {
  method: "GET",
  timeout: 30000,
  data: {},
  isFormData: false,
  ingoreCodeError: false, // 是否忽略code不为200的情况，而将所有status为200的响应视为成功
  noErrorToast: false, // 是否隐藏信息toast提示
  ignoreEmptyParams: false,
  trimStringFields: false,
  useCache: false,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "x-http-app-code": "scrm_admin",
  },
  responseType: "",
  responseParser: defaultResponseParser,
};

/**
 * **设置默认请求参数，这个影响是全局的，会对之后发起的所有请求生效**
 * @params {object} parameters
 */
request.setDefaultParameters = (parameters = {}) => {
  request.defaultParameters = {
    ...request.defaultParameters,
    ...parameters,
  };
};

/**
 * **get和post请求的简化用法**
 */
request.get = (url, data, options) =>
  request({ url, data, method: "GET", ...options });
request.post = (url, data, options) =>
  request({ url, data, method: "POST", ...options });
request.download = (url, data, options = {}) => {
  let requestOptions = {
    method: "POST",
  };

  if (typeof options === "string") {
    requestOptions.method = options.toUpperCase();
  } else {
    requestOptions = {
      ...requestOptions,
      ...options,
    };
  }

  return new Promise((resolve, reject) => {
    return request({
      url,
      data,
      responseType: "blob",
      responseParser: downloadResponseParser,
      ...requestOptions,
    })
      .then((responseData) => {
        downloadBlob(
          responseData.data.blob,
          requestOptions.fileName ||
            decodeURIComponent(responseData.data.filename)
        );
        resolve(responseData);
      })
      .catch(reject);
  });
};

let apiMap;
try {
  apiMap = require("../.api");
} catch (error) {
  console.warn(error);
}

/**
 * 生成请求方法
 *
 * @param {*} type 请求类型
 * @param {*} body 请求参数，get会将请求参数拼接在URL中
 * @param {*} urlParameter  URL中的参数，
 */
const createRequest = (type, data, urlParameter, options = {}) => {
  let apiInfo = apiMap[type];
  const { isDownload, ...restOptions } = options;

  if (service.isLocalService(type)) {
    return service.runLocalService(type, data, urlParameter, (options = {}));
  }

  if (!apiInfo) {
    throw Error(`无法匹配类型为${type} 的API配置`);
  }

  // 去掉多余的空格
  apiInfo = apiInfo.trim().replace(/\s+/g, " ");

  // 默认mthod 为 post
  let apiInfoArry = apiInfo.split(" ");
  if (apiInfoArry.length === 1) {
    apiInfoArry.unshift("post");
  }

  let [method = "", url = ""] = apiInfoArry;

  // 替换url的参数
  if (urlParameter) {
    for (const key in urlParameter) {
      const val = urlParameter[key];
      url = url.replace(`:${key}`, val);
    }
  }

  restOptions.method = method;

  if (isDownload) {
    return request.download(url, data, restOptions);
  } else {
    return request({ url, data, ...restOptions });
  }
};

createRequest.download = (type, data, urlParameter, options) =>
  createRequest(type, data, urlParameter, {
    ...options,
    isDownload: true,
  });

const useURLloader = (type, data, urlParameter, options = {}) => {
  const [response, setRes] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    createRequest(type, data, urlParameter, options)
      .then((res) => {
        setRes(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [type, data, urlParameter, options]);
  return [response, loading];
};

export { createRequest, useURLloader };
export default request;
