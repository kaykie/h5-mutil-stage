import React, {Component} from 'react';
import CloudSearch from './../../../components/cloudSearch';
import MyNavBar from './../../../components/navBar';
import DeviceSelectList from './deviceSelectList';
import {connect} from 'dva';
import createHashHistory from 'history/createHashHistory';
import './index.less';

const history = createHashHistory();

class DeviceManage extends Component {

  // 搜索跳转
  jumpSearch() {
    history.push('/person/search/device');
    this.props.dispatch({type: 'cloudDoor/save', payload: {dataSource: [], pageNo: 1, isInitResult: false}});
  }

  // 关闭事件
  handleLeft() {
    this.props.dispatch({type: 'cloudDoor/save', payload: {status: ''}});
  }

  render() {
    return (
      <div className='cloud-content cloud-person-device'>
        <MyNavBar
          title='设备选择'
          leftType='cross'
          handleLeft={this.handleLeft.bind(this)}
        />
        <CloudSearch
          placeholder='输入设备名称、序列号查找'
          className='cloud-person__device__search'
          onFocus={this.jumpSearch.bind(this)}
        />
        <DeviceSelectList />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps)(DeviceManage);
