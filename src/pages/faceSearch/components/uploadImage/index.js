import React, {Component} from 'react';
import {Modal, ImagePicker,Button} from 'antd-mobile';
import './index.less';
import PubliceService from '../../../../services/PubliceService';

class UploadImage extends Component {

  state = {
    isVisible: false
  };


  componentDidMount() {
    this.setState({
      // isVisible: this.props.isVisible
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible) {
      this.setState({
        // isVisible: nextProps.isVisible
      });
    }
  }

  onCancel() {
    this.setState({
      isVisible: false
    });
  }

  onWrapTouchStart() {

  }


  addImage(){
    this.setState({
      isVisible:true
    })
  }

  onChange(file){
    PubliceService.getImgBase64(file[0].file)
      .then(base64 =>{
        this.setState({
          base64,
          isVisible:false
        },()=>{
          this.props.onChange(file)
        })
      })

  }

  render() {
    const {isVisible,base64} = this.state;
    return (
      <div>
        <div onClick={this.addImage.bind(this)}>
          <img style={{width:300}} src={base64 ? base64 : require('../../assets/images/addImg.jpg')} alt=""/>
        </div>
        <Modal
          visible={isVisible}
          transparent
          maskClosable
          title=""
          className='cloud-dialog__select'
          wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
          <div className="cloud-dialog__select--wrap">
            <div className="cloud-dialog__select--inner">
              <ul className="cloud-dialog__select__list">
                <li className="cloud-dialog__select__item">
                  <div className='cloud-picker-btn cloud-dialog__select__btn'>
                    <span>拍照</span>
                    <ImagePicker
                      className='cloud-image-picker'
                      length="1"
                      accept='image/*'
                      capture='camera'
                      files={this.state.files}
                      selectable={true}
                      onChange={this.onChange.bind(this)}
                      multiple={false}
                    />
                  </div>
                </li>
                <li className='cloud-dialog__select__item'>
                  <div className='cloud-picker-btn cloud-dialog__select__btn'>
                    <span>本地相册</span>
                    <ImagePicker
                      className='cloud-image-picker'
                      accept=''
                      length="1"
                      files={this.state.files}
                      selectable={true}
                      onChange={this.onChange.bind(this)}
                      multiple={false}
                    />
                  </div>
                </li>
              </ul>
            </div>
            <div className="cloud-dialog__select--inner">
              <ul className="cloud-dialog__select__list">
                <li className="cloud-dialog__select__item">
                  <Button onClick={this.onCancel.bind(this)}>取消</Button>
                </li>
              </ul>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UploadImage;
