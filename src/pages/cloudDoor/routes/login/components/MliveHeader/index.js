import React from 'react';
import {Icon} from 'antd-mobile';
import './index.less';

const MliveHeader = ({leftShow = false, title = '直播列表', rightShow = false, leftClick}) => {
  return (
    <div className="mlive-header">
      <div className={`header-left${leftShow ? '' : ' hide'}`} onClick={leftClick}>
        <Icon type="left" size="lg"
              color="#333"/>
      </div>
      <div className="header-ct">{title}</div>
      <div className={`header-right${rightShow ? '' : ' hide'}`}/>
    </div>
  );
};

export default MliveHeader;
