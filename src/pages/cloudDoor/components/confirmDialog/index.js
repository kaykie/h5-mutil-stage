import React, {Component} from 'react';
import {Modal} from 'antd-mobile';
import './index.less';


class ConfirmDialog extends Component {

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
    const {title, info, confirmText, confirmColor, cancelColor, modelClass, cancelText, isVisible} = this.props;
    return (
      <Modal
        visible={isVisible}
        className={`cloud-dialog  ${modelClass}`}
        wrapClassName="cloud-modal"
        transparent={true}
        maskClosable={false}
        title={title || ''}
        animationType="slide-down"
        footer={[
          {text: confirmText || '删除', style: {color: confirmColor || '#ff8f42'}, onPress: this.props.onConfirm},
          {text: cancelText || '取消', style: {color: cancelColor || '#333'}, onPress: this.props.onCancel}
        ]}
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
      >
        <div className="cloud-dialog__content">
          <p className="cloud-dialog__info">{info || '确认要将该设备删除吗？'}</p>
        </div>
      </Modal>
    );
  }
}


export default ConfirmDialog;
