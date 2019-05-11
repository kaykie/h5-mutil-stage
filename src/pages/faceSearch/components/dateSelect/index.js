/* eslint-disable */
import React, {Component} from 'react';
import {connect} from 'dva';
import {DatePicker} from 'antd-mobile';
import './index.less';
import {createForm} from 'rc-form';
import moment from 'moment';

class SearchCondition extends Component {
  state = {
    start_date: '',
    end_date: '',
    device_name: '',
    device_serial: '',
    device_channel_num: ''
  };

  dateSelect(value) {
    // this.props.dispatch({type: 'face/dateSelect', payload: this.props.form.getFieldsValue()})
    let dataObj = this.props.form.getFieldsValue();
    dataObj.start_date = dataObj.start_date ? moment(dataObj.start_date).format('YYYY-MM-DD HH:mm:ss') : '';
    dataObj.end_date = dataObj.end_date ? moment(dataObj.end_date).format('YYYY-MM-DD HH:mm:ss') : '';
    this.setState({
      start_date: dataObj.start_date,
      end_date: dataObj.end_date
    }, () => {
      this.props.dateSelect(dataObj);
    });
  }

  render() {
    const {getFieldProps} = this.props.form;
    let {start_date, end_date} = this.state;
    return (
      <div className='xnw-timewarp'>
        <DatePicker
          {...getFieldProps('start_date', {
            initialValue: '',
            rules: [
              {required: true, message: 'Must select a date'}
            ],
          })}
          onOk={this.dateSelect.bind(this)}
          maxDate={end_date ? new Date(end_date) : null}
        >
          <div className='xnw-selectTime'>
            {start_date ? start_date : '开始时间'}
          </div>
        </DatePicker>
        <DatePicker
          {...getFieldProps('end_date', {
            initialValue: '',
            rules: [
              {required: true, message: 'Must select a date'}
            ],
          })}
          minDate={start_date ? new Date(start_date) : null}

          onOk={this.dateSelect.bind(this)}
        >
          <div className='xnw-selectTime'>
            {end_date ? end_date : '结束时间'}
          </div>
        </DatePicker>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

const FaceList2 = createForm()(SearchCondition);
export default connect(mapStateToProps)(FaceList2);
