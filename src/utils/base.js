/**
 * 通用基础函数
 * @author 王刚(Margox Wang)
 * @date 2019-05-08
 */

/**
 * 复制指定文字到剪贴板
 * @param {string} text 需要复制的文字
 * @returns {boolean} 返回copy指令是否执行成功
 */
export const copyText = (text) => {
  // 创建一个临时文本框
  const tempInput = document.createElement("textarea");

  // 设置样式
  tempInput.style.cssText = "position:absolute;top:0;opacity:0;";

  // 将其添加到页面中
  document.body.appendChild(tempInput);

  // 为文本框设置值，并执行选中
  tempInput.value = text;
  tempInput.select();

  // 执行复制命令并缓存执行结果
  const isCopySuccess = document.execCommand("Copy");

  // 移除文本框
  document.body.removeChild(tempInput);

  // 返回复制结果
  return isCopySuccess;
};

/**
 * 异步延迟函数
 *
 * @export
 * @param {*} timeout
 * @returns {Promise}
 */
export const delay = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

export const sleep = delay;

/**
 * 为Promise包装一个cancel方法，让其变得可取消
 * @param {Promise} promise
 * @returns {Promise}
 */
export const makeCancelablePromise = (promise) => {
  let rejectFn;

  const wrappedPromise = new Promise((resolve, reject) => {
    rejectFn = reject;

    Promise.resolve(promise).then(resolve).catch(reject);
  });

  wrappedPromise.cancel = () => {
    promise.__canceled = true;
    rejectFn({ canceled: true });
  };

  return wrappedPromise;
};

let uniqueIdIndex = 0;

/**
 * 生成不重复的唯一ID字符串
 * @param {string} prefix 可选的前缀
 * @returns {string}
 */
export const generateUnid = (prefix = "") => {
  return `${prefix}${(Math.random().toString(13).split(".")[1] || "").slice(
    0,
    8
  )}${(uniqueIdIndex += 1)}`;
};

export const generateUniNumber = (min = 1000) => {
  return Math.ceil(`${min + Math.random() * 100000}${(uniqueIdIndex += 1)}`);
};

export const generateRange = (length) => {
  return new Array(length).fill(0).map((_, index) => index + 1);
};

export const downloadBlob = (blob, filename) => {
  let downloadLink = document.createElement("a");
  let downloadURL = URL.createObjectURL(blob);

  downloadLink.href = downloadURL;
  downloadLink.download = filename;
  downloadLink.click();

  setTimeout(() => {
    downloadLink = null;
    URL.revokeObjectURL(downloadURL);
    downloadURL = null;
  }, 1000);
};

export const downloadURL = (downloadURL, filename) => {
  let downloadLink = document.createElement("a");
  downloadLink.href = downloadURL;
  downloadLink.download = filename;
  downloadLink.click();
};

export const tryExecute = (object, ...argus) => {
  return typeof object === "function" ? object(...argus) : object;
};

export const noop = () => {};

/**
 * 格式化 价格范围
 *
 * @export
 * @param {number} [min=0]  最低价
 * @param {number} [max=0]  最高价
 * @param {number} [type=0] 0=价格范围 1=xx起
 * @returns
 */
export function formatPrice(min = 0, max = 0, type = 0) {
  if (min === max) {
    return `￥${min}`;
  } else if (min > 0 && max > 0) {
    if (type === 1) {
      return `￥${min}起`;
    }
    return `￥${min} ~ ￥${max}`;
  } else if (min > 0 && max === 0) {
    return `￥${min}`;
  }
}

/**
 * 生成UUID随机数
 *
 * @export  生成UUID随机数
 * @returns string
 */
export function genUUID() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

  // eslint-disable-next-line
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

// 在新标签页打开页面
export function createTab(url, ...other) {
  if (url.indexOf("/") == 0) {
    url = url.slice(1);
  }
  window.open(`${window.publicPathPrefixPath}/admin/${url}`, ...other);
}

// 关闭当前页面
export function closeTab() {
  window.opener = null;
  window.close();
}

/**
 * 判断空数组
 * @param {Array} array 需要判断的数组
 * @returns {boolean}
 */

export const emptyArray = (array) => {
  let empty = false;
  if (!(array instanceof Array)) {
    array = [];
  }
  empty = array.length === 0;
  return empty;
};

/**
 * 获取URL参数
 * @param {string} search URL中所带的参数
 * @returns {object}
 */

export const getURLParams = (search) => {
  search = search || location.search;
  const list = search.split("?");

  if (!emptyArray(list) && list.length > 1) {
    const item = list[1];
    let items = item.split("&");

    if (emptyArray(items)) {
      items = [];
    }

    const newParams = {};

    items.map((rs) => {
      const param = rs.split("=");

      if (!emptyArray(param)) {
        let key = "";
        let value = "";

        if (param.length === 1) {
          key = param[0];
        } else if (param.length === 2) {
          key = param[0];
          value = param[1];
        }
        newParams[key] = value;
      }
    });
    return newParams;
  } else {
    return {};
  }
};

export const objectToQueryString = function (json, sort, encode) {
  var result = "";
  var data = json;
  if (sort) {
    var sortedData = {};
    var sortedKeys = Object.keys(json).sort();
    sortedKeys.forEach(function (key) {
      sortedData[key] = json[key];
    });
    data = sortedData;
  }
  for (var item in data) {
    if (typeof data[item] !== "undefined") {
      if (encode) {
        result += "&" + item + "=" + encodeURIComponent(data[item]);
      } else {
        result += "&" + item + "=" + data[item];
      }
    }
  }
  return result;
};
