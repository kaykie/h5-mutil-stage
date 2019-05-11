/*
 * @Author: xuqing6@hikvison.com.cn
 * @LastEditors: xuqing6@hikvison.com.cn
 * @Date: 2019-03-28 10:05:59
 * @LastEditTime: 2019-03-30 17:40:01
 */
import React, {Component} from 'react';
import {InputItem, List, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import MliveHeader from '../components/MliveHeader/index';
import * as validate from '../utils/validate';
import api from '../api/index';
import qs from 'qs';
import md5 from 'js-md5';
import '../index.less';
import MyButton from '../components/button';

class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonUrlQuery: {},
      passwordStrength: 0,
    };
  }

  leftClick = () => {
    const {history} = this.props;
    history.push('/login?from=web');
  };

  componentWillMount() {
    this.passwordDecorator = this.props.form.getFieldDecorator('password', {
      rules: [
        {
          validator: this.validatePassword.bind(this),
          required: true
        }
      ]
    });

    if (this.props.history.location.params) {
      this.setState({
        jsonUrlQuery: this.props.history.location.params,
      });
    } else {
      // this.props.history.replace('/login')
    }

  }

  checkPassWordMode = (val) => {
    const model = {
      number: 0,
      lChar: 0,
      tChar: 0,
      special: 0
    };
    let num = 0;
    for (let i = 0; i < val.length; i++) {
      this.charMode(val.charCodeAt(i), model);
    }
    Object.keys(model).forEach(val => {
      if (model[val]) {
        ++num;
      }
    });
    this.setState({
      passwordStrength: num,
    });
    return num;
  };

  charMode = (iN, obj) => {
    if (iN >= 48 && iN <= 57) {
      obj.number = 1;
    } else if (iN >= 65 && iN <= 90) {
      obj.tChar = 1;
    } else if (iN >= 97 && iN <= 122) {
      obj.lChar = 1;
    } else {
      obj.special = 1;
    }
  };

  // 校验密码
  validatePassword(rule, value, callback) {
    console.log(value);
    if (!value) {
      callback(new Error('请输入密码'));
    } else if (/\s/.test(value)) {
      callback(new Error('密码不能包含空格'));
    } else if (value.length < 8 || value.length > 16) {
      callback(new Error('密码长度要求8-16位'));
    } else if (
      !/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)(?!^.*[\u4e00-\u9fa5].*$)\S{8,16}$/.test(
        value
      )
    ) {
      callback(
        new Error('密码只能用数字、小写字母、大写字母、符号的两种及以上组合')
      );
    } else {
      callback();
    }

  }

  // 密码强弱的显示标志
  passwordStrength = (value) => {
    if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)(?!^.*[\u4e00-\u9fa5].*$)\S{8,16}$/.test(
      value
    )) {
      this.setState({
        passwordStrength: 0,
      });
    } else {
      this.checkPassWordMode(value);
    }
  };

  // 密码强弱的指示器
  psdIndicator = () => {
    const {passwordStrength} = this.state;
    switch (passwordStrength) {
      case 0:
        return (<p>8-16位数字/英文字母或符号组成</p>);
      case 2:
        return (<p>密码强度：<span className="color-FF3333">低</span></p>);
      case 3:
        return (<p>密码强度：<span className="color-FF771C ">中</span></p>);
      default:
        return (<p>密码强度：<span className="color-33CC33">高</span></p>);
    }
  };

  modifyPassword = () => {
    const {history} = this.props;
    const {jsonUrlQuery} = this.state;
    this.props.form.validateFields((err, value) => {
      if (err) {
        const key = Object.keys(err)[0];
        Toast.info(err[key].errors[0].message);
        return;
      }
      if (!value.repassword) {
        Toast.info('确认密码不能为空');
        return;
      }
      if (value.password !== value.repassword) {
        Toast.info('两次密码输入不一致');
        return;
      }
      Toast.loading();
      const data = {
        ...this.state.jsonUrlQuery,
        password: md5(value.password),
      };
      api.resetPwd(data)
        .then(res => {
          if (res.retcode === 0) {
            Toast.success('修改密码成功', 3, () => {
              history.replace('/login');
            });
          } else {
            Toast.info(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
          Toast.fail('修改失败!');
        });
    });
  };

  render() {
    const {getFieldProps} = this.props.form, {jsonUrlQuery} = this.state;
    return (
      <div className="live-editPassword">
        <MliveHeader leftShow leftClick={this.leftClick}
                     title={`修改${jsonUrlQuery && jsonUrlQuery.type && jsonUrlQuery.type === 'first' ? '初始' : ''}密码`}/>
        <div className="editPassword-form-wrap">
          <List>
            {
              this.passwordDecorator(
                <InputItem
                  placeholder="新密码"
                  clear
                  type='password'
                  onChange={this.passwordStrength}
                  maxLength={16}
                />
              )
            }
            {
              this.psdIndicator()
            }
            <InputItem
              placeholder="确认密码"
              clear
              maxLength={16}
              type='password'
              {...getFieldProps('repassword')}
            />
          </List>
        </div>
        <MyButton
          title={jsonUrlQuery && jsonUrlQuery.type && jsonUrlQuery.type === 'first' ? '确定' : '完成'}
          onClick={this.modifyPassword}/>
      </div>
    );
  }
}

export default createForm()(EditPassword);
