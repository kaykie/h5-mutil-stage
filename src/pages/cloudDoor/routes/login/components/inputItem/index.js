import React, {Component} from 'react';
import {InputItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import './index.less';


class MyInputItem extends Component {

  state = {
    inputList: [],
    isShowPassword: false, // 是否展示明文密码
    isFirstGetCode: true, // 是否第一次获取验证码
    codeTime: 0, // 获取验证码倒计时
  };

  componentDidMount() {
    const propsDetail = Object.assign({}, this.props);
    delete propsDetail.dataSource;
    this.setState({
      inputList: this.props.dataSource,
      propsDetail
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (this.props.dataSource !== nextProps.dataSource) {
      console.log(nextProps.dataSource);
      this.setState({
        inputList: nextProps.dataSource,
      });
    }

  }

  myValidateFields = (callback, validateFields) => {
    const inputList = this.state.inputList;

    this.props.form.validateFields(validateFields, errors => {
      if (errors) {
        inputList.forEach(item => {
          if (errors[item.key]) {
            item.error = errors[item.key].errors[0].message;
          } else {
            item.error = '';
          }
        });
        this.setState({
          inputList
        });
      } else {
        let array = inputList.filter(item => item.error);
        if (validateFields && array) {
          const array2 = [];
          validateFields.forEach(item => {
            const findArray = array.find(item2 => item2.key === item);
            array2.push(findArray);
          });
          array = array2.filter(item => item);
        }
        console.log(array, validateFields);

        callback(this.props.form.getFieldsValue(),array);
      }
    });
  };


  blur(value, item) {
    const array = this.state.inputList;
    this.props.form.validateFields([item.key], (err, value) => {
      if (err) {
        array.find(obj => item.key === obj.key).error = err[item.key].errors[0].message;
        this.setState({
          inputList: array
        });
      } else {
        array.find(obj => item.key === obj.key).error = '';
        this.setState({
          inputList: array
        });
        this.forceUpdate();
      }
    });
  }

  // 点击密码输入框最右侧眼睛按钮
  passwordImgChange() {
    this.setState({
      isShowPassword: !this.state.isShowPassword
    });
  }

  // 获取验证码
  getCode = (item) => {

    this.setState({
      codeTime: 60,
      isFirstGetCode: true
    });
    this.timer = setInterval(() => {
      if (this.state.codeTime === 0) {
        clearInterval(this.timer);
        return;
      }
      this.setState({
        codeTime: --this.state.codeTime,
        isFirstGetCode: false
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {getFieldProps} = this.props.form, {inputList, isShowPassword, codeTime, isFirstGetCode} = this.state;
    return (
      <div className='my-inputItem'>
        {
          inputList.map((item, index) => {

            if (item.type === 'text') {
              return (
                <div className='add-item' key={index}>
                  {
                    item.label &&
                    <div>
                      {item.label}
                    </div>
                  }
                  <InputItem
                    placeholder={item.placeholder || ''}
                    {...item.props}
                    {...getFieldProps(item.key, {
                      initialValue: item.initialValue,
                      onBlur: (e) => {
                        this.blur(e, item);
                        if (item.onBlur) {
                          item.onBlur(e);
                        }
                      },
                      onChange: (e) => {
                        if (item.onChange) {
                          item.onChange(e);
                        }
                      },
                      rules: item.rules || [],
                      validateTrigger: ['onBlur', 'onChange'],
                    })}
                  >
                    {item.children}
                  </InputItem>
                  {
                    item.error ?
                      typeof(item.error) === 'string' ?
                        <div className='input-error'>{item.error}</div> :
                        item.error :
                      <span className='input-info'>{item.info}</span>
                  }
                </div>
              );
            } else if (item.type === 'password') {
              return (
                <div className='add-item password-item' key={index}>
                  {
                    item.label &&
                    <div>
                      {item.label}
                    </div>
                  }
                  <InputItem
                    placeholder={item.placeholder || ''}
                    {...item.props}
                    type={isShowPassword ? 'text' : 'password'}
                    {...getFieldProps(item.key, {
                      initialValue: item.initialValue,
                      onBlur: (e) => {
                        this.blur(e, item);
                        if (item.onBlur) {
                          item.onBlur(e);
                        }
                      },
                      onChange: (e) => {
                        if (item.onChange) {
                          item.onChange(e);
                        }
                      },
                      rules: item.rules || [],
                      validateTrigger: ['onBlur', 'onChange'],
                    })}
                  >
                    {item.children}
                  </InputItem>
                  <img className='password-img' onClick={this.passwordImgChange.bind(this)}
                       src={isShowPassword ? require('../../assets/login_icon_visible@2x.png') : require('../../assets/login_icon_disvisible@2x.png')}
                       alt=""/>
                  {
                    item.error ?
                      typeof(item.error) === 'string' ?
                        <div className='input-error'>{item.error}</div> :
                        item.error :
                      <span className='input-info'>{item.info}</span>
                  }
                </div>
              );
            } else if (item.type === 'code') {
              return (
                <div className='add-item code-item' key={index}>
                  {
                    item.label &&
                    <div>
                      {item.label}
                    </div>
                  }
                  <InputItem
                    placeholder={item.placeholder || ''}
                    {...item.props}
                    type='text'
                    {...getFieldProps(item.key, {
                      initialValue: item.initialValue,
                      onBlur: (e) => {
                        this.blur(e, item);
                        if (item.onBlur) {
                          item.onBlur(e);
                        }
                      },
                      onChange: (e) => {
                        if (item.onChange) {
                          item.onChange(e);
                        }
                      },
                      rules: item.rules || [],
                      validateTrigger: ['onBlur', 'onChange'],
                    })}
                  >
                    {item.children}
                  </InputItem>
                  <div className='inputItem-code'>
                    {
                      (!codeTime && isFirstGetCode) ?
                        <span onClick={item.getCode}>获取验证码</span> : codeTime ?
                        <span>再次获取({codeTime})</span> :
                        <span onClick={item.getCode}>再次获取</span>
                    }
                  </div>
                  {
                    item.error ?
                      typeof(item.error) === 'string' ?
                        <div className='input-error'>{item.error}</div> :
                        item.error :
                      <span className='input-info'>{item.info}</span>
                  }
                </div>
              );
            }

            return (
              <div>

              </div>
            );
          })
        }
      </div>
    );
  }
}


export default createForm()(MyInputItem);
