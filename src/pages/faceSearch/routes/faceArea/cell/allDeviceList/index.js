import React, {Component} from 'react';
import {connect} from 'dva';
import MyListView from '../../../../components/listView/index';
import NavBar from '../../../../components/navBar/index';
import {Button, List,Checkbox} from 'antd-mobile';
import './index.less';

const Item = List.Item, Brief = Item.Brief,CheckboxItem = Checkbox.CheckboxItem;

class AllDeviceList extends Component {

  componentDidMount() {
    this.props.dispatch({type: 'faceApp/getAllDeviceList'});
  }

  save() {
    this.props.dispatch({type:'faceApp/saveDevice'});
  }

  onRefresh() {
    this.props.dispatch({type: 'faceApp/topRefreshAllDevice'});
  }

  scrollEndHandle() {
    this.props.dispatch({type: 'faceApp/endRefreshAllDevice'});
  }

  switchChange(item,e){
    this.props.dispatch({type:'faceApp/checkBoxChange',payload:{item,boolean:e.target.checked}});
  }

  render() {
    const {isLoading, dataSource, isNoMoreData} = this.props,
      row = (rowData, sectionID, rowID) => {
        return (
          <Item
            multipleLine
            key={rowData.id}
            extra={<CheckboxItem onChange={this.switchChange.bind(this,rowData)}/>}
          >
            {rowData.deviceName} <Brief>设备型号:{rowData.model} <br/> 设备序列号:{rowData.deviceSerial}</Brief>
          </Item>
        );
      };
    return (
      <div className='allDeviceList'>
        <NavBar title='用户设备列表'/>
        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          isNoMoreData={isNoMoreData}
          isLoading={isLoading}
          dataSource={dataSource}
        />
        <Button type='primary' onClick={this.save.bind(this)}>添加</Button>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    isLoading: state.faceApp.isLoadingFace,
    isNoMoreData: state.faceApp.isNoMoreData,
    dataSource: state.faceApp.allDeviceOriginList,

  };
}

export default connect(mapStateToProps)(AllDeviceList);
