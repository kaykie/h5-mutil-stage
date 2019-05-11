import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import DeviceManage from '../../routes/deviceManage';
import PersonManage from '../../routes/personManage';
import EventSearch from './../../routes/eventSearch';
import './index.less';

const tabBarData = [
  {
    title: '设备管理',
    defaultIcon: 'cloud-icon-device',
    selectedIcon: 'cloud-icon-bar_equipment_selx',
    key: 'deviceManage',
    id: 1,
    component: <DeviceManage />
  },
  {
    title: '人员管理',
    defaultIcon: 'cloud-icon-bar_personnelx',
    selectedIcon: 'cloud-icon-bar_personnel_selx',
    key: 'personManage',
    id: 2,
    component: <PersonManage />
  },
  {
    title: '事件查询',
    defaultIcon: 'cloud-icon-bar_searchx',
    selectedIcon: 'cloud-icon-bar_search_selx',
    key: 'eventSearch',
    id: 3,
    component: <EventSearch />
  }
];

class MyTabBar extends Component {
  state = {
    selectedTab: 'deviceManage',
  };

  componentDidMount(){

  }

  render() {
    const {selectedTab} = this.props;
    return (
      <TabBar
        unselectedTintColor="#717882"
        tintColor="#FF8F42"
        barTintColor="#fafafa"
      >
        {
          tabBarData.map((item, index) => {
            return (
              <TabBar.Item
                key={item.id}
                title={item.title}
                icon={<div className={`iconfont ${item.defaultIcon}`} />}
                selectedIcon={<div className={`iconfont ${item.selectedIcon}`} />}
                selected={selectedTab === item.key}
                onPress={() => {
                  if (selectedTab === item.key) {
                    return;
                  }
                  if (this.props.onChange) {
                    this.props.onChange(item.key);
                  }
                }}
              >
                {item.component}
              </TabBar.Item>
            );
          })
        }
      </TabBar>
    );
  }
}


export default MyTabBar;
