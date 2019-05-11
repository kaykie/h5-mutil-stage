import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import SearchBar from '../../../../components/searchBar';
import MyListView from '../../../../components/listView';
import DataStatusDeal from '../../../../components/dataStatusDeal';
import createHashHistory from 'history/createHashHistory';
import './index.less';

const history = createHashHistory();

class SearchResult extends Component {

  // 上拉加载
  scrollEndHandle() {
    this.props.dispatch({type: 'cloudDoor/endRefreshAllSearch'});
  }

  // 下拉刷新
  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/onRefreshInitDeviceList'});
  }

  // 提交
  submit() {
    this.props.dispatch({type: 'cloudDoor/searchPersonSubmit'});
  }

  // 改变搜索内容
  searchChange(deviceSerialOrName) {
    if (deviceSerialOrName) {
      this.props.dispatch({type: 'cloudDoor/save', payload: {deviceSerialOrName}});
      this.props.dispatch({type: 'cloudDoor/searchPersonSubmit'});
    } else {
      this.props.dispatch({type: 'cloudDoor/save', payload: {dataSource: []}});
    }
  }

  // 取消搜索
  cancelHandle() {
    history.goBack();
    this.props.dispatch({type: 'cloudDoor/save', payload: {deviceSerialOrName: '', dataSource: [], isInitResult: false}});
  }

  componentDidUpdate() {
    if (this.props.permissionLoading) {
      Toast.hide();
    }
  }

  // 下发
  handlePermission = (permissionDevice) => {
    Toast.loading('权限下发中，请稍后...', 0);
    this.props.dispatch({type: 'person/save', payload: {permissionDevice}});
    this.props.dispatch({type: 'person/setPermission'});
  }

  componentWillUnmount() {
    Toast.hide();
  }

  render() {
    const {dataSource, isLoading, isError, isInitResult} = this.props,
      row = (rowData) => {
        return (
          <div className="cloud-layout cloud-person__device__item">
            <div className="cloud-layout__photo">
              <span className="cloud-layout__photo--square">
                <img className="cloud-layout__img" src={require('../../../../assets/images/doorImg.png')} alt="" />
              </span>
            </div>
            <div className="cloud-layout__info">
              <h6 className="cloud-layout__info__master">{rowData.deviceName}</h6>
              <p className="cloud-layout__info__duplicate">{rowData.model}</p>
            </div>
            <div className="cloud-btn--line cloud-layout__btn">
              <Button onClick={this.handlePermission.bind(this, rowData)}>下发</Button>
            </div>
          </div>
        );
      };
    return (
      <div className='cloud-content cloud-person-device__result'>
        <SearchBar
          placeholder='输入设备序列号、设备名称查找'
          onCancel={this.cancelHandle.bind(this)}
          onChange={this.searchChange.bind(this)}
          onSubmit={this.submit.bind(this)}
        />
        {
          isInitResult ? dataSource.length === 0 ?
            <DataStatusDeal type='empty' /> : <MyListView
              onEndReached={this.scrollEndHandle.bind(this)}
              onRefresh={this.onRefresh.bind(this)}
              renderRow={row}
              // isNoMoreData={false}
              isLoading={isLoading}
              dataSource={dataSource}
              isError={isError}
              isInitLoading={false}
              isInitError={false}
            /> : ''
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    dataSource: state.cloudDoor.dataSource,
    isError: state.cloudDoor.isError,
    isLoading: state.cloudDoor.isLoading,
    isInitResult: state.cloudDoor.isInitResult,
  };
}


export default connect(mapStateToProps)(SearchResult);

