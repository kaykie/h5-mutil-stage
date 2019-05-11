import React, {Component} from 'react';
import {connect} from 'dva';
import MyNavBar from '../../../components/navBar';
import DataStatusDeal from './../../../components/dataStatusDeal';
import {Button} from 'antd-mobile';
import './index.less';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

class PhotoUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: window.location.href.match('[^/]+(?!.*/)')[0]
    };
  }

  componentDidMount() {
    this.props.dispatch({type: 'person/getPersonInfo', payload: {id: this.state.id}});
    this.props.dispatch({type: 'person/getPersonRelatedDevice', payload: {id: this.state.id}});
  }

  // 权限下发
  handlePermission = () => {
    this.props.dispatch({type: 'person/save', payload: {permissionPerson: this.props.personInfo}});
    history.push('/person/device');
  }

  // 编辑信息
  handleEdit = () => {
    const {personInfo} = this.props;
    this.props.dispatch({
      type: 'person/save',
      payload: {
        pageType: 'update',
        initPersonName: personInfo.personName,
        initPhoneNumber: personInfo.phoneNumber,
        initGender: personInfo.gender,
        initPersonNative: personInfo.personNative,
        initCertificateType: personInfo.certificateType,
        initCertificateNumber: personInfo.certificateNumber,
        updatePerson: personInfo
      }
    });
    history.push('/person/info');
  }

  // 更新照片
  handleUpload = () => {
    const {personInfo} = this.props;
    this.props.dispatch({
      type: 'person/save',
      payload: {
        pageType: 'update',
        uploadPerson: personInfo,
        uploadFiles: personInfo.faceImageUrl
      }
    });
    history.push('/person/upload');
  }

  // 重新加载
  handleRepeat = () => {
    this.props.dispatch({type: 'person/getPersonRelatedDevice', payload: {id: this.state.id}});
  }

  render() {
    const {personInfo, personRelationDevice, personRelationStatus, detailIsOperate} = this.props,
      basePersonInfo = [
        {
          label: '姓名',
          value: personInfo.personName || '--'
        },
        {
          label: '性别',
          value: Number(personInfo.gender) === 0 ? '女' : (Number(personInfo.gender) === 1 ? '男' : '--')
        },
        {
          label: '联系方式',
          value: personInfo.phoneNumber || '--'
        },
        {
          label: '籍贯',
          value: personInfo.personNative || '--'
        },
        {
          label: '证件类型',
          value: Number(personInfo.certificateType) === 1 ? '身份证' : '--'
        },
        {
          label: '证件号码',
          value: personInfo.certificateNumber || '--'
        }
      ];
    return (
      <div className="cloud-content cloud-person-detail--wrap">
        <MyNavBar
          title='人员详情'
          isRightOperate={detailIsOperate}
          operateContent={{
            text: '权限下发',
            className: 'cloud-person__operate',
          }}
          onHandleOperate={this.handlePermission.bind(this)}
        />
        <div className="cloud-main cloud-person-detail">
          <div className="cloud-person-detail--inner">
            <div className="cloud-person-detail__img">
              <span className="cloud-person__img--wrap">
                {personInfo.faceImageUrl ? <img className="cloud-person__img" src={personInfo.faceImageUrl} alt="" /> : <i className="iconfont cloud-icon-bar_personnel_selx"></i>}
              </span>
              {
                detailIsOperate &&
                <div className="cloud-btn--line cloud-person-detail__btn">
                  <Button onClick={this.handleUpload}>更换照片</Button>
                </div>
              }
            </div>
            <div className="cloud-person__base">
              <h3 className="cloud-person-detail__title">
                <span className="cloud-person-detail__title--inner">基本信息</span>
                {
                  detailIsOperate &&
                  <a onClick={this.handleEdit} className='cloud-person-detail__edit'>
                    <i className="iconfont cloud-icon-icn_editx"></i>
                  </a>
                }
              </h3>
              <ul className="cloud-person__base__list">
                {
                  basePersonInfo.map((item, index) => {
                    return (
                      <li className="cloud-person__base__item" key={index}>
                        <div className="cloud-person__base__item--inner">
                          <span className="cloud-person__base__label">{item.label}</span>
                          <p className="cloud-person__base__info">{item.value}</p>
                        </div>
                      </li>
                    );
                  })
                }

              </ul>
            </div>
          </div>
          <div className="cloud-person-detail--inner cloud-person__device">
            <h3 className="cloud-person-detail__title">关联设备</h3>
            {
              personRelationStatus === 'loading' ?
                <DataStatusDeal type='loading' className='cloud-person__device__empty' /> :
                personRelationStatus === 'error' ?
                  <DataStatusDeal type='fail' className='cloud-person__device__empty' onHandleData={this.handleRepeat.bind(this)} /> :
                  personRelationDevice.length <= 0 ?
                    <DataStatusDeal type='empty' className='cloud-person__device__empty' /> :
                    <ul className="cloud-person__device__list">
                      {
                        personRelationDevice.map((item, index) => {
                          return (
                            <li className="cloud-person__device__item" key={index}>
                              <div className="cloud-person__device__item--inner">
                                <h6 className="cloud-person__device__name">{item.deviceName || item.deviceSerial}</h6>
                                <p className="cloud-person__device__model">{item.deviceModel || '--'}</p>
                              </div>
                            </li>
                          );
                        })
                      }
                    </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    personRelationStatus: state.person.personRelationStatus,
    personInfo: state.person.personInfo,
    personRelationDevice: state.person.personRelationDevice,
    currentPerson: state.person.currentPerson,
    detailIsOperate: state.person.detailIsOperate
  };
}

export default connect(mapStateToProps)(PhotoUpload);