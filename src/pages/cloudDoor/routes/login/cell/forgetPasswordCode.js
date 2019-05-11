/*
 * @Author: xuqing6@hikvison.com.cn
 * @LastEditors: xuqing6@hikvison.com.cn
 * @Date: 2019-03-28 10:05:59
 * @LastEditTime: 2019-03-30 17:34:33
 */
import React, {Component} from 'react';
import {InputItem, List, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import MliveHeader from '../components/MliveHeader/index';
import * as validate from './../utils/validate';
import api from '../api/index';
import '../index.less';
import MyButton from '../components/button';

class ForgetPasswordCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonUrlQuery: {},
      verifyTime: 0
    };
  }


  leftClick = () => {
    this.props.history.goBack();
  };

  componentWillMount() {
    console.log(this.props.history);
    if (this.props.history.location.params) {
      this.setState({
        jsonUrlQuery: this.props.history.location.params,
      }, () => {
        this.reSendCode();
      });
    } else {
      this.props.history.replace('/login');
    }
  }

  verifyCode = () => {
    this.props.form.validateFields((err, value) => {
      if (err) {
        const key = Object.keys(err)[0];
        Toast.info(err[key].errors[0].message);
      } else {
        Toast.loading();
        const data = {
          account: this.state.jsonUrlQuery.phone,
          smsCode: value.verifyCode,
        };
        api.checkResetPwdSms(data)
          .then(res => {
            console.log(res);
            if (res.retcode === 0) {
              Toast.hide();
              this.props.history.push({
                pathname:'/editpassword',
                params:{
                  account:this.state.jsonUrlQuery.phone,
                  smsCode:value.verifyCode
                }
              });
            } else {
              Toast.fail(res.msg);
            }
          })
          .catch(err => {
            console.log(err);
            Toast.fail(err.msg);
          });
      }
    });
  };

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  reSendCode = () => {
    if (this.state.verifyTime) {
      return;
    }
    console.log(this.state.jsonUrlQuery);
    Toast.loading();
    const data = {
      account: this.state.jsonUrlQuery.phone
    };
    api.getResetPwdSms(data)
      .then(res => {
        console.log(res);
        if (res.retcode === 0) {
          Toast.hide();
          this.setState({
            verifyTime:60
          });
          this.timer = setInterval(() => {
            if (this.state.verifyTime > 0) {
              this.setState({
                time: this.state.verifyTime--
              });
            }
          }, 1000);
        }else{
          Toast.fail(res.msg);
        }
      })
      .catch(err => {
        console.log(err);
        Toast.fail('网络异常');
      });
  };

  render() {
    const {jsonUrlQuery, verifyTime} = this.state,{getFieldProps} = this.props.form;
    return (
      <div className="live-forgetPasswordCode">
        <MliveHeader leftShow leftClick={this.leftClick} title='请输入验证码'/>
        <h2 className="forgetPasswordCode-title">
          短信验证码已发送至{/^[1][3-9][0-9]{9}$/.test(jsonUrlQuery.phone) && jsonUrlQuery.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')}请注意查收
        </h2>
        <div className="forgetPasswordCode-form-wrap">
          <List>
            <InputItem
              placeholder="验证码"
              type='number'
              clear
              maxLength={4}
              {...getFieldProps('verifyCode', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    validator: validate.validateVerifycode,
                    required: true
                  }
                ]
              })}
            />
          </List>
        </div>
        <MyButton onClick={this.verifyCode} title='下一步'/>
        <span
          onClick={this.reSendCode}
          className="forgetPasswordCode-sendCode-btn"
          disabled={verifyTime}
        >{`重新发送验证码${verifyTime ? `（${verifyTime}）` : ''}`}</span>
      </div>
    );
  }
}

export default createForm()(ForgetPasswordCode);
