import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {connect} from 'dva';
import NavBar from '../../../../components/navBar';
import {InputItem} from 'antd-mobile';
import MyButton from '../../../../components/button';
import '../addDevice/index.less';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

class AddDeviceName extends Component {


  submit() {
    this.props.form.validateFields((err) => {
      this.props.dispatch({type: 'cloudDoor/saveErrorInfoName', payload: {errors: err}});
      if (!err) {
        this.props.dispatch({type: 'cloudDoor/saveDeviceName', payload: {values: this.props.form.getFieldsValue()}});
      }
    });
  }

  jumpToIndex() {
    history.push('/index');
  }

  render() {
    const {getFieldProps} = this.props.form, {deviceNameError, initialValue, isFromDeviceDetail} = this.props;
    return (
      <div className='addDevice'>
        <NavBar
          title='修改设备名称'
          isRightOperate={isFromDeviceDetail}
          operateContent={{
            text: '跳过',
          }}
          onHandleOperate={this.jumpToIndex.bind(this)}/>
        <div className='add-warp'>
          <div className='add-item'>
            <div>
              设备名称
            </div>
            <InputItem
              placeholder='请输入设备名称'
              {...getFieldProps('deviceName', {
                initialValue: initialValue,
                rules: [{required: true, message: '请输入设备名称'},
                  {pattern: /^.{1,20}$/, message: '最长不超过20个字'}
                ],
              })}
            >
            </InputItem>
            {
              deviceNameError ?
                <div className='input-error'>{deviceNameError}</div> :
                <div className='input-info'>
                  建议用门禁点名称作为设备名称,长度不超过20个字
                </div>
            }
          </div>
        </div>
        <MyButton title='完成' onClick={this.submit.bind(this)}/>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    initialValue: state.cloudDoor.initialValueDeviceName,
    deviceNameError: state.cloudDoor.deviceNameError,
    isFromDeviceDetail: state.cloudDoor.isFromDeviceDetail,
  };
}

const FaceList2 = createForm()(AddDeviceName);


export default connect(mapStateToProps)(FaceList2);

