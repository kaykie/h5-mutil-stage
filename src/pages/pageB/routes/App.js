import React from 'react';
import {connect} from 'dva';

class App extends React.Component{


  render(){
    return (
      <div>
        hello world
      </div>
    );
  }
}
function mapStateToProps(state) {
  return{

  };
}

export default connect(mapStateToProps)(App);

