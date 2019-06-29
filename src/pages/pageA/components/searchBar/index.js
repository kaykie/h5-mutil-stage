import React, {Component} from 'react';
import {SearchBar} from 'antd-mobile';
import './index.less';

class MyButton extends Component {

  componentDidMount() {
    this.autoFocusInst.focus();
  }

  render() {
    const {dataSource} = this.props;
    return (
      <div className='mySearchBar'>
        <SearchBar
          {...this.props}
          ref={ref => this.autoFocusInst = ref}
        />
        <div style={{position:'relative',marginTop:'0.4rem'}}>
          {
            dataSource && dataSource.map((item, index) => {
              return (
                <div key={index} className='pullList'>
                  {item.content}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}


export default MyButton;
