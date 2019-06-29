import React, {Component} from 'react';
import {ImagePicker} from 'antd-mobile';
import './index.less';

class ImagePickerBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  render() {
    const {className, btnText, accept, capture} = this.props;
    return (
      <div className={`cloud-picker-btn ${className || ''}`}>
        <span>{btnText}</span>
        <ImagePicker
          className='cloud-image-picker'
          accept={accept || 'image/*'}
          length="1"
          capture={capture || false}
          files={this.state.files}
          selectable={true}
          onChange={this.props.uploadChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          multiple={false}
        />
      </div>
    );
  }
}

export default ImagePickerBtn;
