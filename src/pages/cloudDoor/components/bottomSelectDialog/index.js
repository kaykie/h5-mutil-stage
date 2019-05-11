import React, {Component} from 'react';
import {Modal, Button} from 'antd-mobile';
import ImagePickerBtn from './../imagePickerBtn';
import './index.less';

class BottomSelectDialog extends Component {

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
    // console.log(111)
  }

  render() {
    const {isVisible} = this.props;
    console.log(this.props);
    return (
      <Modal
        visible={isVisible}
        transparent
        maskClosable={false}
        title=""
        className='cloud-dialog__select'
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
      >
        <div className="cloud-dialog__select--wrap">
          <div className="cloud-dialog__select--inner">
            <ul className="cloud-dialog__select__list">
              <li className="cloud-dialog__select__item">
                <ImagePickerBtn
                  className='cloud-dialog__select__btn'
                  btnText='拍 照'
                  capture='camera'
                  accept="image/jpeg"
                  uploadChange={this.props.uploadChange}
                />
              </li>
              <li className="cloud-dialog__select__item">
                <ImagePickerBtn
                  className='cloud-dialog__select__btn'
                  btnText='本地相册'
                  uploadChange={this.props.uploadChange}
                />
              </li>
            </ul>
          </div>
          <div className="cloud-dialog__select--inner">
            <ul className="cloud-dialog__select__list">
              <li className="cloud-dialog__select__item">
                <Button onClick={this.props.onCancel}>取消</Button>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BottomSelectDialog;
