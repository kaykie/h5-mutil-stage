import React,{Component} from 'react';
import {Button} from 'antd-mobile';
import './index.less';

class BottomButton extends Component{

  click(){
    this.props.onClick();
  }

  render(){
    return(
      <div className='bottom-btn'>
        <Button type='primary' onClick={this.click.bind(this)}>{this.props.title}</Button>
      </div>
    )
  }
}



export default BottomButton;

