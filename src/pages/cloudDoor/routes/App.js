import React from 'react';
import {connect} from 'dva';
import './../assets/css/index.less';
import MyTabBar from '../components/tabBar';
import PublicService from '../services/PubliceService';
import dsbridge from 'dsbridge/index';

class App extends React.Component {

  change(value) {
    this.props.dispatch({type: 'app/save', payload: {selectedTab: value}});
    this.getUniqueTabList(value);
  }

  componentDidMount() {
    const {selectedTab} = this.props;
    if (/android/i.test(navigator.userAgent)) {
      const token = dsbridge.call('getToken', 'getToken'), accessToken = dsbridge.call('getAccessToken', 'getAccessToken');
      if (accessToken) {
        localStorage.setItem('token', `Bearer ${token}`);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('applicationType', 'app');
      } else {
        localStorage.setItem('applicationType', 'browser');
      }
      this.getUniqueTabList(selectedTab);
    } else if (/iPhone|iPad/i.test(navigator.userAgent)) {
      let isIOSApp = false;
      PublicService.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('getToken', 'getToken', res => {
          const token = res;
          isIOSApp = true;
          if (token) {
            localStorage.setItem('token', `Bearer ${token}`);
            localStorage.setItem('applicationType', 'app');
          } else {
            localStorage.setItem('applicationType', 'browser');
          }
          bridge.callHandler('getAccessToken', 'getAccessToken', (res) => {
            const accessToken = res;
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('applicationType', 'app');
            } else {
              localStorage.setItem('applicationType', 'browser');
            }
            this.getUniqueTabList(selectedTab);
          });
        });
      });
      setTimeout(() => {
        if (!isIOSApp) {
          this.getUniqueTabList(selectedTab);
        }
      },100);
    } else {
      localStorage.setItem('applicationType', 'browser');
      this.getUniqueTabList(selectedTab);
    }
  }

  getUniqueTabList(value) {
    switch (value) {
      case 'deviceManage':
        this.props.dispatch({type: 'cloudDoor/getInitDeviceList'});
        break;
      case 'personManage':
        this.props.dispatch({type: 'person/getInitPersonList'});
        break;
      case 'eventSearch':
        this.props.dispatch({type: 'cloudDoor/getInitEventList'});
        break;
      default:
        console.log('无匹配!');
    }
  }

  render() {
    return (
      <div className='app' style={{height: '100%'}}>
        <MyTabBar
          selectedTab={this.props.selectedTab}
          onChange={this.change.bind(this)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedTab: state.app.selectedTab
  };
}

export default connect(mapStateToProps)(App);

