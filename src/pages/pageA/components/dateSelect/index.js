/* eslint-disable */
import React, {Component} from 'react';
import {connect} from 'dva';
import {DatePicker} from 'antd-mobile';
import './index.less';
import {createForm} from 'rc-form';
import moment from 'moment';

class SearchCondition extends Component {
  state = {
    startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"),
    endTime: moment().format('YYYY-MM-DD HH:mm').replace(/-/g, "/"),
  };

  dateSelect(value) {
    // this.props.dispatch({type: 'face/dateSelect', payload: this.props.form.getFieldsValue()})
    let dataObj = this.props.form.getFieldsValue();
    this.setState({
      startTime: dataObj.startTime ? moment(dataObj.startTime).format('YYYY-MM-DD HH:mm').replace(/-/g, "/") : moment().subtract(7,'days').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"),
      endTime: dataObj.endTime ? moment(dataObj.endTime).format('YYYY-MM-DD HH:mm').replace(/-/g, "/") : moment().format('YYYY-MM-DD HH:mm').replace(/-/g, "/")
    }, () => {
      this.props.onSelect({
        startTime: dataObj.startTime ? moment(dataObj.startTime).format('YYYY-MM-DD HH:mm:ss') : moment().subtract(7,'days').format('YYYY-MM-DD HH:mm:ss'),
        endTime: dataObj.endTime ? moment(dataObj.endTime).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')
      });
    });
  }

  clear() {
    this.props.form.resetFields();
    this.setState({
      startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"),
      endTime: moment().format('YYYY-MM-DD HH:mm').replace(/-/g, "/")
    });
    this.props.onClear();
  }

  render() {
    const {getFieldProps} = this.props.form,props = this.props.props || {};
    let {startTime, endTime} = this.state;
    return (
      <div className='timeWarp'>
        <div className='xnw-timewarp'>
          <DatePicker
            {...getFieldProps('startTime', {
              initialValue: '',
              rules: [
                {required: true, message: 'Must select a date'}
              ],
            })}
            className='dateSelect-item'
            onOk={this.dateSelect.bind(this)}
            minDate={new Date(moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))}
            maxDate={endTime ? new Date(endTime) : new Date(moment().format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))}
            {...props}
          >
            <div className='xnw-selectTime'>
              {startTime ? startTime : '开始时间'}
            </div>
          </DatePicker>
          <div>至</div>
          <DatePicker
            {...getFieldProps('endTime', {
              initialValue: '',
              rules: [
                {required: true, message: 'Must select a date'}
              ],
            })}
            className='dateSelect-item'
            minDate={startTime ? new Date(startTime) : new Date(moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))}
            maxDate={new Date(moment().format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))}
            onOk={this.dateSelect.bind(this)}
            {...props}
          >
            <div className='xnw-selectTime'>
              {endTime ? endTime : '结束时间'}
            </div>
          </DatePicker>
        </div>
        <div onClick={this.clear.bind(this)}>重置</div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

const FaceList2 = createForm()(SearchCondition);
export default connect(mapStateToProps)(FaceList2);
