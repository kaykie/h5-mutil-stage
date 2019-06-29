import React, {Component} from 'react';
import {InputItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import './index.less';


class MyInputItem extends Component {

  state = {
    inputList: []
  };

  componentDidMount() {
    this.setState({
      inputList: this.props.dataSource
    });
  }

  myValidateFields = (callback) => {
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

  render() {
    const {getFieldProps} = this.props.form, {inputList} = this.state;
    return (
      <div className='my-inputItem'>
        {
          inputList.map((item, index) => {
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
                  {...getFieldProps(item.key, {
                    initialValue: item.initialValue,
                    onBlur: (e) => {
                      this.blur(e, item);
                    },
                    rules: item.rules || [],
                    validateTrigger: ['onBlur','onChange'],
                  })}
                >
                  {item.children}
                </InputItem>
                {
                  item.error && <div className='input-error'>{item.error}</div>
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}


export default createForm()(MyInputItem);
