import React, {Component} from 'react';
import SearchBar from '../../../../components/searchBar';
import {connect} from 'dva';
import MyListView from '../../../../components/listView';
import createHashHistory from 'history/createHashHistory';
import './index.less';

const history = createHashHistory();

class SearchResult extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'cloudDoor/endRefreshAllSearch'});
  }

  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/onRefreshInitDeviceList'});
  }


  cancelHandle() {
    history.goBack();
    this.props.dispatch({
      type: 'cloudDoor/save',
      payload: {
        deviceSerialOrName: '',
        dataSource: [],
        isInitResult: false,
        pageNo:1,
        isError:false,
        status:''
      }
    });
  }

  searchChange(deviceSerialOrName) {
    this.props.dispatch({type: 'cloudDoor/searchChange', payload: {deviceSerialOrName}});
  }

  submit() {
    this.props.dispatch({type: 'cloudDoor/searchSubmit'});
  }

  render() {
    const {dataSource, isLoading, isError, isInitResult, isEndError, isEndLoading} = this.props,
      row = (rowData) => {
        return (
          <div className='deviceList-item'>
            <div className='item-left'>
              <div className='item-img'>
                <img src={require('../../../../assets/images/doorImg.png')} alt=""/>
              </div>
              <div className='item-detail'>
                {rowData.deviceName}
                <div>{rowData.model}</div>
              </div>
            </div>
            <div className='item-right'>
              {rowData.status === 0 ? <span style={{color: '#FB4848'}}>离线</span> : rowData.status === 1 ?
                <span>在线</span> :
                <span>无法获取是否在线状态</span>}
            </div>
          </div>
        );
      };
    return (
      <div className='searchResult'>
        <SearchBar
          placeholder='输入设备序列号、设备名称查找'
          onCancel={this.cancelHandle.bind(this)}
          onChange={this.searchChange.bind(this)}
          onSubmit={this.submit.bind(this)}
        />
        {
          isInitResult ? dataSource.length === 0 ?
            <div className='head-no-data'>
              <div>
                <div>
                  <img src={require('../../../../assets/images/default_image_empty_page@2x.png')} alt=""/>
                </div>
                <div className='no-data-text'>
                  这里空空如也
                </div>
              </div>
            </div> : <MyListView
              onEndReached={this.scrollEndHandle.bind(this)}
              onRefresh={this.onRefresh.bind(this)}
              renderRow={row}
              // isNoMoreData={false}
              isLoading={isLoading}
              isEndError={isEndError}
              isEndLoading={isEndLoading}
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
    isEndError: state.cloudDoor.isEndError,
    isEndLoading: state.cloudDoor.isEndLoading,
  };
}


export default connect(mapStateToProps)(SearchResult);

