import React, {Component} from 'react';
import {ListView, PullToRefresh, Button} from 'antd-mobile';
import ReactDOM from 'react-dom';
import './index.less';
import moment from 'moment';
import Image from '../image';

class MyListView extends Component {

  state = {
    height: '',
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    isFinishLoading: false,
    refreshTime: ''
  };

  componentDidMount() {
    if (this.lv) {
      const propsHeight = this.props.height || 1.333,
        hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop,
        hei2 = window.px2rem(hei) - propsHeight;
      this.setState({
        height: hei2,
        // dataSource: this.state.dataSource.cloneWithRows(this.props.dataSource)
      });
    } else {
      const propsHeight = this.props.height || 1.333,
        hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.noData).parentNode.offsetTop,
        hei2 = window.px2rem(hei) - propsHeight;
      this.setState({
        height: hei2,
        // dataSource: this.state.dataSource.cloneWithRows(this.props.dataSource)
      });
    }
    this.setState({
      refreshTime: moment().format('HH:mm:ss')
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.lv) {
      if (nextProps.dataSource !== this.props.dataSource) {
        console.log(nextProps.dataSource);
        this.setState({
          refreshTime: moment().format('HH:mm:ss')
        });
      }
      if (nextProps.isLoading !== this.props.isLoading) {
        this.lv.scrollTo(0, 0);
        if (!nextProps.isLoading) {
          this.setState({isFinishLoading: true}, () => {
            setTimeout(() => {
              this.setState({
                isFinishLoading: false
              });
            }, 150);
          });
        }
      }
    }
  }

  onEndReached() {
    this.props.onEndReached();
  }

  onRefresh() {
    this.props.onRefresh();
  }

  render() {
    const {renderRow, isLoading, isError, dataSource, isInitError, isInitLoading, isEndError, isEndLoading} = this.props, {isFinishLoading, refreshTime} = this.state,
      indicator = {
        activate: <div className='indicator-activate'>
          <i className='iconfont cloud-icon-shangsheng'/><span>释放刷新</span>
        </div>,
        deactivate: <div className='indicator-activate'>
          <i className='iconfont cloud-icon-shangsheng'/><span>释放刷新</span>
        </div>,
        release: isError ? <div className='indicator-error' onClick={this.onRefresh.bind(this)}>
          <i className='iconfont cloud-icon-71shibai'/><span>刷新失败,点击重试</span>
        </div> : <div className='indicator-release'>
          <div><i className='iconfont cloud-icon-Loading'/><span>正在刷新</span></div>
          <div>上次刷新时间 {refreshTime}</div>
        </div>,
        finish: <div className='indicator-release'>
          <div><i className='iconfont cloud-icon-wancheng'/><span>刷新完成</span></div>
          <div>上次刷新时间 {refreshTime}</div>
        </div>
      },
      noDataRow = () => {
        return (
          <div className='head-no-data' style={{height: `${this.state.height}rem`}}>
            <div>
              <Image source={require('../../assets/images/default_image_empty_page@2x.png')} alt="空空如也"/>
            </div>
            <div className='no-data-text'>
              这里空空如也
            </div>
          </div>
        );
      };
    return (
      isInitLoading ?
        <div className='listview-no-data' ref={el => this.noData = el} style={{height: `${this.state.height}rem`}}>
          <div>
            <div className='icon-warp'>
              <i className='iconfont cloud-icon-Loading'/>
            </div>
            <div className='noData-text'>
              正在玩命加载中,请耐心等待
            </div>
          </div>
        </div> : isInitError ?
        <div className='listview-no-data' ref={el => this.noData = el} style={{height: `${this.state.height}rem`}}>
          <div>
            <div>
              <Image source={require('../../assets/images/default_image_empty_page@2x.png')} alt=""/>
            </div>
            <div className='noData-text'>
              加载失败，点击按钮重试
            </div>
            <div className='noData-btn'>
              <Button onClick={this.onRefresh.bind(this)}>重新加载</Button>
            </div>
          </div>
        </div> :
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource.cloneWithRows(this.props.dataSource)}
          renderFooter={() => (<div style={{textAlign: 'center'}}>
            {isEndError ? <div className='loading-more-error' onClick={this.onEndReached.bind(this)}>
              <i className='iconfont cloud-icon-71shibai'/><span>刷新失败,点击重试</span>
            </div> : isEndLoading ?
              <div className='listView-end-loading'><i className='iconfont cloud-icon-Loading'/><span>正在加载</span>
              </div> : dataSource.length === 0 ? '' : '已加载全部数据!'}
          </div>)}
          renderRow={renderRow}
          renderHeader={dataSource.length === 0 ? noDataRow : null}
          pullToRefresh={<PullToRefresh
            refreshing={isLoading}
            onRefresh={this.onRefresh.bind(this)}
            indicator={indicator}
          />}
          className={(isLoading || isFinishLoading) ? 'listView-container myListView' : 'listView-container listView-default'}
          style={{
            height: `${this.state.height}rem`
          }}
          pageSize={4}
          onEndReachedThreshold={10}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached.bind(this)}
        />
    );
  }
}


export default MyListView;
