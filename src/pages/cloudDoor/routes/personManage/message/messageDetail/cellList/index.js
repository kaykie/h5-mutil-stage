import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import MyListView from './../../../../../components/listView';
import './index.less';

class CellList extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'person/endRefreshPersonMsgList'});
  }

  onRefresh() {
    this.props.dispatch({type: 'person/onRefreshInitPersonMsgList'});
  }

  componentDidMount() {
    this.props.dispatch({type: 'person/save', payload: {pageNoPersonMsg: 1, personMsgList: []}});
    this.props.dispatch({type: 'person/getInitPersonMsgList'});
  }

  componentDidUpdate() {
    if (this.props.permissionLoading) {
      Toast.hide();
    }
  }

  // 重新下发
  handlePermission(data) {
    const values = {
      saasPersonId: data.saasPersonId,
      personId: data.saasPersonId,
      deviceSerial: data.deviceSerial,
      doorRight: data.doorRight,
      cardReaderNo: data.cardReaderNo,
      cardNo: data.cardNo,
      isSetFace: data.isSetFace
    };
    Toast.loading('权限重新下发中，请稍后...', 0);
    this.props.dispatch({type: 'person/setRepeatPermission', payload: {values, syncType: data.syncType}});
  }

  componentWillUnmount() {
    Toast.hide();
  }

  render() {
    const {isLoading, isEndLoading, isInitError, isInitLoading, isError, personMsgList, isEndError} = this.props,
      row = (rowData) => {
        return (
          <div className="cloud-layout cloud-person__msg__detail">
            <div className="cloud-layout__photo">
              <span className="cloud-layout__photo--square">
                <img className="cloud-layout__img" src="" alt="" />
              </span>
            </div>
            <div className="cloud-layout__info">
              <h6 className="cloud-layout__info__master">{rowData.deviceName || rowData.deviceSerial}</h6>
              <p className="cloud-layout__info__duplicate">{rowData.deviceModel || '--'}</p>
              <p className="cloud-layout__info__duplicate">
                {
                  Number(rowData.syncStatus) === 2 ?
                    <span className='cloud-fc--red'>{rowData.syncMsg || '同步失败'}</span> :
                    Number(rowData.syncStatus) === 0 ?
                      <span className='cloud-fc--green'>{rowData.syncMsg || '等待同步'}</span> :
                      <span className='cloud-fc--green'>{rowData.syncMsg || '同步成功'}</span>
                }
              </p>
            </div>
            {
              Number(rowData.syncStatus) === 2 &&
              <div className="cloud-btn--line cloud-layout__btn">
                <Button onClick={this.handlePermission.bind(this, rowData)}>重新下发</Button>
              </div>
            }
          </div>
        );
      };
    return (
      <div className='cloud-main cloud-person__msg__detail__list'>
        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          // isNoMoreData={false}
          isLoading={isLoading}
          isEndLoading={isEndLoading}
          dataSource={personMsgList}
          isError={isError}
          isEndError={isEndError}
          isInitLoading={isInitLoading}
          isInitError={isInitError}
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
    personMsgList: state.person.personMsgList,
    isError: state.person.isError,
    isEndError: state.person.isEndError,
  };
}

export default connect(mapStateToProps)(CellList);
