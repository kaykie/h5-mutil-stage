import request from '../../../utils/request';
import qs from 'qs';
import {
  parseResponse
} from './util';
import Util from '../../../utils/Util';

const clientIdProduct = '33c9dc00b9f34c288ae625778e853704';
const clientIdDev = '00d317f1511e41f985f2c34b9c057e00';

function paramSerializer(params) {
  if (!params) return '';
  const urlPart = [];
  for (const k in params) {
    const value = params[k];
    if (value === null || Util.isUndefined(value)) continue;
    if (Util.isArray(value)) {
      for (let i = 0, l = value.length; i < l; i++) {
        urlPart.push(k + '=' + value[i]);
      }
    } else {
      urlPart.push(k + '=' + value);
    }
  }
  return urlPart.join('&');
}

const authConfig = {
  'client_id': clientIdDev,
  'response_type': 'code',
  'redirect_uri': 'default',
  scope: 'basic',
  state: '123',
  sign: '123',
  from: 'd1241784819647918671',
  returnUrl: 'default',
  r: '123'
};

export default {
  // 登录
  login(data) {
    const url = '/openauth/doLogin', encodeData = paramSerializer({...data, ...authConfig});
    return request({
      url,
      method: 'POST',
      data: encodeData,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  // 在登陆的时候获取token
  codeGetToken(data) {
    const url = '/api/user/openauth/code/gettoken';
    return request({
      url,
      headers: {
        userType: 'enterprise',
        'Content-Type': 'application/json'
      },
      data,
      credentials: 'include',
      method: 'POST'
    }, 'isShow');
  },

  // 如何是企业账号则补充空的企业信息 让其转入业务页面
  addEnterPrise(data) {
    const url = '/api/user/openauth/code/addEnterpriseUserInfo';
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    return new Promise((resolve, reject) => {
      request({
        url,
        headers: {
          userType: 'enterprise',
          'Content-Type': 'application/json'
        },
        data,
        credentials: 'include',
        method: 'POST'
      }, 'isShow')
        .then(res => {
          if (res.code === '200') {
            this.codeGetToken(data)
              .then(res2 =>{
                if(res2.code === '200'){
                  resolve(res2)
                }else{
                  resolve(res2)
                }
              })
          }else{
            resolve(res)
          }
        })
        .catch(err =>{
          reject(err)
        })
    });
  },


  // 判断这个用户是否存在
  existUser(data) {
    const url = '/openauth/chk', encodeData = paramSerializer(data);
    return request({
      url,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: encodeData,
      method: 'POST'
    });
  },


  // 点击发送码证码 在手机上获取验证码
  getResetPwdSms(data) {
    const url = '/openauth/user/reset/sms', _config = {
      'client_id': authConfig.client_id,
      from: authConfig.from
    }, encodeData = paramSerializer({
      ...data,
      ..._config
    });
    return request({
      url,
      data: encodeData,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
  },

  // 判断用户输入的验证码是否正确
  checkResetPwdSms(data) {
    const url = '/openauth/user/reset/chk';
    const _config = {
      'client_id': authConfig.client_id,
      from: authConfig.from
    }, encodeData = paramSerializer({
      ...data,
      ..._config
    });
    return request({
      url,
      data: encodeData,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
  },

  // 重置密码
  resetPwd(data) {
    const url = '/openauth/user/reset/submit', _config = {
      'client_id': authConfig.client_id,
      from: authConfig.from
    }, encodeData = paramSerializer({
      ...data,
      ..._config
    });
    return request({
      url,
      data: encodeData,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
  },


  // 注册时候获取验证码
  getSMS(data) {
    const url = '/openauth/user/reg/sms', _config = {
      'client_id': authConfig.client_id,
      from: authConfig.from
    }, encodeData = paramSerializer({
      ...data,
      ..._config
    });
    return request({
      url,
      data: encodeData,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
  },

  // 提交注册
  ysUserRegister(data) {
    const url = '/openauth/user/reg/submit', _config = {
      'client': authConfig.client_id,
      from: authConfig.from
    }, encodeData = paramSerializer({
      ...data,
      ..._config
    });
    return request({
      url,
      data: encodeData,
      headers: {
        credentials: 'include',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
  },


};
