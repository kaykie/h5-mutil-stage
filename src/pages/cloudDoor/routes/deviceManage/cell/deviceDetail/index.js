import React, {Component} from 'react';
import {connect} from 'dva';
import './index.less';
import NavBar from '../../../../components/navBar';
import {List} from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';
import MyListView from '../../../../components/listView';
import MyConfimModal from '../../../../components/myConfirmModal';


const history = createHashHistory(),
  Item = List.Item;

class DeviceDetail extends Component {


  jumpAddDeviceName() {
    const {uniqueDevice} = this.props;
    this.props.dispatch({
      type: 'cloudDoor/save',
      payload: {
        initialValueDeviceName: uniqueDevice.deviceName,
        addDeviceSerial: uniqueDevice.deviceSerial,
        isFromDeviceDetail: false
      }
    });
    history.push('/addDeviceName');
  }

  scrollEndHandle() {
    this.props.dispatch({type: 'cloudDoor/endRefreshRelation'});
  }

  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/getInitRelation'});
  }

  componentDidMount() {
    this.props.dispatch({type: 'cloudDoor/getInitRelation'});
  }

  resolveRelation() {
    const {isShowRelation} = this.props;
    this.props.dispatch({type: 'cloudDoor/save', payload: {isShowRelation: !isShowRelation}});
  }


  confirmHandle() {
    this.props.dispatch({type: 'cloudDoor/resolveRelationConfirm', payload: {isDelVisible: false}});
  }

  cancelHandle() {
    this.props.dispatch({type: 'cloudDoor/save', payload: {isDelVisible: false}});
  }

  showDelConfirm(uniquePerson) {
    this.props.dispatch({type: 'cloudDoor/save', payload: {isDelVisible: true, uniquePerson}});
  }

  jumpToPersonDetail(item) {
    if (this.props.isShowRelation) {
      return;
    }
    this.props.dispatch({type: 'person/save', payload: {currentPerson: item.person, detailIsOperate: false}});
    history.push(`/person/detail/${item.person.id}`);
  }

  render() {
    const {uniqueDevice, isError, isLoading, dataSource, isShowRelation, isDelVisible, uniquePerson} = this.props,
      row = (rowData) => {
        return (
          <Item arrow={isShowRelation ? '' : 'horizontal'} onClick={this.jumpToPersonDetail.bind(this, rowData)}
            extra={<div className='deviceDetail-list-right'>
              <div>
                <span> {rowData.person.phoneNumber}</span>
              </div>
              {isShowRelation &&
                <i onClick={this.showDelConfirm.bind(this, rowData)} className='iconfont cloud-icon-icn_delete_x' />}
            </div>}>{rowData.person.personName}</Item>
        );
      };
    return (
      <div className='deviceDetail'>
        <NavBar title='设备详情' />
        <div className='deviceDetail-detail'>
          <div>
            <img src={require('../../../../assets/images/icn_entrance_guard@2x.png')} alt="" />
          </div>
          <div className='detail-name'>
            <div>{uniqueDevice.deviceName}</div>
            <div className='detail-name-handle' onClick={this.jumpAddDeviceName.bind(this)}>
              <i className='iconfont cloud-icon-icn_edit__norx' />
            </div>
          </div>
          <div className='detail-model'>
            <div>型号:{uniqueDevice.model}</div>
            <div>门状态:{uniqueDevice.status === 0 ? '不在线' : uniqueDevice.status === 1 ? '在线' : ''}</div>
          </div>
        </div>
        <div className='deviceDetail-nav'>
          <div>关联人员</div>
          <div onClick={this.resolveRelation.bind(this)}>{isShowRelation ? '完成' : '解除关联'}</div>
        </div>
        <div className='deviceDetail-list'>
          <MyListView
            onEndReached={this.scrollEndHandle.bind(this)}
            onRefresh={this.onRefresh.bind(this)}
            renderRow={row}
            isLoading={isLoading}
            dataSource={dataSource}
            isError={isError}
          />
        </div>

        <MyConfimModal
          isVisible={isDelVisible}
          onConfirm={this.confirmHandle.bind(this)}
          onCancel={this.cancelHandle.bind(this)}
          confirmText='解除关联'
          title={`确认要将${uniquePerson.person && uniquePerson.person.personName}从该设备解决关联吗?`}
        />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    uniqueDevice: state.cloudDoor.uniqueDevice,
    isLoading: state.cloudDoor.isLoading,
    dataSource: state.cloudDoor.dataSourceRelation,
    isError: state.cloudDoor.isError,
    isShowRelation: state.cloudDoor.isShowRelation,
    isDelVisible: state.cloudDoor.isDelVisible,
    uniquePerson: state.cloudDoor.uniquePerson,
  };
}


export default connect(mapStateToProps)(DeviceDetail);
