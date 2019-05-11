import React, {Component} from 'react';
import SearchBar from '../searchBar';
import './index.less';
import MyButton from '../button';
import ReactDOM from 'react-dom';

class SearchNavBar extends Component {

  state = {
    height: '',
    isShowFilter: false,
    conditionValue: '',
    offsetTop: ''
  };

  componentDidMount() {
    const offsetTop = ReactDOM.findDOMNode(this.searchNavBar).parentNode.offsetTop;
    const hei = window.px2rem(document.documentElement.clientHeight - offsetTop) - 1.173;
    this.setState({
      height: hei,
      offsetTop: window.px2rem(offsetTop) + 1.173
    });
    if (this.props.value) {
      this.setState({
        conditionValue: this.props.value
      });
    }

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        conditionValue: nextProps.value
      });
    }
  }

  focus() {
    this.props.onFocus();
  }

  showFilter() {
    this.setState({
      isShowFilter: true
    });
  }

  submit() {
    this.setState({
      isShowFilter: false
    });
    this.props.onSubmit(this.state.conditionValue);
  }

  warpClick(e) {
    this.setState({
      isShowFilter: false
    });
  }

  childClick(e) {
    e.stopPropagation();
  }

  conditionHandle(item) {
    this.setState({
      conditionValue: item.value
    });
  }

  filterAllHandle() {
    this.setState({
      conditionValue: ''
    });
  }

  render() {
    const {dataSource} = this.props;
    return (
      <div className='mySearchNavBar'>
        <div className='mySearchNavBar-top' ref={ref => this.searchNavBar = ref}>
          <div className='mySearchNavBar-input'>
            <i className='iconfont cloud-icon-search_iconx'/>
            <input type="text" onFocus={this.focus.bind(this)} placeholder={this.props.placeholder}/>
          </div>
          <div className='mySearchNavBar-text' onClick={this.showFilter.bind(this)}>
            <span>筛选</span>
            <i className='iconfont cloud-icon-icn_filter_x'/>
          </div>
        </div>
        <div onClick={this.warpClick.bind(this)}
             style={{height: this.state.height + 'rem', top: this.state.offsetTop + 'rem'}}
             className={this.state.isShowFilter ? 'filter' : 'filter no-filter'}>
          <div className='detail' onClick={this.childClick.bind(this)}>
            <div className='filter-title'>{this.props.title || '事件类型'}</div>
            <div className='filter-condition'>
              <span className={(this.state.conditionValue || this.state.conditionValue === 0) ? '' : 'active'}
                    onClick={this.filterAllHandle.bind(this)}>全部</span>
              {
                dataSource.map((item, index) => {
                  return (
                    <span key={item.value} className={this.state.conditionValue === item.value ? 'active' : ''}
                          onClick={this.conditionHandle.bind(this, item)}>{item.title}</span>
                  );
                })
              }
            </div>
            <MyButton title='完成' onClick={this.submit.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}


export default SearchNavBar;
