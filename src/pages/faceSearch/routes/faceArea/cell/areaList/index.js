import React, {Component} from 'react';
import {List, Radio, ActionSheet, Modal, Checkbox,Toast} from 'antd-mobile';
import {connect} from 'dva';
import './index.less';
import NavBar from '../../../../components/navBar';
import createHashHistory from 'history/createHashHistory';
import DataSelect from '../../../../components/dateSelect';
import MyListView from '../../../../components/listView';
import BottomButton from '../../../../components/bottomButton';
import PublicService from '../../../../../../services/PubliceService';
import config from '../../../../config';
import dsbridge from 'dsbridge';

const history = createHashHistory(), Item = List.Item, Brief = Item.Brief, alert = Modal.alert,
  CheckboxItem = Checkbox.CheckboxItem;

class areaList extends Component {
  state = {
    height: ''
  };


  componentWillMount() {

    config.token = 'Bearer ' + dsbridge.call('getToken', 'getToken');
    // config.token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiI5MDc2MCIsInNjb3BlIjpbImFsbCJdLCJ1c2VyVHlwZSI6ImVudGVycHJpc2UiLCJleHAiOjE1NTQxOTI0MjksInNhYXNVc2VySWQiOjkwNzYwLCJqdGkiOiI5ODEwZTUzOS00MmFhLTQyOTktYmI1ZS00MzJhNDJhODYyYWIiLCJjbGllbnRfaWQiOiJ5czcifQ.AZSgOORU0LWkULl5Xw5H2At9IhOZhruKwnJALL94fsY'
    config.accessToken = dsbridge.call('getAccessToken', 'getAccessToken');
    // config.accessToken = 'at.8fjku7027zna38a61qln4h4idzj7chx6-92nwe10wfk-0s186k9-pkqght8r2';
  }

  componentDidMount() {
    // PublicService.getToken({
    //   params:{},
    //   onSuccess:function (res) {
    //     Toast.info(res.token);
    //   }
    // });
    if(!config.accessToken){
      PublicService.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('getToken', 'getToken', res => {
          config.token = 'Bearer ' + res;
          // Toast.info(config.token);
          bridge.callHandler('getAccessToken', 'getAccessToken', (res) => {
            config.accessToken = res;
            this.props.dispatch({type: 'faceApp/topRefresh'});
          });
        });
      });
    }else{
      this.props.dispatch({type: 'faceApp/topRefresh'});
    }
  }

  onRefresh() {
    this.props.dispatch({type: 'faceApp/topRefresh'});
  }

  scrollEndHandle() {
    this.props.dispatch({type: 'faceApp/endRefresh'});
  }


  itemClick(item) {
    this.props.dispatch({type: 'faceApp/save', payload: {uniqueApplication: item}});
    const BUTTONS = ['查看设备', '修改', '删除', '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        message: '操作面板',
        maskClosable: true,
      },
      (buttonIndex) => {
        this.actionHandle(buttonIndex);
      });
  }

  del() {
    this.props.dispatch({type: 'faceApp/delArea'});
  }

  actionHandle(buttonIndex) {
    switch (buttonIndex) {
      case 0:
        this.props.dispatch({type: 'faceApp/save', payload: {isFromSearch: false, deviceOriginList: []}});
        history.push('/deviceList');
        break;
      case 1:
        history.push('/addArea');
        this.props.dispatch({type: 'faceApp/editArea'});
        break;
      case 2:
        const alertInstance = alert('删除', '是否确认删除???', [
          {text: '取消', onPress: () => alertInstance.close()},
          {text: '确认', onPress: () => this.del()},
        ]);
        this.props.dispatch({type: 'faceApp/save', payload: {alertInstance}});
    }
  }

  dateSelect(obj) {
    this.props.dispatch({type: 'faceApp/dateChange', payload: obj});
  }

  // 人脸搜索调用函数
  switchChange(item) {
    this.props.dispatch({type: 'faceApp/areaChange', payload: {uniqueApplication: item}});
  }

  selectArea() {
    this.props.dispatch({type: 'faceApp/save', payload: {isFromSearch: false}});
    history.goBack();
  }

  render() {
    const {dataSource, isLoading, isNoMoreData, isFromSearch, uniqueApplication} = this.props,
      row = (rowData, sectionID, rowID) => {
        return (
          isFromSearch ?
            <Item
              multipleLine
              key={rowData.id}
              extra={isFromSearch ? <CheckboxItem checked={uniqueApplication.id === rowData.id}
                                                  onChange={this.switchChange.bind(this, rowData)}/> : null}
            >
              {rowData.applicationName} <Brief>阈值:{rowData.score} <br/> 创建时间:{rowData.createTime}</Brief>
            </Item> :
            <Item
              arrow='horizontal'
              multipleLine
              key={rowData.id}
              onClick={this.itemClick.bind(this, rowData)}
            >
              {rowData.applicationName} <Brief>阈值:{rowData.score} <br/> 创建时间:{rowData.createTime}</Brief>
            </Item>
        );
      };
    return (
      <div className='areaList'>
        <NavBar title='区域列表' isShow={!isFromSearch}/>
        <DataSelect
          dateSelect={this.dateSelect.bind(this)}
        />
        <MyListView
          onEndReached={this.scrollEndHandle.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={row}
          isNoMoreData={isNoMoreData}
          isLoading={isLoading}
          dataSource={dataSource}
          height={130}
        />
        {
          isFromSearch &&
          <BottomButton onClick={this.selectArea.bind(this)} title='选择区域'/>
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    dataSource: state.faceApp.applicationList,
    isLoading: state.faceApp.isLoadingFace,
    isNoMoreData: state.faceApp.isNoMoreData,
    isFromSearch: state.faceApp.isFromSearch,
    uniqueApplication: state.faceApp.uniqueApplication
  };
}

export default connect(mapStateToProps)(areaList);
