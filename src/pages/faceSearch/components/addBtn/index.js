import React, {Component} from 'react';
import './index.less';

class AddBtn extends Component {

  click(){
    this.props.onAddHandle();
  }

  render() {
    return (
      <div
        className='add-btn'
        onClick={this.click.bind(this)}
        style={{

        }}>
        <i className='add-icon iconfont icon-xianshi_tianjiatianchong'/>
      </div>
    );
  }
}

export default AddBtn;
