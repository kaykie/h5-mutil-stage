import React, {Component} from 'react';
import {ListView, PullToRefresh} from 'antd-mobile';
import ReactDOM from 'react-dom';


class MyListView extends Component {

  state = {
    height: '',
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
  };

  componentDidMount() {
    const propsHeight = this.props.height || 85,
      hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop - propsHeight - 150;
    this.setState({
      height: hei,
      dataSource: this.state.dataSource.cloneWithRows(this.props.dataSource)
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource)
      });
    }
    if (nextProps.isLoading !== this.props.isLoading) {
      this.lv.scrollTo(0, 0);
    }
  }

  onEndReached() {
    this.props.onEndReached();
  }

  onRefresh() {
    this.props.onRefresh();
  }

  render() {
    const {isNoMoreData, renderRow, isLoading} = this.props;
    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{textAlign: 'center'}}>
          {isNoMoreData ? '没有更多数据了!' : isLoading ? '加载中...' : '已完成'}
        </div>)}
        renderRow={renderRow}
        pullToRefresh={<PullToRefresh
          refreshing={isLoading}
          onRefresh={this.onRefresh.bind(this)}
        />}
        style={{
          height: this.state.height
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
