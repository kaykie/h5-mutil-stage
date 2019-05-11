import React, {Component} from 'react';
import {connect} from 'react-redux';
import MyNavBar from '../../../../components/navBar';
import MsgList from './cellList';
import './index.less';

export class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    };
  }

  // 刷新
  handleUpdate() {
    this.props.dispatch({type: 'person/onRefreshInitPersonMsgList'});
  }

  render() {
    const {updateInfoPerson} = this.props;
    console.log(updateInfoPerson);
    let title = '';
    if (updateInfoPerson.saasPersonId) {
      if (updateInfoPerson.person) {
        title = updateInfoPerson.person.personName;
      } else {
        title = updateInfoPerson.saasPersonId;
      }
    } else if (updateInfoPerson.personName) {
      title = updateInfoPerson.personName;
    }
    return (
      <div className="cloud-content cloud-person__msg__detail--wrap">
        <MyNavBar
          title={`${title}信息同步进度`}
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
  updateInfoPerson: state.person.updateInfoPerson,
});

export default connect(mapStateToProps)(MessageDetail);
