import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import FaceArea from '../routes/faceArea/index';
import FaceSearch from '../routes/faceSearch/index';

class Bar extends Component {

  state = {
    selectedTab: 'faceArea',
  };

  componentDidMount(){
    this.setState({
      selectedTab:this.props.selectedTab
    });
  }

  render() {
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        <TabBar.Item
          title="抓拍区域"
          icon={ <div className='iconfont icon-renlianshibie'/> }
          selectedIcon={ <div className='iconfont icon-renlianshibie-copy'/> }
          selected={this.state.selectedTab === 'faceArea'}
          onPress={() => {
            if(this.state.selectedTab === 'faceArea'){
              return;
            }
            this.setState({
              selectedTab: 'faceArea',
            },()=>{
              this.props.onChange('faceArea');
            });
          }}
        >
          <FaceArea />
        </TabBar.Item>
        <TabBar.Item
          icon={ <div className='iconfont icon-quyuguanli'/> }
          selectedIcon={ <div className='iconfont icon-quyuguanli-copy'/> }
          title="人脸检索"
          selected={this.state.selectedTab === 'faceSearch'}
          onPress={() => {
            if(this.state.selectedTab === 'faceSearch'){
              return;
            }
            this.setState({
              selectedTab: 'faceSearch',
            },()=>{
              this.props.onChange('faceSearch');
            });
          }}
        >
          <FaceSearch />
        </TabBar.Item>
      </TabBar>
    );
  }
}


export default Bar;
