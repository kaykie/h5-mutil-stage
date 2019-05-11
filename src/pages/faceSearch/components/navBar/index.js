import React, {Component} from 'react';
import {NavBar, Icon} from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';
import PublicService from '../../../../services/PubliceService';
import dsbridge from 'dsbridge';

const history = createHashHistory();

class navBar extends Component {

  handleClick() {
    console.log(123);
    if (this.props.isShow) {
      dsbridge.call('goBackFromH5', 'goBackFromH5');
      PublicService.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('goBackFromH5');
      });
    } else {
      history.goBack();
    }
  }


  render() {
    const {title} = this.props;
    return (
      <NavBar
        mode="light"
        icon={<Icon type="left"/>}
        onLeftClick={this.handleClick.bind(this)}
        // rightContent={[
        //   <Icon key="0" type="search" style={{marginRight: '16px'}}/>,
        //   <Icon key="1" type="ellipsis"/>,
        // ]}
      >{title || '首页'}</NavBar>
    );
  }
}


export default navBar;
