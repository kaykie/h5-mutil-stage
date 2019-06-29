import React, {Component} from 'react';
import {Button} from 'antd-mobile';
import Image from './../image';
import './index.less';

class SearchNavBar extends Component {

  render() {
    const {type, className, imgUrl, info, isBtn, btnText} = this.props,
      loading = {
        className: '',
        info: '正在玩命加载中,请耐心等待',
        isBtn: false,
      },
      emptyStatus = {
        className: '',
        imgUrl: require('./../../assets/images/default_image_empty_page@2x.png'),
        info: '这里空空如也',
        isBtn: false,
      },
      failStatus = {
        className: '',
        imgUrl: require('./../../assets/images/default_image_load_failed@2x.png'),
        info: '加载失败，点击按钮重试',
        isBtn: true,
        btnText: '重新加载'
      };
    let currentStatus = {};
    switch (type) {
      case 'loading':
        currentStatus = loading;
        currentStatus.className = className || '';
        break;
      case 'empty':
        currentStatus = emptyStatus;
        currentStatus.className = className || '';
        break;
      case 'fail':
        currentStatus = failStatus;
        currentStatus.className = className || '';
        break;
      default:
        currentStatus = {
          className: className || '',
          imgUrl: imgUrl,
          info: info,
          isBtn: isBtn || false,
          btnText: btnText || '重新加载'
        };
        break;
    }
    return (
      <div className={`cloud-data__status  ${currentStatus.className}`}>
        <div className="cloud-data__status__img">
          {
            currentStatus.imgUrl ?
              <Image source={currentStatus.imgUrl} alt="" /> :
              <span className="cloud-data__status__loading"><i className='iconfont cloud-icon-Loading' /></span>
          }
        </div>
        <p className="cloud-data__status__info">{currentStatus.info}</p>
        {currentStatus.isBtn && <div className="cloud-btn--line cloud-data__status__btn">
          <Button onClick={this.props.onHandleData}>{currentStatus.btnText}</Button>
        </div>}
      </div>
    );
  }
}


export default SearchNavBar;
