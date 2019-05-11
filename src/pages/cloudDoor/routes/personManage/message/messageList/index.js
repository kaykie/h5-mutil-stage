import React, {Component} from 'react';
import {connect} from 'dva';
import MyNavBar from '../../../../components/navBar';
import MsgList from './cellList';
import './index.less';

class MessageList extends Component {

  // 刷新
  handleUpdate() {
    this.props.dispatch({type: 'person/onRefreshInitMsgList'});
  }

  render() {
    return (
      <div className="cloud-content cloud-person__msg">
        <MyNavBar
          title='人员/设备信息同步'
          isRightOperate
          operateContent={{
            text: '',
            className: 'iconfont cloud-icon-navigation_icn_refresh_norx cloud-update__btn',
          }}
          onHandleOperate={this.handleUpdate.bind(this)}
        />
        <MsgList />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(MessageList);