import React, {Component} from 'react';
import SearchNavBar from '../../components/searchNavBar';
import MyNavBar from '../../components/navBar';
import './index.less';
import createHashHistory from 'history/createHashHistory';
import DateSelect from '../../components/dateSelect';
import {connect} from 'dva';
import EventList from './cell/eventList';
import moment from 'moment';

const history = createHashHistory(),array = [
  {
    value: 50026,
    title: '正常关门'
  },
  {
    value: 50028,
    title: '开门超时'
  },
  {
    value: 31025,
    title: '远程关门'
  },
  {
    value: 31024,
    title: '远程开门'
  },
  {
    value: 50076,
    title: '人脸认证失败'
  },
  {
    value: 50075,
    title: '人脸认证通过'
  },
  // {
  //   value:3,
  //   title:'其它'
  // }
];
//   isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
// let wrapProps = {};
// if (isIPhone) {
//   wrapProps = {
//     onTouchStart: e => e.preventDefault(),
//   };
// }

class DeviceManage extends Component {
  search(value) {
    this.props.dispatch({type: 'cloudDoor/eventTypeSearch', payload: {acsEventType: value}});
  }

  jumpSearch() {
    this.props.dispatch({
      type: 'cloudDoor/save', payload: {
        dataSourceEvent: [],
        pageNoEvent: 1,
        isInitResult: false,
        isError: false,
        acsEventType: '',
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        spreadList: []
      }
    });
    history.push('/searchEventResult');
  }

  selectDate(obj) {
    this.props.dispatch({type: 'cloudDoor/selectDateEvent', payload: obj});
  }

  clearDate() {
    this.props.dispatch({type: 'cloudDoor/clearDate'});
  }

  render() {
    const {acsEventType} = this.props;
    return (
      <div className='eventSearch'>
        <MyNavBar isShow title='事件查询'/>
        <SearchNavBar
          placeholder='请输入内容查找'
          dataSource={array}
          onFocus={this.jumpSearch.bind(this)}
          onSubmit={this.search.bind(this)}
          value={acsEventType}
        />
        <div className='eventSearch-date'>
          <DateSelect
            onSelect={this.selectDate.bind(this)}
            onClear={this.clearDate.bind(this)}
          />
        </div>

        <EventList/>
      </div>
    );
  }
}

function mapStataToProps(state) {
  return {
    acsEventType:state.cloudDoor.acsEventType
  };
}

export default connect(mapStataToProps)(DeviceManage);
