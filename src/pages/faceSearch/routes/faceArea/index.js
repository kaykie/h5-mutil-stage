import React, {Component} from 'react';
import {connect} from 'dva';
import createHashHistory from 'history/createHashHistory';
import AreaList from './cell/areaList';
import AddBtn from '../../components/addBtn';

const history = createHashHistory();

class FaceArea extends Component {

  addHandle() {
    this.props.dispatch({type: 'faceApp/initData'});
    history.push('/addArea');
  }

  render() {
    return (
      <div>
        <AreaList />
        {
          this.props.selectedTab === 'faceArea' && <AddBtn onAddHandle={this.addHandle.bind(this)}/>
        }

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedTab: state.faceApp.selectedTab
  };
}

export default connect(mapStateToProps)(FaceArea);
