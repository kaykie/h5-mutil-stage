import React, {Component} from 'react';
import {connect} from 'dva';
import MyListView from './../../../../../components/listView';
import createHashHistory from 'history/createHashHistory';
import './index.less';

const history = createHashHistory();

class CellList extends Component {

  scrollEndHandle() {
    this.props.dispatch({type: 'person/endRefreshMsgList'});
  }

  onRefresh() {
    this.props.dispatch({type: 'person/onRefreshInitMsgList'});
  }

  componentDidMount() {
    this.props.dispatch({type: 'person/save', payload: {pageNoMsg: 1, dataSourceMsg: []}});
    this.props.dispatch({type: 'person/getInitMsgList'});
  }

  // 人员详情
  handleDetail(updateInfoPerson) {
    this.props.dispatch({
      type: 'person/save',
      payload: {
        updateInfoPerson,
      }
    });
    history.push('/person/message/detail');
  }

  render() {
    const {isLoading, isEndLoading, isInitError, isInitLoading, isError, dataSourceMsg, isEndError} = this.props,
      row = (rowData) => {
        return (
          <div onClick={this.handleDetail.bind(this, rowData)} className="cloud-layout cloud-person__msg__item">
            <div className="cloud-layout__photo">
              <span className="cloud-layout__photo--round">
                {
                  rowData.person && rowData.person.faceImageUrl ?
                    <img className="cloud-layout__img" src={rowData.person.faceImageUrl} alt="" /> :
                    <i className="iconfont cloud-icon-bar_personnel_selx"></i>
                }
              </span>
            </div>
            <div className="cloud-layout__info">
              <h6 className="cloud-layout__info__master">{rowData.person ? rowData.person.personName : rowData.saasPersonId}</h6>
              {rowData.person ? '' : <p className="cloud-layout__info__duplicate cloud-fc--red">已删除</p>}
            </div>
            <div className="cloud-layout__btn cloud-person__msg__btn">
              <i className="iconfont cloud-icon-icn_next_listx"></i>
              <span className="cloud-person__msg__sum">{rowData.total}条同步信息</span>
            </div>
          </div>
        );
      };
    return (
      <MyListView
        className='cloud-main cloud-person__list'
        onEndReached={this.scrollEndHandle.bind(this)}
        onRefresh={this.onRefresh.bind(this)}
        renderRow={row}
        // isNoMoreData={false}
        isLoading={isLoading}
        isEndLoading={isEndLoading}
        dataSource={dataSourceMsg}
        isError={isError}
        isEndError={isEndError}
        isInitLoading={isInitLoading}
        isInitError={isInitError}
      />
    );
  }
}


function mapStateToProps(state) {
  return {
    isLoading: state.person.isLoading,
    isEndLoading: state.person.isEndLoading,
    isInitLoading: state.person.isInitLoading,
    isInitError: state.person.isInitError,
    dataSourceMsg: state.person.dataSourceMsg,
    isError: state.person.isError,
    isEndError: state.person.isEndError,
  };
}

export default connect(mapStateToProps)(CellList);
