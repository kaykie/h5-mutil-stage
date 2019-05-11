import React, {Component} from 'react';
import {InputItem, List, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import * as validate from './../../utils/validate';
import md5 from 'js-md5';
import './index.less';
import api from './api/index';
import loginConfig from './loginConfig';
import qs from 'qs';
import MyButton from './components/button';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordType: 'password',
      isLoginFocus: false,
      isPasswordFocus: false,
    };
  }


  login = () => {
    this.props.form.validateFields((err, value) => {
      if (err) {
        const key = Object.keys(err)[0];
        Toast.info(err[key].errors[0].message);
      } else {
        Toast.loading('', 10);
        const data = {
          account: value.username,
          password: md5(value.password)
        };
        api.login(data)
          .then(res => {
            this.loginFunction(res, data);
          });

      }
    });
  };

  loginFunction(res, params) {
    switch (res.retcode) {
      // 获取图形验证码
      case '1005':
        console.log('跳转到获取图形码证码');
        Toast.hide();
        this.props.history.push({
          pathname: '/chartCode',
          params: {
            username: params.account,
            oldpassword: params.password
          }
        });
        break;
      case '1003':
        console.log('图形验证码错');
        break;
      case '0':
        const data = qs.parse(res.redirectUrl.split('?')[1]);
        api.codeGetToken({
          'ys7_code': data.code
        })
          .then(res => {
            Toast.hide();
            if (res.code === '200') {
              localStorage.setItem('token', 'Bearer ' + res.data.token);
              localStorage.setItem('accessToken', res.data.accessToken);
              Toast.hide();
              this.props.history.push('/index');
            } else if (res.code === '50008') {
              if (res.data.accountType === 2) {
                this.props.history.push({
                  pathname: '/addSecret',
                  params: {
                    ys7Code: data.code,
                    appKey: res.data.appKey
                  }
                });
                return;
              }
              if (res.data.accountType === 0) {
                this.props.history.push({
                  pathname: '/protocol',
                  params: {
                    ys7Code: data.code
                  }
                });
              }
            } else {
              Toast.info(res.msg || '网络错误!');
            }
          })
          .catch(err => {
            console.log(err);
          });
        break;
      default:
        Toast.info(loginConfig.loginErrorInfo[res.retcode] ? loginConfig.loginErrorInfo[res.retcode].msg : '登录失败!');
    }
  }


  gotoForgetPassword = () => {
    const {form, history} = this.props;
    const username = form.getFieldProps(['username']);
    if (/^[1][3-9][0-9]{9}$/.test(username.value)) {
      history.push(`/forgetpasswordphone?&phone=${username.value}`);
    } else {
      history.push('/forgetpasswordphone');
    }
  };

  register = () => {
    this.props.history.push('/register');
  };

  render() {
    const {passwordType, isLoginFocus, isPasswordFocus} = this.state, {getFieldProps} = this.props.form,
      loginIcon = require(`./assets/login_icon_user_${isLoginFocus ? 'sel' : 'default'}@2x.png`),
      passwordIcon = require(`./assets/login_icon_password_${isPasswordFocus ? 'sel' : 'default'}@2x.png`);
    return (
      <div className="live-login">
        <img src={require('./assets/logo@2x.png')} alt="" className="login-logo"/>
        <div className="login-form-wrap">
          <div className="login-name">
            <List>
              <InputItem
                placeholder="用户名或手机号"
                clear
                maxLength={32}
                onFocus={() => {
                  this.setState({isLoginFocus: true});
                }}
                onBlur={() => {
                  this.setState({isLoginFocus: false});
                }}
                {...getFieldProps('username', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      validator: validate.validateName,
                      required: true,
                      message: '请输入用户名或手机号!'
                    }
                  ]
                })}
              >
                <img src={loginIcon}
                     width="38" height="38" alt=""/>
              </InputItem>
              <InputItem
                placeholder="密码"
                type={passwordType}
                onFocus={() => {
                  this.setState({isPasswordFocus: true});
                }}
                onBlur={() => {
                  this.setState({isPasswordFocus: false});
                }}
                clear
                maxLength={30}
                {...getFieldProps('password', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      validator: validate.validatePassword,
                      required: true,
                      message: '请输入密码!'
                    }
                  ]
                })}
              >
                <img src={passwordIcon}
                     width="38" height="38" alt=""/>
              </InputItem>
            </List>
          </div>
        </div>
        <MyButton onClick={this.login} title='登录'/>
        <div className='login-gotoForgetPassword'>
              <span
                onClick={this.gotoForgetPassword}
              >忘记密码？</span>
          <span onClick={this.register}>注册</span>
        </div>
        <div className='login-info'>
          萤石云账号可直接登录
        </div>
      </div>
    );
  }

}

export default createForm()(Login);
