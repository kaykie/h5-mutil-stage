import React, {Component} from 'react';
import CloudSearch from '../../components/cloudSearch';
import MyNavBar from '../../components/navBar';
import PersonList from './personList';
import {connect} from 'dva';
import './index.less';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

class PersonManage extends Component {

  // 添加人员
  handleAdd() {
    this.props.dispatch({
      type: 'person/save',
      payload: {
        addPerson: {},
        pageType: 'add',
      }
    });
    history.push('/person/info');
  }

  // 同步进度
  handleProgress = () => {
    history.push('/person/message');
  }

  // 搜索跳转
  jumpSearch = () => {
    history.push('/person/search');
    this.props.dispatch({type: 'person/save', payload: {dataSource: [], pageNo: 1, isInitResult: false}});
  }

  render() {
    return (
      <div className='cloud-person'>
        <MyNavBar
          isShow
          title='人员管理'
          isRightAddIcon
          onAddHandle={this.handleAdd.bind(this)}
        />
        <CloudSearch
          placeholder='输入姓名查找'
          className='cloud-person__search'
          isBtn={true}
          btnText={'<span class="cloud-person__progress">同步进度</span>'}
          onFocus={this.jumpSearch.bind(this)}
          onSearchHandle={this.handleProgress.bind(this)}
        />
        <PersonList />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps)(PersonManage);
