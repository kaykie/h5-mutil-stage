import React, {Component} from 'react';
import './index.less';
import {Button} from 'antd-mobile';
class AddBtn extends Component {

  save(){
    this.props.onSaveHandle();
  }

  render() {
    return (
      <div>
        <Button type='primary' onClick={this.save.bind(this)}> 保存 </Button>
      </div>
    );
  }
}

export default AddBtn;
