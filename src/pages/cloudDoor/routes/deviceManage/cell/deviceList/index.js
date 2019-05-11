import React, {Component} from 'react';
import './index.less';
import {connect} from 'dva';
import MySwiperAction from '../../../../components/swipeAction';
import MyListView from '../../../../components/listView';
import MyConfimModal from '../../../../components/myConfirmModal';
import createHashHistory from 'history/createHashHistory';
import Image from '../../../../components/image';

const history = createHashHistory();


class DeviceList extends Component {

  click() {
    this.props.onAddHandle();
  }


  scrollEndHandle() {

  }

  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/onRefreshInitDeviceList'});
  }


  componentDidMount() {

  }

  // 弹出删除弹框
  delHandle(uniqueDevice) {
    this.props.dispatch({type: 'cloudDoor/save', payload: {isDelVisible: true, uniqueDevice}});
  }

  // 跳转到设备详情页面
  jumpDeviceDetail(uniqueDevice) {
    const {isSwiperOpen} = this.props;
    if (isSwiperOpen) {
      this.props.dispatch({type: 'cloudDoor/save', payload: {isSwiperOpen: false}});
      return;
    }
    this.props.dispatch({
      type: 'cloudDoor/save',
      payload: {uniqueDevice, dataSourceRelation: [], pageNoRelation: 1, isShowRelation: false}
    });
    history.push('/deviceDetail');
  }

  // 确认删除
  confirmHandle() {
    this.props.dispatch({type: 'cloudDoor/delDevice'});
  }

  // 取消操作
  cancelHandle() {
    this.props.dispatch({type: 'cloudDoor/save', payload: {isDelVisible: false}});
  }

  openSwiper() {
    this.props.dispatch({type: 'cloudDoor/save', payload: {isSwiperOpen: true}});
  }

  render() {
    const {isLoading, isInitError, isInitLoading, isError, dataSource, isDelVisible, isEndError, isEndLoading} = this.props,
      row = (rowData) => {
        return (
          <MySwiperAction
            style={{backgroundColor: 'gray'}}
            right={[
              {
                text: '删除',
                onPress: this.delHandle.bind(this, rowData),
                style: {backgroundColor: '#F4333C', color: 'white'},
              },
            ]}
            onOpen={this.openSwiper.bind(this)}
          >
            <div className='deviceList-item' onClick={this.jumpDeviceDetail.bind(this, rowData)}>
              <div className='item-left'>
                <div className='item-img'>
                  <Image source={require('../../../../assets/images/entrance_guard@2x.png')} alt=""/>
                </div>
                <div className='item-detail'>
                  {rowData.deviceName}
                  <div>{rowData.model}({rowData.deviceSerial})</div>
                </div>
              </div>
              <div className='item-right'>
                {rowData.status === 0 ? <span style={{color: '#FB4848'}}>离线</span> : rowData.status === 1 ?
                  <span>在线</span> :
                  <span>无法获取是否在线状态</span>}
              </div>
            </div>
          </MySwiperAction>
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
          dataSource={dataSource}
          isError={isError}
          isEndLoading={isEndLoading}
          isEndError={isEndError}
          isInitLoading={isInitLoading}
          isInitError={isInitError}
        />
        <MyConfimModal
          isVisible={isDelVisible}
          onConfirm={this.confirmHandle.bind(this)}
          onCancel={this.cancelHandle.bind(this)}
        />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    isLoading: state.cloudDoor.isLoading,
    dataSource: state.cloudDoor.dataSource,
    isInitLoading: state.cloudDoor.isInitLoading,
    isInitError: state.cloudDoor.isInitError,
    isError: state.cloudDoor.isError,
    isEndError: state.cloudDoor.isEndError,
    isEndLoading: state.cloudDoor.isEndLoading,
    isDelVisible: state.cloudDoor.isDelVisible,
    isSwiperOpen: state.cloudDoor.isSwiperOpen
  };
}

export default connect(mapStateToProps)(DeviceList);
