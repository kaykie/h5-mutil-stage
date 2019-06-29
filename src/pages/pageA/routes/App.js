import React from 'react';
import {connect} from 'dva';
import './../assets/css/index.less';
import MyTabBar from '../components/tabBar';

class App extends React.Component {

  render() {
    return (
      <div className='app' style={{height: '100%'}}>
        hello world
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedTab: state.app.selectedTab
  };
}

export default connect(mapStateToProps)(App);

