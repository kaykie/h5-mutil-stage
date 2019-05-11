import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal} from 'antd-mobile';
import './index.less';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

class MsgSyncDialog extends Component {

  onWrapTouchStart() {
    // console.log(111)
  }

  // 查看结果
  handleConfirm() {
    if (this.props.defalutConfirm) {
      if (this.props.isLookOver) {
        history.push('/person/message/detail');
        this.props.dispatch({type: 'person/save', payload: {isSyncVisible: false, isLookOver: false}});
      }
    } else {
      this.props.onConfirm();
    }
  }

  // 关闭
  handleCancel() {
    this.props.dispatch({type: 'person/save', payload: {isSyncVisible: false, isLookOver: false, isStartCountdown: false}});
    this.props.onCancel();
  }

  render() {
    const {isSyncVisible, clockTime, isLookOver} = this.props;
    // const confirmText = isLookOver?'查看结果'
    return (
      <Modal
        visible={isSyncVisible}
        className='cloud-dialog__sync'
        wrapClassName="cloud-modal"
        transparent={true}
        maskClosable={false}
        title='信息保存成功'
        animationType="slide-down"
        footer={[
          {
            text: `查看结果${!isLookOver ? `(${clockTime})` : ''}`,
            style: {color: isLookOver ? '#ff8f42' : '#ffc7a0'},
            onPress: this.handleConfirm.bind(this)
          },
          {
            text: '关闭', style: {color: '#333'},
            onPress: this.handleCancel.bind(this)
          }
        ]}
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
      >
        <div className="cloud-dialog__content">
          <p className="cloud-dialog__info">正在将信息同步到设备，请稍后查看</p>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSyncVisible: state.person.isSyncVisible,
    isLookOver: state.person.isLookOver
  };
}

export default connect(mapStateToProps)(MsgSyncDialog);
