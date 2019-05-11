import React, {Component} from 'react';
import {InputItem} from 'antd-mobile';
import NavBar from '../../../../components/navBar/index';
import BottomButton from '../../../../components/bottomButton';
import {connect} from 'dva';

class AddArea extends Component {

  scoreChange(value) {
    this.props.dispatch({type:'faceApp/save',payload:{score:value}});
  }

  applicationNameChange(value){
    this.props.dispatch({type:'faceApp/save',payload:{applicationName:value}});
  }


  save(){
    this.props.dispatch({type:'faceApp/saveArea'});
  }

  render() {
    const {applicationName,score} = this.props;
    return (
      <div>
        <NavBar title='添加检测区域'/>
        <InputItem
          placeholder='请输入区域名称'
          defaultValue={applicationName}
          onChange={this.applicationNameChange.bind(this)}
        >区域名称</InputItem>
        <InputItem
          type='number'
          placeholder='请输入阈值'
          maxLength='3'
          className='widtgh'
          defaultValue={score}
          onChange={this.scoreChange.bind(this)}
        >相似度阈值</InputItem>

        <BottomButton title='保存' onClick={this.save.bind(this)}/>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    score:state.faceApp.score,
    applicationName:state.faceApp.applicationName,
  };
}
export default connect(mapStateToProps)(AddArea);
