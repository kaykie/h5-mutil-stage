import React, {Component} from 'react';
import {connect} from 'dva';
import {Button} from 'antd-mobile';
import SearchBar from '../../../../components/searchBar';
import MyListView from '../../../../components/listView';
import DataStatusDeal from '../../../../components/dataStatusDeal';
import createHashHistory from 'history/createHashHistory';
import './index.less';

const history = createHashHistory();

class SearchResult extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'person/endRefreshPersonList'});
  }

  onRefresh() {
    this.props.dispatch({type: 'person/onRefreshInitPersonList'});
  }

  // 取消操作
  cancelHandle() {
    history.goBack();
    this.props.dispatch({type: 'person/save', payload: {personName: null, pageNo: 1, dataSource: [], isInitResult: false}});
  }

  searchChange(personName) {
    if (personName) {
      this.props.dispatch({type: 'person/save', payload: {personName}});
      this.props.dispatch({type: 'person/searchSubmit'});
    } else {
      this.props.dispatch({type: 'person/save', payload: {dataSource: []}});
    }
  }

  submit() {
    this.props.dispatch({type: 'person/searchSubmit'});
  }

  // 权限下发
  handlePermission = (permissionPerson) => {
    this.props.dispatch({type: 'person/save', payload: {permissionPerson}});
    history.push('/person/device');
  }

  render() {
    const {dataSource, isLoading, isError, isInitResult} = this.props,
      row = (rowData) => {
        return (
          <div className="cloud-layout cloud-person__item">
            <div className="cloud-layout--inner">
              <div className="cloud-layout__photo">
                <span className="cloud-layout__photo--round">
                  {rowData.faceImageUrl ? <img className="cloud-layout__img" src={rowData.faceImageUrl} alt="" /> : <i className="iconfont cloud-icon-bar_personnel_selx"></i>}
                </span>
              </div>
              <div className="cloud-layout__info">
                <h6 className="cloud-layout__info__master">{rowData.personName}</h6>
                <p className="cloud-layout__info__duplicate">{rowData.phoneNumber}</p>
              </div>
            </div>
            <div className="cloud-btn--line cloud-layout__btn">
              <Button onClick={this.handlePermission.bind(this, rowData)}>权限下发</Button>
            </div>
          </div>
        );
      };
    return (
      <div className='cloud-content cloud-person__search__result'>
        <SearchBar
          placeholder='输入姓名查找'
          onCancel={this.cancelHandle.bind(this)}
          onChange={this.searchChange.bind(this)}
          onSubmit={this.submit.bind(this)}
        />
        {
          isInitResult ? dataSource.length === 0 ?
            <DataStatusDeal type='empty' />
            : <MyListView
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
    dataSource: state.person.dataSource,
    isError: state.person.isError,
    isLoading: state.person.isLoading,
    isInitResult: state.person.isInitResult,
  };
}


export default connect(mapStateToProps)(SearchResult);

