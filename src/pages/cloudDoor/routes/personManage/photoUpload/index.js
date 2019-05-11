import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Toast, Icon} from 'antd-mobile';
import MyNavBar from '../../../components/navBar';
import MyButton from '../../../components/button';
import BottomSelectDialog from '../../../components/bottomSelectDialog';
import MsgSyncDialog from './../MsgSyncDialog';
import createHashHistory from 'history/createHashHistory';
import './index.less';
import Utils from './../../../utils/Util';


const history = createHashHistory();

class PhotoUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clockTime: 20,
      imgResult: {
        resW: '',
        resH: '',
        url: '',
        size: 0
      }
    };
  }

  componentDidMount() {
    this.props.dispatch({type: 'person/save', payload: {isSelectDialog: false}});
  }

  componentDidUpdate() {
    if (!this.props.isStartCountdown) {
      clearInterval(this.clockCount);
    }
  }

  // 打开弹窗
  openDialog() {
    Toast.info('请选择长宽比为1:1的照片上传', 2, () => {
      this.props.dispatch({type: 'person/save', payload: {isSelectDialog: true}});
    });
  }

  // 上传照片
  handlePhoto(files) {
    Utils.getImgBase64(files[0], res => {
      this.setState({imgResult: res});
      this.props.dispatch({type: 'person/save', payload: {isSelectDialog: false, uploadFiles: res.url}});
    })
    // this.props.dispatch({type: 'person/save', payload: {isSelectDialog: false, uploadFiles: files[0].url}});
  }

  // 旋转图片
  handleImgRotate = () => {
    Utils.setBase64Rotate(this.state.imgResult, res => {
      this.setState({imgResult: res});
      this.props.dispatch({type: 'person/save', payload: {isSelectDialog: false, uploadFiles: res.url}});
    });
  }

  // 取消照片选择方式弹窗
  handleCancel() {
    this.props.dispatch({type: 'person/save', payload: {isSelectDialog: false}});
  }

  // 提交
  handleSubmit() {
    if (!this.props.uploadFiles) {
      this.openDialog();
    } else {
      if (!this.props.btnLoading) {
        this.props.dispatch({type: 'person/save', payload: {btnLoading: true}});
        switch (this.props.pageType) {
          case 'add':
            this.props.dispatch({type: 'person/addPerson'});
            break;
          case 'update':
            this.props.dispatch({type: 'person/uploadPhoto'}).then(() => {
              this.countDown();
            });
            break;
          default:
            Toast.info('无页面类型');
            break;
        }
      } else {
        // Toast.info('请不要重复提交');
      }
    }
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

  // 关闭信息保存弹窗
  handleClose() {
    history.go(-1);
    clearInterval(this.clockCount);
  }

  componentWillUnmount() {
    clearInterval(this.clockCount);
  }

  render() {
    const {isSelectDialog, uploadFiles, btnLoading} = this.props;
    // const {imgResult} = this.state;
    // const imgStyleW = {
    //   'width': '100%'
    // },
    //   imgStyleH = {
    //     'height': '100%'
    //   };
    return (
      <div className="cloud-content cloud-upload--wrap">
        <MyNavBar title='人脸照片上传' />
        <div className="cloud-main cloud-upload">
          {/* <div>
            <p>res.resW:{imgResult.resW || '暂无'}</p>
            <p>res.resH:{imgResult.resH || '暂无'}</p>
            <p>res.size:{imgResult.size || '暂无'}</p>
            <p>uploadFiles:{uploadFiles || '暂无'}</p>
          </div> */}
          <div className="cloud-upload__photo--wrap">
            <span className="cloud-upload__photo--limit">
              {uploadFiles ?
                <img
                  // style={imgResult.resW > imgResult.resH ? imgStyleW : imgStyleH}
                  className='cloud-upload__photo'
                  src={uploadFiles}
                  alt=""
                /> :
                <i className="iconfont cloud-icon-default_face_photosx"></i>
              }
              {
                uploadFiles ?
                  <span onClick={this.handleImgRotate.bind(this)} className='cloud-img__rotate'>
                    <i className='iconfont cloud-icon-icn_rotating'></i>
                  </span> : ''
              }
            </span>
            {
              uploadFiles ?
                <div className="cloud-btn--line cloud-upload__repeat">
                  <Button onClick={this.openDialog.bind(this)}>重新上传</Button>
                </div> : ''
            }
          </div>
          <div className="cloud-upload__tips">
            <h6 className="cloud-upload__tips__title">照片要求</h6>
            <p className="cloud-upload__tips__info">1.人脸正面免冠照，露出眉毛和眼睛</p>
            <p className="cloud-upload__tips__info">2.照片白底、无逆光、无PS，无过度美颜处理</p>
            <p className="cloud-upload__tips__info">3.JPG格式，不超过200KB</p>
            <p className="cloud-upload__tips__info">4.两眼之间的像素点>60</p>
          </div>
        </div>
        <div className="cloud-upload__btn">
          <MyButton title={uploadFiles ? (btnLoading ? '提交中...' : '提交') : '上传照片'} onClick={this.handleSubmit.bind(this)} />
        </div>
        <BottomSelectDialog
          isVisible={isSelectDialog}
          uploadChange={this.handlePhoto.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        />
        <MsgSyncDialog
          clockTime={this.state.clockTime}
          onCancel={this.handleClose.bind(this)}
          defalutConfirm={true}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pageType: state.person.pageType,
    uploadFiles: state.person.uploadFiles,
    isSelectDialog: state.person.isSelectDialog,
    btnLoading: state.person.btnLoading,
    isStartCountdown: state.person.isStartCountdown
  };
}

export default connect(mapStateToProps)(PhotoUpload);
