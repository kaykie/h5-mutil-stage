import React, {Component} from 'react';
import {InputItem, Picker, List} from 'antd-mobile';
import {createForm} from 'rc-form';
import './index.less';


class personInput extends Component {

  state = {
    inputList: [],
    btnStatus: false
  };

  componentDidMount() {
    this.setState({
      inputList: this.props.dataSource
    });
    console.log(this.state.inputList);
  }

  myValidateFields = (callback) => {
    console.log('myValidateFields');
    const inputList = this.state.inputList;
    this.props.form.validateFields(errors => {
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
        callback(this.props.form.getFieldsValue());
      }
    });
  };


  blur(value, item) {
    console.log('blur');
    const array = this.state.inputList;
    this.props.form.validateFields([item.key], (err, value) => {
      console.log(err);
      console.log(value);
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

  // 检测按钮状态
  checkedBtnStatus(value, item) {
    // console.log(value);
    // console.log(item);
    // let btnStatus = true;
    // switch (item.key) {
    //   case 'personName':
    //     if (/^[\u4e00-\u9fa5_a-zA-Z0-9·]{1,25}$/.test(value)) {
    //       console.log('合格');
    //       btnStatus = false;
    //     } else {
    //       console.log('不合格');
    //       btnStatus = true;
    //     }
    //     break;
    //   case 'phoneNumber':
    //     if (/^1[3456789]\d{1}\s?\d{4}\s?\d{4}$/.test(value)) {
    //       console.log('phoneNumber合格');
    //       btnStatus = false;
    //     } else {
    //       console.log('phoneNumber不合格');
    //       btnStatus = true;
    //     }
    //     break;
    //   default:
    //     break;
    // }
    // this.setState({
    //   btnStatus: btnStatus
    // });
    // console.log(this.state.btnStatus);
  }

  // 选择性别
  handleGender(radio) {
    const tempList = this.state.inputList;
    tempList.forEach(item => {
      if (item.key === 'gender') {
        item.initialValue = radio.value;
      }
    });
    this.setState({
      inputList: tempList,
    });
  }

  render() {
    const {getFieldProps} = this.props.form, {inputList} = this.state;
    return (
      <ul className="cloud-form">
        {
          inputList.map((item, index) => {
            return (
              <li key={index} className="cloud-form__item">
                {
                  item.inputType === 'title' && <h6 className="cloud-person__form__title">{item.text}</h6>
                }
                {
                  item.inputType === 'input' &&
                  <div className="cloud-form__item--inner">
                    <p className="cloud-form__label" dangerouslySetInnerHTML={{__html: item.label}}></p>
                    <InputItem
                      placeholder={item.placeholder || ''}
                      clear="true"
                      type={item.type || 'text'}
                      maxLength={item.maxLength || ''}
                      {...getFieldProps(item.key, {
                        initialValue: item.initialValue,
                        onBlur: (e) => {
                          this.checkedBtnStatus(e, item);
                          this.blur(e, item);
                        },
                        rules: item.rules || [],
                        validateTrigger: ['onBlur', 'onChange']
                      })}
                    />
                  </div>
                }
                {
                  item.inputType === 'radio' &&
                  <div className="cloud-form__item--sex">
                    <p className="cloud-form__label">{item.label}</p>
                    <div className="cloud-form__sex">
                      {
                        item.data.map((radio, index) => {
                          return (
                            <span
                              key={index}
                              {...getFieldProps(item.key, {
                                initialValue: item.initialValue,
                              })}
                              onClick={this.handleGender.bind(this, radio)}
                              className={item.initialValue === radio.value ? 'cloud-form__sex__item active' : 'cloud-form__sex__item'}
                            >{radio.label}</span>
                          );
                        })
                      }
                    </div>
                  </div>
                }
                {
                  item.inputType === 'select' &&
                  <div className="cloud-form__item--inner cloud-form__select">
                    <p className="cloud-form__label">{item.label}</p>
                    <Picker
                      data={item.data}
                      cols={item.cols}
                      className="cloud-picker"
                      {...getFieldProps(item.key, {
                        initialValue: item.initialValue,
                        rules: item.rules || [],
                      })}
                      onOk={e => this.blur(e, item)}
                    >
                      <List.Item arrow="horizontal"></List.Item>
                    </Picker>
                  </div>
                }
                {item.error && <p className="cloud-error__tips">{item.error}</p>}
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default createForm()(personInput);
