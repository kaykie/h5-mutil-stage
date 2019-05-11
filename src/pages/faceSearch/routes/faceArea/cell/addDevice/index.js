import React, {Component} from 'react';
import {Button, InputItem} from 'antd-mobile';
import NavBar from '../../../../components/navBar/index';
import SaveBtn from '../../../../components/saveBtn/index';
import {connect} from 'dva';
import {createForm} from 'rc-form';
import './index.less';

class AddDevice extends Component {


  save() {
    this.props.form.validateFields(err => {
      if(!err){
        const obj = this.props.form.getFieldsValue();
        this.props.dispatch({type:'faceApp/saveDevice',payload:{obj}});
      }
    });
  }

  addDelhandle(type){
    this.props.dispatch({type:'faceApp/addDelhandle',payload:{type}});
  }

  render() {
    const {getFieldProps, getFieldError} = this.props.form, {deviceList} = this.props;
    return (
      <div className='addDevice'>
        <NavBar title='添加设备'/>
        {
          deviceList.map((item, index) => {
            return (
              <div className='device-list' key={index}>
                <InputItem
                  {...getFieldProps(`deviceSerial${item.key}`, {
                    initialValue: '',
                    rules: [
                      {required: true}
                    ],
                  })}
                  error={getFieldError(`deviceSerial${item.key}`)}
                  placeholder='请输入设备序列号'
                >设备序列号</InputItem>
                <InputItem
                  {...getFieldProps(`channelNo${item.key}`, {
                    initialValue: '',
                    rules: [
                      {required: true}
                    ],
                  })}
                  error={getFieldError(`channelNo${item.key}`)}
                  placeholder='请输入设备通道号'
                >设备通道号</InputItem>
              </div>
            );
          })
        }


        <div className='btn-array'>
          <Button inline type='primary' onClick={this.addDelhandle.bind(this,'add')}>添加一组</Button>
          <Button inline type='warning' onClick={this.addDelhandle.bind(this,'del')}>删除一组</Button>
        </div>
        <SaveBtn
          onSaveHandle={this.save.bind(this)}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deviceList: state.faceApp.deviceList,
  };
}

const AddDevice2 = createForm()(AddDevice);
export default connect(mapStateToProps)(AddDevice2);
