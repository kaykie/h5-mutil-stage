import React from 'react';
import Bar from '../components/Bar';
import {connect} from 'dva';

class App extends React.Component{

  change(value){
    this.props.dispatch({type:'faceApp/initData'});
    this.props.dispatch({type:'faceApp/save',payload:{selectedTab:value}});
  }
  render(){
    return (
      <Bar
        selectedTab={this.props.selectedTab}
        onChange={this.change.bind(this)}
      />
    );
  }
}
function mapStateToProps(state) {
  return{
    selectedTab:state.faceApp.selectedTab
  };
}

export default connect(mapStateToProps)(App);

