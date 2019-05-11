import React, {Component} from 'react';
import {connect} from 'dva';
import NavBar from '../../../../components/navBar/index';
import MyListView from '../../../../components/listView/index';
import {List} from 'antd-mobile';
import './index.less';

const Item = List.Item, Brief = Item.Brief;

class ResultList extends Component {


  scrollEndHandle(){
    this.props.dispatch({type:'faceApp/endRefreshAllSearch'});
  }

  onRefresh(){
    this.props.dispatch({type:'faceApp/topRefreshAllSearch'});
  }

  itemClick(item){
    this.props.dispatch({type:'faceApp/readResultDetail',payload:{item}});
  }

  render() {
    const {dataSource, isLoading, isNoMoreData} = this.props,
      row = (rowData, sectionID, rowID) => {
        return (
          <Item
            arrow='horizontal'
            multipleLine
            key={rowData.id}
            onClick={this.itemClick.bind(this, rowData)}
          >
            设备序列号:{rowData.device ? rowData.device.split('#')[0]:''} <Brief>出现次数:{rowData.count} <br/> 天数:{rowData.day}</Brief>
          </Item>
        );
      };
    return (
      <div className='resultList'>
        <NavBar title='检索结果'/>
        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          isNoMoreData={isNoMoreData}
          isLoading={isLoading}
          dataSource={dataSource}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataSource: state.faceApp.resultList,
    isNoMoreData: state.faceApp.isNoMoreData,
    isLoading: state.faceApp.isLoadingFace,

  };
}


export default connect(mapStateToProps)(ResultList);
