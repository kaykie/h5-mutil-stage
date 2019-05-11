import React, {Component} from 'react';
import {connect} from 'dva';
import NavBar from '../../../../components/navBar';
import MyButton from '../../../../components/button';
import MyInputItem from '../../.././../components/inputItem';
import './index.less';

class AddDevice extends Component {


  submit() {
    this.myInputItem.myValidateFields((obj)=>{
      this.props.dispatch({type: 'cloudDoor/saveDevice', payload: {values: obj}});
    });

    // this.props.form.validateFields((err) => {
    //   this.props.dispatch({type: 'cloudDoor/saveErrorInfo', payload: {errors: err}});
    //   if (!err) {
    //     this.props.dispatch({type: 'cloudDoor/saveDevice', payload: {values: this.props.form.getFieldsValue()}});
    //   }
    // });
  }

  render() {
    const {isBtnLoading} = this.props;
    return (
      <div className='addDevice'>
        <NavBar title='添加设备'/>
        <MyInputItem
          wrappedComponentRef={ref => this.myInputItem = ref}
          dataSource={[
            {
              label: '设备序列号',
              placeholder: '请输入设备序列号',
              initialValue: '',
              key: 'deviceSerial',
              rules: [
                {required: true, message: '请输入设备序列号'},
                {pattern: /[0-9A-Z]{9}/, message: '设备序列号只能为9位的大写字母或数字'}
              ],
              error: ''
            },
            {
              label: '验证码',
              placeholder: '请输入验证码,区分大小写',
              initialValue: '',
              key: 'validateCode',
              rules: [
                {required: true, message: '请输入验证码,区分大小写'}
              ],
              error: ''
            },
          ]}
        />

        <div className='add-info'>
          温馨提示：<br/>目前支持设备型号有DS-K1T604系列、DS-K1T606系列、DS-K5604系列、DS-K1T606系列DS-K1T607系列、DS-K1T610系列。 <br/>
          在使用本应用前请咨询区域技术支持，将设备升级至支持萤石云版本。
        </div>

        <MyButton title='添加' disabled={isBtnLoading} onClick={this.submit.bind(this)}/>
      </div>
    );
  }
}




function mapStateToProps(state) {
  return {
    inputList: state.cloudDoor.inputList,
    isBtnLoading: state.cloudDoor.isBtnLoading,

  };
}

export default connect(mapStateToProps)(AddDevice);

