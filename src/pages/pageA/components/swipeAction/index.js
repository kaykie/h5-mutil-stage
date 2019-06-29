import React, {Component} from 'react';
import {SwipeAction} from 'antd-mobile';
import './index.less';


class MySwipeAction extends Component {

  onPress() {

  }

  render() {
    const options = {
      autoClose: true,
      right: [{
        text: '删除',
        onPress: this.onPress.bind(this),
        style: {backgroundColor: '#F4333C', color: 'white'},
      }], ...this.props
    };
    return (
      <div className='mySwipeAction'>
        <SwipeAction
          {...options}
        >
          {this.props.children}
        </SwipeAction>
      </div>
    );
  }
}


export default MySwipeAction;
