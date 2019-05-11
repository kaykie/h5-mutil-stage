import React, {Component} from 'react';
import './index.less';
import {connect} from 'dva';
import MyListView from '../../../../components/listView';
import {Button, Toast} from 'antd-mobile';

class DeviceSelectList extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'cloudDoor/endRefreshAllSearch'});
  }

  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/onRefreshInitDeviceList'});
  }

  componentDidMount() {
    this.props.dispatch({type: 'cloudDoor/save', payload: {pageNo: 1, status: 1, dataSource: []}});
    this.props.dispatch({type: 'cloudDoor/getInitDeviceList'});
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
    const {isLoading, isInitError, isInitLoading, isError, dataSource, isEndError} = this.props,
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
      <div className='cloud-main'>
        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          // isNoMoreData={false}
          isLoading={isLoading}
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
    dataSource: state.cloudDoor.dataSource,
    isInitLoading: state.cloudDoor.isInitLoading,
    isInitError: state.cloudDoor.isInitError,
    isError: state.cloudDoor.isError,
    isEndError: state.cloudDoor.isEndError,
    updateInfoPerson: state.person.updateInfoPerson
  };
}

export default connect(mapStateToProps)(DeviceSelectList);
