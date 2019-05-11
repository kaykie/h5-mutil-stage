import React, {Component} from 'react';
import {connect} from 'dva';
import MyListView from '../../../../components/listView';
import './index.less';

class EventList extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'cloudDoor/endRefreshEventList'});
  }

  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/onRefreshInitEventList'});
  }

  spreadDetail(item) {
    this.props.dispatch({type: 'cloudDoor/spreadDetail', payload: {id: item.id}});
  }

  render() {
    const {isLoading, dataSource, isError, isEndError, isInitLoading, isInitError, isEndLoading, spreadList} = this.props;
    const row = (rowData) => {
      const boolean = spreadList.includes(rowData.id), isPersonDetail = !!rowData.person;
      return (
        <div className='eventList-item'>
          <div className='item-first-line'>
            <div
              style={{color: (rowData.acsEventType === '50028' || rowData.acsEventType === '50076') ? '#FB4848' : '#333333'}}>{rowData.acsEventName|| '--'}</div>
            <span>{rowData.dateTime|| '--'}</span>
          </div>
          <div>{rowData.deviceName|| '--'}</div>
          {
            boolean && [<div key='model'>设备型号:{rowData.deviceModel|| '--'}</div>, isPersonDetail ?
            <div key='personName'>{rowData.person.personName}</div>: <div key='personName'>--</div> , isPersonDetail ?
            <div key='phoneNum'>{rowData.person.phoneNumber|| '--'}</div>: <div key='phoneNum'>--</div>]
          }
          <div onClick={this.spreadDetail.bind(this, rowData)}>
            <i
              className={boolean ? 'iconfont cloud-icon-icn_triangle_down_norx-copy' : 'iconfont cloud-icon-icn_triangle_down_norx'}/>
          </div>
        </div>
      );
    };
    return (
      <div className='eventList'>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.cloudDoor.isLoading,
    dataSource: state.cloudDoor.dataSourceEvent,
    isError: state.cloudDoor.isError,
    isEndError: state.cloudDoor.isEndError,
    isInitLoading: state.cloudDoor.isInitLoading,
    isInitError: state.cloudDoor.isInitError,
    isEndLoading: state.cloudDoor.isEndLoading,
    spreadList: state.cloudDoor.spreadList,

  };
}

export default connect(mapStateToProps)(EventList);
