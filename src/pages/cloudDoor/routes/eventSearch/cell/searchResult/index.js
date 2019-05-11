import React, {Component} from 'react';
import SearchBar from '../../../../components/searchBar';
import {connect} from 'dva';
import MyListView from '../../../../components/listView';
import createHashHistory from 'history/createHashHistory';
import './index.less';
import '../eventList/index.less';
import '../../../deviceManage/cell/searchResult/index.less';
import Image from '../../../../components/image';

const history = createHashHistory();

class SearchResult extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'cloudDoor/endRefreshEventList'});
  }

  onRefresh() {
    this.props.dispatch({type: 'cloudDoor/onRefreshInitEventList'});
  }

  cancelHandle() {
    history.goBack();
    this.props.dispatch({type: 'cloudDoor/goBackFromSearch'});
  }

  searchChange(personName) {
    if (personName.length > 12) {
      return;
    }
    this.props.dispatch({type: 'cloudDoor/save', payload: {personName, isSearchSubmit: false}});
  }

  spreadDetail(item) {
    this.props.dispatch({type: 'cloudDoor/spreadDetail', payload: {id: item.id}});
  }

  submit(type) {
    this.props.dispatch({type: 'cloudDoor/searchSubmitEvent', payload: {searchType: type}});
  }

  render() {
    const {dataSource, isLoading, isError, isInitResult, spreadList, isEndLoading, isEndError, submitPersonName, personName, isSearchSubmit,searchType} = this.props,
      row = (rowData) => {
        const boolean = spreadList.includes(rowData.id), isPersonDetail = !!rowData.person;
        let preName = '', lastName = '';
        if (isPersonDetail) {
          const realyName = rowData.person.personName,
            nameArray = realyName.replace(submitPersonName, ',').split(',');
          if (nameArray.length > 1) {
            preName = nameArray[0];
            lastName = nameArray[1];
          }
        }
        return (
          <div className='eventList-item'>
            <div className='item-first-line'>
              <div
                style={{color: (rowData.acsEventType === '50028' || rowData.acsEventType === '50076') ? '#FB4848' : '#333333'}}>{rowData.acsEventName || '--'}</div>
              <span>{rowData.dateTime || '--'}</span>
            </div>
            <div>{rowData.deviceName || '--'}</div>
            {
              boolean && [<div key='model'>设备型号:{rowData.deviceModel || '--'}</div>, (isPersonDetail && searchType === 'personName') ?
                <div key='personName'> {preName}<span style={{color: '#FB4848'}}>{submitPersonName}</span>{lastName}
                </div> : <div key='personName'>{isPersonDetail ? rowData.person.personName :'--'}</div>, isPersonDetail ?
                <div key='phoneNum'>{rowData.person.phoneNumber}</div> : <div key='phoneNum'>--</div>]
            }
            <div onClick={this.spreadDetail.bind(this, rowData)}>
              <i
                className={boolean ? 'iconfont cloud-icon-icn_triangle_down_norx-copy' : 'iconfont cloud-icon-icn_triangle_down_norx'}/>
            </div>
          </div>
        );
      };
    return (
      <div className='searchResult eventList'>
        <SearchBar
          placeholder='请输入内容查找'
          onCancel={this.cancelHandle.bind(this)}
          onChange={this.searchChange.bind(this)}
          onSubmit={this.submit.bind(this, 'acsEventName')}
          value={personName}
          dataSource={!isSearchSubmit && personName ? [{
            content: <div onClick={this.submit.bind(this, 'acsEventName')}>查找包含“<span
              style={{color: '#fb4848'}}>{personName}</span>”设备的事件</div>, value: 'acsEventName'
          }, {
            content: <div onClick={this.submit.bind(this, 'personName')}>查找包含“<span
              style={{color: '#fb4848'}}>{personName}</span>”人员的事件</div>, value: 'personName'
          }] : []}
        />
        {
          isInitResult ? dataSource.length === 0 ?
            <div className='head-no-data'>
              <div>
                <div>
                  <Image source={require('../../../../assets/images/default_image_empty_page@2x.png')}/>
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
              isEndLoading={isEndLoading}
              dataSource={dataSource}
              isError={isError}
              isEndError={isEndError}
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
    dataSource: state.cloudDoor.dataSourceEvent,
    isError: state.cloudDoor.isError,
    isLoading: state.cloudDoor.isLoading,
    isInitResult: state.cloudDoor.isInitResult,
    spreadList: state.cloudDoor.spreadList,
    isEndLoading: state.cloudDoor.isEndLoading,
    isEndError: state.cloudDoor.isEndError,
    submitPersonName: state.cloudDoor.submitPersonName,
    personName: state.cloudDoor.personName,
    isSearchSubmit: state.cloudDoor.isSearchSubmit,
    searchType: state.cloudDoor.searchType,
  };
}


export default connect(mapStateToProps)(SearchResult);

