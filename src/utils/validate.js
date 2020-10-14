/**
 * 判断空数组
 * @param {Array} array 需要判断的数组
 * @returns {boolean}
 */

export const isEmptyArray = (array) => {
  return !Array.isArray(array) || array.length === 0;
};

/**
 * 判断空对象
 * @param {Object} object 需要判断的对象
 * @returns {boolean}
 */
export const isEmptyObject = (object) => {
  let empty = false;
  if (!(object instanceof Object)) {
    object = {};
  }
  empty = Object.keys(object).length === 0;
  return empty;
};

/**
 * 判断空字符串
 * @param {String} string 需要判断的字符串
 * @returns {boolean}
 */
export const isEmptyString = (string) => {
  let empty = false;
  if (!(typeof string === "string")) {
    string = "";
  }
  if (typeof string === "undefined" || string == null || string === "") {
    empty = true;
  }

  return empty;
};

export const isEmptyValue = (value) => {
  return typeof value === "undefined" || value == null || value === "";
};

/**
 * 判断一个函数是否是一个生成器函数
 * @param {Function} fn
 * @returns {Boolean}
 */
export const isGeneratorFunction = (fn) => {
  return (
    fn && Object.prototype.toString.call(fn) === "[object GeneratorFunction]"
  );
};

export const isNotNumber = (value) => {
  return value === null || value === "" || isNaN(value);
};

export const noopValidator = (rule, value, callback) => callback();

/**
 * 剔除对象value前后空格
 * @param {Object} object 需要处理的对象
 * @returns {Object}
 */
export const trimObject = (object) => {
  const params = {};
  if (isEmptyObject(object) === false) {
    // 非空对象
    Object.entries(object).map((item) => {
      const [key, value] = item;
      let newValue = value;
      if (Object.prototype.toString.call(value) === "[object String]") {
        newValue = value.trim();
      }
      Object.assign(params, { [key]: newValue });
    });
  }
  return params;
};

export const patterns = {
  integer: /^[1-9]\d*$/,
  limitedInteger: /^[1-9]\d{0,7}$/,
  cash: /(^[1-9]\d*(\.(([0-9][1-9])|([1-9])))?$)|(^0\.[0-9][1-9]$)|(^0\.[1-9]$)/,
  invalidCash: /\..{3}/,
  number: /^[0-9]*$/,
};

export const validators = {
  isPatternMatch: (value, pattern) => {
    if (!value) {
      return true;
    }
    return pattern && pattern.test && pattern.test(value);
  },
  isNumber: (number) => {
    return !isNotNumber(number);
  },
  isBetween: (number, min, max) => {
    return validators.isNumber(number) && number >= min && number <= max;
  },
  isLessThan: (number, targetNumber) => {
    if (isNotNumber(number) || isNotNumber(targetNumber)) {
      return true;
    }
    return +number < +targetNumber;
  },
  isLessThanOrEqualTo: (number, targetNumber) => {
    if (isNotNumber(number) || isNotNumber(targetNumber)) {
      return true;
    }
    return +number <= +targetNumber;
  },
  isLargerThan: (number, targetNumber) => {
    if (isNotNumber(number) || isNotNumber(targetNumber)) {
      return true;
    }
    return +number > +targetNumber;
  },
  isLargerThanOrEqualTo: (number, targetNumber) => {
    if (isNotNumber(number) || isNotNumber(targetNumber)) {
      return true;
    }
    return +number >= +targetNumber;
  },
};
