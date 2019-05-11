import React, {Component} from 'react';
import {Modal} from 'antd-mobile';
import './index.less';


class MyConfirmModal extends Component {

  state = {
    isVisible: false
  };

  componentDidMount() {
    this.setState({
      isVisible: this.props.isVisible
    });
  }

  onClose() {
    this.setState({
      isVisible: false
    });
  }

  onWrapTouchStart() {
    console.log(111);
  }

  render() {
    const {title, confirmText, cancelText, isVisible} = this.props;
    return (
      <Modal
        visible={isVisible}
        transparent
        maskClosable={false}
        title=""
        className='myConfirmModal'
        footer={[{
          text: confirmText || '删除', onPress: this.props.onConfirm
        }, {
          text: cancelText || '取消', onPress: this.props.onCancel
        }]}
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
      >
        <div style={{height: 100, overflow: 'scroll'}}>
          {title || '确认要将该设备删除吗？'}
        </div>
      </Modal>
    );
  }
}


export default MyConfirmModal;
