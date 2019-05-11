/*
 * @Author: xuqing6@hikvison.com.cn
 * @LastEditors: xuqing6@hikvison.com.cn
 * @Date: 2019-03-28 10:05:59
 * @LastEditTime: 2019-03-29 16:51:11
 */
import React, {Component} from 'react';
import {InputItem, List, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import MliveHeader from '../components/MliveHeader/index';
import * as validate from '../utils/validate';
import api from '../api/index';
import qs from 'qs';
import '../index.less';
import MyButton from '../components/button';

class ForgetPasswordPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  leftClick = () => {
    this.props.history.goBack();
  };
  sendCode = () => {
    this.props.form.validateFields((err, value) => {
      if (err) {
        const key = Object.keys(err)[0];
        Toast.info(err[key].errors[0].message);
      } else {
        Toast.loading();
        const reg = /^1[3456789]\d{9}$/;
        const data = {
          v: value.phone,
          t: !reg.test(value.phone) ? 1 : 2
        };
        api.existUser(data)
          .then(res => {
            if (res && res.registered) {
              this.props.history.push({
                pathname: '/forgetpasswordcode',
                params: {
                  phone: value.phone
                }
              });
            } else {
              Toast.info('该用户不存在!');
            }
          })
          .catch(err => {
            console.log(err);
            Toast.fail('网络异常');
          });
      }
    });
  };

  render() {
    const {getFieldProps} = this.props.form, {search} = this.props.history.location;
    const phone = qs.parse(search.split('?')[1]).phone;
    return (
      <div className="live-forgetPasswordPhone">
        <MliveHeader leftShow leftClick={this.leftClick} title='忘记密码'/>
        <h2 className="forgetPasswordPhone-title">输入绑定的手机号</h2>
        <div className="forgetPasswordPhone-form-wrap">
          <List>
            <InputItem
              placeholder="手机号码"
              clear
              maxLength={32}
              {...getFieldProps('phone', {
                validateTrigger: 'onBlur',
                initialValue: phone,
                rules: [
                  {
                    validator: validate.validePhone,
                    required: true
                  }
                ]
              })}
            />
          </List>
        </div>
        <MyButton
          onClick={this.sendCode} title='发送验证码'/>
      </div>
    );
  }
}

export default createForm()(ForgetPasswordPhone);
