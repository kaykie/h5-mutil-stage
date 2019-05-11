import React, {Component} from 'react';
import {List, SwipeAction, Checkbox,Modal} from 'antd-mobile';
import NavBar from '../../../../components/navBar/index';
import createHashHistory from 'history/createHashHistory';
import AddBtn from '../../../../components/addBtn/index';
import MyListView from '../../../../components/listView/index';
import BottomButton from '../../../../components/bottomButton/index';
import {connect} from 'dva';
import './index.less';

const history = createHashHistory(), Item = List.Item, Brief = Item.Brief, alert = Modal.alert,
  CheckboxItem = Checkbox.CheckboxItem;

class DeviceList extends Component {


  componentDidMount() {
    this.props.dispatch({type: 'faceApp/getDeviceList'});
  }

  addDevice() {
    history.push('/allDeviceList');
  }

  scrollEndHandle() {
    this.props.dispatch({type: 'faceApp/endRefreshDevice'});
  }

  onRefresh() {
    this.props.dispatch({type: 'faceApp/topRefreshDevice'});
  }

  delHandle = (item) => {
    const alertInstance = alert('删除', '是否确认删除???', [
      {text: '取消', onPress: () => alertInstance.close()},
      {text: '确认', onPress: () => this.del(item)},
    ]);
    this.props.dispatch({type: 'faceApp/save', payload: {alertInstance}});
  };

  del(item) {
    this.props.dispatch({type: 'faceApp/delDevice', payload: {item}});
  }

  switchChange(item, e) {
    this.props.dispatch({type: 'faceApp/checkBoxChange', payload: {item, boolean: e.target.checked}});
  }

  selectDevice() {
    history.goBack();
  }

  render() {
    const {isLoading, dataSource, isNoMoreData, isFromSearch} = this.props,
      row = (rowData, sectionID, rowID) => {
        return (
          isFromSearch ?
            <Item
              multipleLine
              key={rowData.id}
              extra={<CheckboxItem onChange={this.switchChange.bind(this, rowData)}/>}
            >
              {rowData.deviceSerial} <Brief>设备通道号:{rowData.channelNo} <br/> 创建时间:{rowData.createTime}</Brief>
            </Item>
            :
            <SwipeAction
              style={{backgroundColor: 'gray'}}
              autoClose
              right={[
                {
                  text: '删除',
                  onPress: this.delHandle.bind(this, rowData),
                  style: {backgroundColor: '#F4333C', color: 'white'},
                },
              ]}
            >
              <Item
                arrow={isFromSearch ? '' : ''}
                multipleLine
                key={rowData.id}
                extra={isFromSearch ? <CheckboxItem onChange={this.switchChange.bind(this, rowData)}/> : null}
              >
                {rowData.deviceSerial} <Brief>设备通道号:{rowData.channelNo} <br/> 创建时间:{rowData.createTime}</Brief>
              </Item>
            </SwipeAction>
        );
      };
    return (
      <div className='deviceList'>
        <NavBar title='设备列表'/>
        {
          !isFromSearch && <AddBtn
            onAddHandle={this.addDevice.bind(this)}
          />
        }

        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          isNoMoreData={isNoMoreData}
          isLoading={isLoading}
          dataSource={dataSource}
          height={isFromSearch ? 85 : 45}
        />
        {
          isFromSearch && <BottomButton title='完成' onClick={this.selectDevice.bind(this)}/>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataSource: state.faceApp.deviceOriginList,
    isLoading: state.faceApp.isLoadingFace,
    isNoMoreData: state.faceApp.isNoMoreData,
    isFromSearch: state.faceApp.isFromSearch,
  };
}

export default connect(mapStateToProps)(DeviceList);
