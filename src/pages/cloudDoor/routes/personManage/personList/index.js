import React, {Component} from 'react';
import {connect} from 'dva';
import {SwipeAction, Button} from 'antd-mobile';
import MyListView from './../../../components/listView';
import ConfirmDialog from './../../../components/confirmDialog';
import createHashHistory from 'history/createHashHistory';
import './index.less';

const history = createHashHistory();

class PersonList extends Component {
  constructor() {
    super();
    this.state = {
      swipeStatus: false
    };
  }

  scrollEndHandle() {
    this.props.dispatch({type: 'person/endRefreshPersonList'});
  }

  onRefresh() {
    this.props.dispatch({type: 'person/onRefreshInitPersonList'});
  }

  // 左滑打开
  handleSwiperOpen = () => {
    this.setState({
      swipeStatus: true
    });
  }

  // 人员详情
  handleDetail(currentPerson) {
    if (!this.state.swipeStatus) {
      this.props.dispatch({
        type: 'person/save',
        payload: {
          currentPerson,
          personRelationDevice: [],
          pageNoRelation: 1,
          detailIsOperate: true
        }
      });
      history.push(`/person/detail/${currentPerson.id}`);
    } else {
      this.setState({
        swipeStatus: false
      });
    }
  }

  // 弹出删除弹框
  handleDel(currentPerson) {
    this.setState({
      swipeStatus: false
    });
    this.props.dispatch({type: 'person/save', payload: {isDelVisible: true, currentPerson}});
  }

  // 确认删除
  handleConfirm() {
    this.props.dispatch({type: 'person/delPerson'});
  }

  // 取消删除
  handleCancel() {
    this.props.dispatch({type: 'person/save', payload: {isDelVisible: false, currentPerson: {}}});
  }

  // 权限下发
  handlePermission = (permissionPerson) => {
    this.props.dispatch({
      type: 'person/save',
      payload: {
        permissionPerson
      }
    });
    history.push('/person/device');
  }
  render() {
    const {isLoading, isEndLoading, isInitError, isInitLoading, isError, dataSource, isDelVisible, isEndError} = this.props,
      row = (rowData) => {
        return (
          <div className="cloud-person__item--wrap">
            <SwipeAction
              autoClose={true}
              right={[
                {
                  text: '删除',
                  onPress: this.handleDel.bind(this, rowData),
                  style: {backgroundColor: '#FB4848', color: '#fff', fontSize: '0.4rem', padding: '0 0.4667rem'},
                }
              ]}
              onOpen={this.handleSwiperOpen}
            >
              <div className="cloud-layout cloud-person__item">
                <div onClick={this.handleDetail.bind(this, rowData)} className="cloud-layout--inner">
                  <div className="cloud-layout__photo">
                    <span className="cloud-layout__photo--round">
                      {rowData.faceImageUrl ? <img className="cloud-layout__img" src={rowData.faceImageUrl} alt="" /> : <i className="iconfont cloud-icon-bar_personnel_selx"></i>}
                    </span>
                  </div>
                  <div className="cloud-layout__info">
                    <h6 className="cloud-layout__info__master">{rowData.personName}</h6>
                    <p className="cloud-layout__info__duplicate">{rowData.phoneNumber}</p>
                  </div>
                </div>
                <div className="cloud-btn--line cloud-layout__btn">
                  <Button onClick={this.handlePermission.bind(this, rowData)}>权限下发</Button>
                </div>
              </div>
            </SwipeAction>
          </div>
        );
      };
    return (
      <div className='deviceList'>
        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          // isNoMoreData={false}
          isLoading={isLoading}
          isEndLoading={isEndLoading}
          dataSource={dataSource}
          isError={isError}
          isEndError={isEndError}
          isInitLoading={isInitLoading}
          isInitError={isInitError}
        />
        <ConfirmDialog
          info={'确认要将该人员信息删除吗？'}
          modelClass='cloud-dialog--del'
          isVisible={isDelVisible}
          onConfirm={this.handleConfirm.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    isLoading: state.person.isLoading,
    isEndLoading: state.person.isEndLoading,
    isInitLoading: state.person.isInitLoading,
    isInitError: state.person.isInitError,
    dataSource: state.person.dataSource,
    isError: state.person.isError,
    isEndError: state.person.isEndError,
    isDelVisible: state.person.isDelVisible
  };
}

export default connect(mapStateToProps)(PersonList);
