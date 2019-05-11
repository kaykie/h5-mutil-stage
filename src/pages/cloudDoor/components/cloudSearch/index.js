import React, {Component} from 'react';
import './index.less';

class SearchNavBar extends Component {

  render() {
    const {placeholder, isBtn, btnText} = this.props;
    return (
      <div className={`cloud-search--wrap ${this.props.className}`}>
        <div className='cloud-search' ref={ref => this.searchNavBar = ref}>
          <div className='cloud-search__input'>
            <i className='iconfont cloud-icon-search_iconx' />
            <input type="text" onFocus={this.props.onFocus} placeholder={placeholder} />
          </div>
          {isBtn && <div
            className='cloud-search__btn'
            onClick={this.props.onSearchHandle}
            dangerouslySetInnerHTML={{__html: btnText}}
          ></div>}
        </div>
      </div>
    );
  }
}


export default SearchNavBar;
