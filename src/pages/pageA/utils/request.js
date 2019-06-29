/* eslint-disable */

import 'isomorphic-fetch';
import {Toast} from 'antd-mobile';
import Util from './Util';
import config from '../config';
import createHashHistory from 'history/createHashHistory';

require('es6-promise').polyfill();
const history = createHashHistory();

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status === 401) {
    if (localStorage.getItem('applicationType') === 'app') {
      Toast.info('登录过期，请至app里重新登录');
    } else {
      history.replace('/login');
    }
    return;
  }
  if (response.status >= 500) {
    Toast.info('网络错误!');
    return;
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    Toast.info('网络错误!');
  }
  throw new Error(response.statusText);
}

function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

function serializeValue(v) {
  if (Util.isObject(v)) {
    return Util.isDate(v) ? v.toISOString() : JSON.stringify(v);
  }
  return v;
}

/**
 * 将get参数拼接
 * @param params
 * @returns {*}
 */
function paramSerializer(params) {
  if (!params) return '';
  var urlPart = [];
  for (let k in params) {
    let value = params[k];
    if (value === null || Util.isUndefined(value)) continue;
    if (Util.isArray(value)) {
      for (let i = 0, l = value.length; i < l; i++) {
        urlPart.push(encodeUriQuery(k) + '=' + encodeUriQuery(serializeValue(value[i])));
      }
    } else {
      urlPart.push(encodeUriQuery(k) + '=' + encodeUriQuery(serializeValue(value)));
    }
  }
  return urlPart.join('&');
}


function transformRequestData(data) {
  let obj = deleteUndefindeProps(data);
  return Util.isObject(obj) ? JSON.stringify(obj) : obj;
}

function deleteUndefindeProps(Obj) {
  var newObj;
  if (Obj instanceof Array) {
    newObj = [];  // 创建一个空的数组
    var i = Obj.length;
    while (i--) {
      newObj[i] = deleteUndefindeProps(Obj[i]);
    }
    return newObj;
  } else if (Obj instanceof Object) {
    newObj = {};  // 创建一个空对象
    for (var k in Obj) {  // 为这个对象添加新的属性
      newObj[k] = deleteUndefindeProps(Obj[k]);
    }
    return newObj;
  } else {
    return Util.isUndefined(Obj) ? null : Obj;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 * @isShow  {string}          如何有isShow是字符串的 isShow传进来，则出错的情况下不给出提示
 */

export default function request(options, isShow) {

  if (!Util.isObject(options)) {
    throw new Error('Http request configuration must be an object');
  }
  if (!Util.isString(options.url)) {
    throw new Error('Http request configuration url must be a string');
  }
  if (options.headers && !Util.isObject(options.headers)) {
    throw new Error('Http request headers must be a string');
  }
  const defaultOpt = {method: 'GET'};
  let params = paramSerializer(options.params);
  if (params) options.url = `${options.url}?${params}`;
  let opt = {};
  for (let k in options) {
    if (k !== 'params') {
      opt[k] = options[k];
    }
  }

  opt.headers = opt.headers || {};
  var headers = new Headers({
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: localStorage.getItem('token'),
    userType: 'enterprise',
    ...opt.headers
  });
  opt.headers = headers;
  opt.credentials = 'include';  // 发送请求时带cookie
  // 请求地址加入公共路径
  options.url = config.publicUrl + options.url;
  opt.body = transformRequestData(opt.data);
  return fetch(options.url, opt)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if (data.code && data.code !== '200' && isShow !== 'isShow') {
        Toast.info(data.msg);
      }
      return data;
    })
    .catch(err => ({err}));
}
