import React, {Component} from 'react';
import {connect} from 'dva';
import {Carousel} from 'antd-mobile';
import PublicService from '../../../../../../services/PubliceService';
import './index.less';
import NavBar from '../../../../components/navBar';

class ResultDetail extends Component {

  afterChange(index){
    this.props.dispatch({type:'faceApp/afterChangeImage',payload:{index}});
  }

  render() {
    const {resultDetailList,uniqueDetail,index,total} = this.props;
    return (
      <div className='resultDetail'>
        <NavBar title='详情'/>
        <Carousel
          className="carousel"
          autoplay={false}
          dots={false}
          afterChange={this.afterChange.bind(this)}
        >
          {
            resultDetailList.map((item, index) => (
            <img
              key={index}
              alt="图片"
              src={item.url}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
              }}
              style={{display: 'inline-block', width: '100%', minHeight:'210'}}
            />
          ))
          }
        </Carousel>
        <div className='detail-list'>
          <div>
            {index}/{total}
          </div>

          <div>设备序列号:</div>
          <div>{uniqueDetail.deviceSerial}</div>
          <div>出现时间:</div>
          <div>{PublicService.formatTime(uniqueDetail.alarmTime)}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    resultDetailList:state.faceApp.resultDetailList,
    uniqueDetail:state.faceApp.uniqueDetail,
    index:state.faceApp.index,
    total:state.faceApp.resultDetailTotal,

  };
}


export default connect(mapStateToProps)(ResultDetail);
