/*
 * @Author: xuqing6@hikvison.com.cn
 * @LastEditors: xuqing6@hikvison.com.cn
 * @Date: 2019-03-28 10:05:59
 * @LastEditTime: 2019-04-01 18:55:58
 */
import React, {Component} from 'react';
import {InputItem, List, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import MliveHeader from '../components/MliveHeader/index';
import * as validate from '../utils/validate';
import api from '../api/index';
import qs from 'qs';
import '../index.less';
import createHashHistory from 'history/createHashHistory';
import loginConfig from '../loginConfig';
import MyButton from '../components/button';

const history = createHashHistory();

class ChartCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonUrlQuery: {},
      chartCodeUrl: ''
    };
  }

  componentWillMount() {
    const {params} = this.props.history.location;
    this.setState({
      jsonUrlQuery: params,
    });
  }

  componentDidMount() {
    if (this.state.jsonUrlQuery) {
      this.getChartCode();
    }else{
      this.props.history.replace('/login')
    }
  }

  leftClick = () => {
    history.goBack();
  };
  getChartCode = () => {
    const url = `/openauth/captcha?indexcode=${this.state.jsonUrlQuery.username}`;
    this.setState({
      chartCodeUrl: `${url}&r=${Math.random() * 1000000}`
    });
  };

  login = () => {
    const {jsonUrlQuery} = this.state;
    this.props.form.validateFields((err, value) => {
      if (err) {
        const key = Object.keys(err)[0];
        Toast.info(err[key].errors[0].message);
      } else {
        Toast.loading();
        const data = {
          account: jsonUrlQuery.username,
          password: jsonUrlQuery.oldpassword,
          captcha: value.code
        };
        api.login(data)
          .then(res => {
            Toast.hide();
            this.loginFunction(res);
          })
          .catch(err => {
            console.log(err);
            Toast.fail('网络异常');
          });
      }
    });
  };

  loginFunction(res, params) {
    switch (res.retcode) {
      // 获取图形验证码
      case '1005':
        console.log('重置验证码');
        this.getChartCode();
        break;
      case '1003':
        console.log('图形验证码错');
        Toast.info('验证码错误');
        this.getChartCode();
        break;
      case '0':
        console.log('登录成功');
        const data = qs.parse(res.redirectUrl.split('?')[1]);
        api.codeGetToken({
          'ys7_code': data.code
        })
          .then(res => {
            localStorage.setItem('token', 'Bearer ' + res.data.token);
            localStorage.setItem('accessToken', res.data.accessToken);
            Toast.hide();
            history.push('/index');
          })
          .catch(err => {
            console.log(err);
          });
        break;
      default:
        this.props.history.goBack();
        Toast.info(loginConfig.loginErrorInfo[res.retcode].msg);
    }
  }


  render() {
    const {getFieldProps} = this.props.form;
    const {chartCodeUrl} = this.state;
    return (
      <div className="live-chartcode">
        <MliveHeader leftShow leftClick={this.leftClick} title='验证账号'/>
        <h2 className="chartcode-title">安全中心发现你的账号异常，请输入图中字符</h2>
        <div className="chartcode-form-wrap">
          <List>
            <InputItem
              placeholder="验证码"
              clear
              maxLength={32}
              {...getFieldProps('code', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    validator: validate.validateChartCode,
                    required: true
                  }
                ]
              })}
            />
            <img src={chartCodeUrl} className="chartcode-img"/>
          </List>
          <span
            onClick={this.getChartCode}
            className="chartcode-refresh-btn"
          >看不清</span>

        </div>
        <MyButton onClick={this.login} title='登录'/>
      </div>
    );
  }
}

export default createForm()(ChartCode);
