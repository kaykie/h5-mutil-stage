import React,{Component} from 'react';
import {Button} from 'antd-mobile';
import './index.less';


class MyButton extends Component{


  render(){
    const {title} = this.props;
    return(
      <div className='myBtn'>
        <Button {...this.props}>{title}</Button>
      </div>
    );
  }
}


export default MyButton;
