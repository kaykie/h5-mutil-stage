import React, {Component} from 'react';
import MliveHeader from '../components/MliveHeader/index';
import MyButton from '../components/button';
import {createForm} from 'rc-form';
import {Checkbox} from 'antd-mobile';
import MyInputItem from '../components/inputItem';
import '../index.less';
import api from '../api/index.js';
import md5 from 'js-md5';
import {Toast} from 'antd-mobile/lib/index';

const AgreeItem = Checkbox.AgreeItem;

class Register extends Component {

  state = {
    inputDataSource: [
      {
        type: 'text',
        label: '',
        placeholder: '手机号码',
        initialValue: '',
        key: 'phone',
        rules: [
          {required: true, message: '请输入手机号码'},
          {pattern: /^1[3456789]\d{9}$/, message: '请输入正确手机号码'}
        ],
        error: '',
        onBlur: this.blurPhone.bind(this),
        props: {
          // clear: true,
        }
      },
      {
        type: 'password',
        label: '',
        placeholder: '请输入密码',
        initialValue: '',
        key: 'password',
        rules: [
          {required: true, message: '请输入密码'},
          {
            pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)(?!^.*[\u4e00-\u9fa5].*$)\S{8,16}$/,
            message: '8-16位字母,数字,符号的组合'
          }
        ],
        error: '',
        info: '8-16位字母、数字和符号的组合',
        onBlur: this.blurPassword.bind(this),
        onChange: this.changePassword.bind(this),
        props: {
          type: 'password'
        }
      },
      {
        type: 'code',
        label: '',
        placeholder: '输入验证码',
        initialValue: '',
        key: 'SMScode',
        rules: [
          {required: true, message: '输入验证码'},
        ],
        error: '',
        isCanGetCode: false,
        getCode: this.getCode.bind(this),
      }
    ],
    isAgreeProtocol: false
  };
  // 判断密码等级
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
  // 同上
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
    this.setState(({inputDataSource}) => {
      console.log(num);
      if (val) {
        inputDataSource[1].info = this.psdIndicator(num);
      }
      return inputDataSource;
    });
  };

  // 输出密码等级 将其置为出错的位置
  psdIndicator = (passwordStrength) => {
    switch (passwordStrength) {
      case 1:
        return (<p>密码强度：<span className="color-FF3333">低</span></p>);
      case 2:
        return (<p>密码强度：<span className="color-FF771C ">中</span></p>);
      case 3:
        return (<p>密码强度：<span className="color-33CC33">高</span></p>);
      default:
        return '';
    }
  };

  leftClick = () => {
    this.props.history.replace('/login');
  };

  register = () => {
    if (!this.state.isAgreeProtocol) {
      Toast.info('请阅读并同意《萤石服务协议》和《萤石隐私政策》');
      return;
    }
    this.myInputItem.myValidateFields(val => {
      console.log(val);
      const data = {
        phone: val.phone,
        password: md5(val.password),
        smsCode: val.SMScode
      };
      api.ysUserRegister(data)
        .then(res => {
          if (res.retcode === 0) {
            Toast.info('注册成功');
            setTimeout(() => {
              this.props.history.push('/login');
            }, 2000);
          } else {
            Toast.info(res.msg || '注册失败!');
          }
        });

    });
  };

  jumpLogin() {
    this.props.history.goBack();
  }

  // 当输入手机号码失去焦点时 需要验证这个手机号是否存在
  blurPhone(e) {
    const reg = /^1[3456789]\d{9}$/, data = {
      v: e,
      t: !reg.test(e) ? 1 : 2
    };
    this.existUserHandle(data);
  }

  existUserHandle(data) {
    return new Promise((resolve, reject) => {
      api.existUser(data)
        .then(res => {
          if (res && res.registered) {
            this.setState(({inputDataSource}) => {
              if (data.v) {
                inputDataSource[0].error = res.msg ||
                  <div>该号码已经是萤石云视频账号，可<span style={{color: '#FF8F42'}} onClick={this.jumpLogin.bind(this)}>直接登录</span>
                  </div>;
              }
              return Object.assign({}, inputDataSource);
            });
          }
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
          Toast.fail('网络异常');
        });
    });


  }

  // 输入密码处失去焦点
  blurPassword(e) {
    console.log(e);
    // if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)(?!^.*[\u4e00-\u9fa5].*$)\S{8,16}$/.test(e)) {
    //   this.setState(({inputDataSource}) => {
    //     if (e) {
    //       inputDataSource[1].error = '8-16位字母,数字,符号的组合';
    //     }
    //     return inputDataSource;
    //   });
    //   return;
    // }
    this.checkPassWordMode(e);
  }

  // 输入密码时 onChange事件
  changePassword(e) {
    this.checkPassWordMode(e);
  }

  getCode(val) {
    console.log(val);
    this.myInputItem.myValidateFields((val, array) => {
      if (!array.length) {
        const reg = /^1[3456789]\d{9}$/, data = {
          v: val.phone,
          t: !reg.test(val.phone) ? 1 : 2
        };
        this.existUserHandle(data)
          .then(res => {
            if (res && res.registered) {
              Toast.info('用户已存在!');
            } else {
              Toast.loading();
              api.getSMS({
                phone: val.phone
              })
                .then(res => {
                  console.log(res);
                  if (res.retcode === 0) {
                    this.myInputItem.getCode();
                    Toast.hide();
                  } else {
                    Toast.fail(res.msg);
                  }
                });
            }
          });
      } else {
        Toast.info('请直接登录');
      }
    }, ['phone']);
  }

  changeProtocol(e) {
    this.setState({
      isAgreeProtocol: e.target.checked
    });
  }

  render() {
    const {inputDataSource, isAgreeProtocol} = this.state;
    return (
      <div className='register'>
        <MliveHeader leftShow leftClick={this.leftClick} title='注册账号'/>

        <div>
          <MyInputItem
            wrappedComponentRef={ref => this.myInputItem = ref}
            dataSource={inputDataSource}
          />
        </div>

        <div className='register-submit'>
          <AgreeItem onChange={this.changeProtocol.bind(this)}>
            我已阅读并同意<a href='https://service.ys7.com/mobile/policy?id=142' className='protocol-link'>《萤石服务协议》</a> <a
            href='https://service.ys7.com/mobile/policy?id=140' className='protocol-link'>《萤石隐私政策》</a>
            和<a href='https://service.ys7.com/mobile/policy?id=148' className='protocol-link'>《萤石开放平台服务协议》</a>
          </AgreeItem>
          <MyButton title='注册' disabled={!isAgreeProtocol} onClick={this.register}/>
        </div>
      </div>
    );
  }
}


export default createForm()(Register);
