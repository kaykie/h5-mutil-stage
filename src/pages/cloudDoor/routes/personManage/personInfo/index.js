import React, {Component} from 'react';
import {connect} from 'dva';
import {InputItem, Picker, List, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import MyNavBar from '../../../components/navBar';
import MyButton from '../../../components/button';
import MsgSyncDialog from '../MsgSyncDialog';
import './index.less';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

class PersonInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 页面设置
      pageTitle: '添加人员',
      // 人员信息
      inputForm: [
        {
          key: 'personName',
          initialValue: this.props.initPersonName,
          rules: [
            {required: true, message: '请输入姓名'},
            {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9·]{1,25}$/, message: '仅允许输入长度25个字符以内的中英文、数字和·'}
          ],
          error: ''
        },
        {
          key: 'phoneNumber',
          initialValue: this.props.initPhoneNumber,
          rules: [
            {required: true, message: '请输入联系方式'},
            {pattern: /^((9\d{2})|(13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\s?\d{4}\s?\d{4}$/, message: '请输入正确的手机号'}
            // {pattern: /^1[3456789]\d{1}\s?\d{4}\s?\d{4}$/, message: '请输入正确的手机号'}
          ],
          error: '',
        },
        {
          key: 'gender',
          initialValue: this.props.initGender,
          rules: [],
          error: '',
        },
        {
          key: 'personNative',
          initialValue: this.props.initPersonNative,
          rules: [
            {pattern: /^.{0,25}$/, message: '长度不超过25个字符'}
          ],
          error: '',
        },
        {
          key: 'certificateType',
          initialValue: [this.props.initCertificateType],
          rules: [
            {pattern: /^[1]{0,1}$/, message: '目前证件类型仅支持身份证'}
          ],
          error: '',
        },
        {
          key: 'certificateNumber',
          initialValue: this.props.initCertificateNumber,
          rules: [
            {pattern: /^[0-9]{17}[a-zA-Z_0-9]{1}$/, message: '请输入正确的身份证号码'}
          ],
          error: '',
        },
      ],
      // 按钮状态
      btnStatusName: false,
      btnStatusPhone: false,
      // 倒计时数据
      clockTime: 20,
    };
  }

  componentDidMount() {
    if (this.props.pageType === 'add') {
      this.setState({
        pageTitle: '添加人员',
      });
      if (!(this.props.initPersonName && this.props.initPhoneNumber)) {
        this.initBtnValue(false);
      } else {
        this.initBtnValue(true);
      }
    } else if (this.props.pageType === 'update') {
      this.setState({
        pageTitle: '人员信息编辑',
      });
      this.initBtnValue(true);
    }
  }

  componentDidUpdate() {
    if (!this.props.isStartCountdown) {
      clearInterval(this.clockCount);
    }
  }

  // 初始化页面状态
  initBtnValue(value) {
    this.setState({
      btnStatusName: value,
      btnStatusPhone: value
    });
  }

  // 提交验证
  checkValidateFields = (callback) => {
    const inputForm = this.state.inputForm;
    this.props.form.validateFields(errors => {
      if (errors) {
        inputForm.forEach(item => {
          if (errors[item.key]) {
            item.error = errors[item.key].errors[0].message;
          } else {
            item.error = '';
          }
        });
        this.setState({
          inputForm
        });
      } else {
        callback(this.props.form.getFieldsValue());
      }
    });
  };

  // 检测姓名格式
  checkInput(value, key, index) {
    const {inputForm} = this.state;
    this.props.form.validateFields([key], (err, value) => {
      if (err) {
        inputForm[index].error = err[key].errors[0].message;
        this.setBtnValue(key, false);
      } else {
        this.setBtnValue(key, true);
        inputForm[index].error = '';
      }
      this.setState({
        inputForm: inputForm,
      })
    });
  }

  // 设置按钮状态
  setBtnValue(key, value) {
    switch (key) {
      case 'personName':
        this.setState({
          btnStatusName: value
        })
        break;
      case 'phoneNumber':
        this.setState({
          btnStatusPhone: value
        })
        break;
      default:
        break;
    }
  }

  // 选择性别
  handleGender(radio) {
    const tempList = this.state.inputForm;
    tempList.forEach(item => {
      if (item.key === 'gender') {
        item.initialValue = radio.value;
      }
    });
    this.setState({
      inputForm: tempList,
    });
  }

  // 提交
  handleSubmit = () => {
    this.checkValidateFields((obj) => {
      obj.certificateType = obj.certificateType[0];
      obj.phoneNumber = obj.phoneNumber.replace(/\s+/g, '');
      for (const key in obj) {
        if (!obj[key]) {
          obj[key] = null;
        }
      }
      if (this.props.pageType === 'add') {
        // 添加
        this.props.dispatch({
          type: 'person/save',
          payload: {
            addPerson: obj,
            initPersonName: obj.personName,
            initPhoneNumber: obj.phoneNumber,
            initGender: obj.gender,
            initPersonNative: obj.personNative,
            initCertificateType: obj.certificateType,
            initCertificateNumber: obj.certificateNumber,
          }
        });
        history.push('/person/upload');
      } else if (this.props.pageType === 'update') {
        // 编辑
        if (!this.props.btnLoading) {
          this.props.dispatch({type: 'person/save', payload: {btnLoading: true}});
          this.props.dispatch({type: 'person/updatePerson', payload: {values: obj}}).then(() => {
            this.countDown();
          });
        }
      } else {
        Toast.info('未找到提交类型');
      }
    });
  }

  countDown = () => {
    if (this.props.isStartCountdown) {
      this.clockCount = setInterval(() => {
        let clockTime = this.state.clockTime;
        clockTime--;
        if (clockTime > 0) {
          this.setState({
            clockTime: clockTime,
          });
          this.props.dispatch({type: 'person/save', payload: {isLookOver: false}});
        } else {
          this.setState({
            clockTime: '',
          });
          this.props.dispatch({type: 'person/save', payload: {isLookOver: true}});
          clearInterval(this.clockCount);
        }
      }, 1000);
    }
  }

  // 关闭
  handleCancel() {
    history.go(-1);
    clearInterval(this.clockCount);
  }

  componentWillUnmount() {
    clearInterval(this.clockCount);
  }

  render() {
    const {getFieldProps} = this.props.form,
      {pageTitle, inputForm, btnStatusName, btnStatusPhone} = this.state,
      {pageType, btnLoading} = this.props,
      certificateType = [
        {
          label: '身份证',
          value: '1',
        },
        {
          label: '护照',
          value: '2',
          disabled: true
        },
        {
          label: '军人证',
          value: '3',
        },
        {
          label: '香港身份证',
          value: '4',
        }
      ],
      radioData = [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '0'
        }
      ];
    return (
      <div className='cloud-content cloud-info'>
        <MyNavBar title={pageTitle} />
        <div className="cloud-main cloud-person__form">
          <ul className="cloud-form">
            <li className="cloud-form__item">
              <div className="cloud-form__item--inner">
                <p className="cloud-form__label">姓名<em className="cloud-form__require">*</em></p>
                <InputItem
                  placeholder='请输入姓名，不超过25个字'
                  clear="true"
                  maxLength='25'
                  {...getFieldProps(inputForm[0].key, {
                    initialValue: inputForm[0].initialValue,
                    onBlur: (e) => {
                      this.checkInput(e, inputForm[0].key, 0);
                    },
                    rules: inputForm[0].rules,
                    validateTrigger: ['onBlur', 'onChange']
                  })}
                />
              </div>
              {inputForm[0].error && <p className="cloud-error__tips">{inputForm[0].error}</p>}
            </li>
            <li className="cloud-form__item">
              <div className="cloud-form__item--inner">
                <p className="cloud-form__label">联系方式<em className="cloud-form__require">*</em></p>
                <InputItem
                  placeholder='请输入联系方式'
                  clear="true"
                  type='phone'
                  {...getFieldProps(inputForm[1].key, {
                    initialValue: inputForm[1].initialValue,
                    onBlur: (e) => {
                      this.checkInput(e, inputForm[1].key, 1);
                    },
                    rules: inputForm[1].rules,
                    validateTrigger: ['onBlur', 'onChange'],
                    error: ''
                  })}
                />
              </div>
              {inputForm[1].error && <p className="cloud-error__tips">{inputForm[1].error}</p>}
            </li>
            <li className="cloud-form__item">
              <h6 className="cloud-person__form__title">更多信息[选填]</h6>
            </li>
            <li className="cloud-form__item">
              <div className="cloud-form__item--sex">
                <p className="cloud-form__label">性别</p>
                <div className="cloud-form__sex">
                  {
                    radioData.map((radio, index) => {
                      return (
                        <span
                          key={index}
                          {...getFieldProps(inputForm[2].key, {
                            initialValue: inputForm[2].initialValue,
                          })}
                          onClick={this.handleGender.bind(this, radio)}
                          className={inputForm[2].initialValue === radio.value ? 'cloud-form__sex__item active' : 'cloud-form__sex__item'}
                        >{radio.label}</span>
                      );
                    })
                  }
                </div>
              </div>
            </li>
            <li className="cloud-form__item">
              <div className="cloud-form__item--inner">
                <p className="cloud-form__label">籍贯</p>
                <InputItem
                  placeholder='请输入籍贯，不超过25个字'
                  clear="true"
                  maxLength='25'
                  {...getFieldProps(inputForm[3].key, {
                    initialValue: inputForm[3].initialValue,
                    onBlur: (e) => {
                      this.checkInput(e, inputForm[3].key, 3);
                    },
                    rules: inputForm[3].rules,
                    validateTrigger: ['onBlur', 'onChange'],
                    error: ''
                  })}
                />
              </div>
              {inputForm[3].error && <p className="cloud-error__tips">{inputForm[3].error}</p>}
            </li>
            <li className="cloud-form__item">
              <div className="cloud-form__item--inner cloud-form__select">
                <p className="cloud-form__label">证件类型</p>
                <Picker
                  data={certificateType}
                  cols={1}
                  className="cloud-picker"
                  {...getFieldProps(inputForm[4].key, {
                    initialValue: inputForm[4].initialValue,
                    rules: inputForm[4].rules,
                  })}
                  onOk={e => this.checkInput(e, inputForm[4].key, 4)}
                >
                  <List.Item arrow="horizontal"></List.Item>
                </Picker>
              </div>
              {inputForm[4].error && <p className="cloud-error__tips">{inputForm[4].error}</p>}
            </li>
            <li className="cloud-form__item">
              <div className="cloud-form__item--inner">
                <p className="cloud-form__label">证件号码</p>
                <InputItem
                  placeholder='请输入证件号码，不超过50个字符'
                  clear="true"
                  maxLength='50'
                  {...getFieldProps(inputForm[5].key, {
                    initialValue: inputForm[5].initialValue,
                    onBlur: (e) => {
                      this.checkInput(e, inputForm[5].key, 5);
                    },
                    rules: inputForm[5].rules,
                    validateTrigger: ['onBlur', 'onChange'],
                  })}
                />
              </div>
              {inputForm[5].error && <p className="cloud-error__tips">{inputForm[5].error}</p>}
            </li>
          </ul>
        </div>
        <div className="cloud-person__form__btn">
          <MyButton
            onClick={this.handleSubmit}
            title={pageType === 'add' ? '下一步，上传照片' : (btnLoading ? '保存中...' : '保存')}
            disabled={!(btnStatusName || btnStatusPhone)}
          />
        </div>
        <MsgSyncDialog
          clockTime={this.state.clockTime}
          onCancel={this.handleCancel.bind(this)}
          defalutConfirm={true}
        />
      </div >
    );
  }
}

function mapStateToProps(state) {
  return {
    pageType: state.person.pageType,
    btnLoading: state.person.btnLoading,
    isStartCountdown: state.person.isStartCountdown,
    inputList: state.person.inputList,
    initPersonName: state.person.initPersonName,
    initPhoneNumber: state.person.initPhoneNumber,
    initGender: state.person.initGender,
    initPersonNative: state.person.initPersonNative,
    initCertificateType: state.person.initCertificateType,
    initCertificateNumber: state.person.initCertificateNumber
  };
}

export default connect(mapStateToProps)(createForm()(PersonInfo));
