import React, {Component} from 'react';
import {Button,ImagePicker,List,InputItem} from 'antd-mobile';
import NavBar from '../../components/navBar/index';
import MydateSelect from '../../components/dateSelect/index';
import createHashHistory from 'history/createHashHistory';
import UploadImage from '../../components/uploadImage';
import {connect} from 'dva';
import './index.less';

const Item = List.Item,history = createHashHistory();
class FaceSearch extends Component {

  componentDidMount(){
    // this.props.dispatch({type:'faceApp/initData'});
  }

  dateSelect(obj){
    this.props.dispatch({type:'faceApp/save',payload:{startTimeSarch:obj.start_date,endTimeSarch:obj.end_date}});
  }

  onChange(files){
    console.log(files);
    this.props.dispatch({type:'faceApp/save',payload:{imgFiles:files}});
  }

  scoreChange(value){
    this.props.dispatch({type:'faceApp/save',payload:{scoreSearch:value}});
  }

  selectDevice(){
    this.props.dispatch({type:'faceApp/selectDevice'});
  }

  selectArea(){
    this.props.dispatch({type:'faceApp/save',payload:{isFromSearch:true,selectDevice:[],startTime:'',endTime:''}});
    history.push('/areaList');
  }

  faceSearch(){
    this.props.dispatch({type:'faceApp/faceSearch'});
    // <ImagePicker
    //   length="1"
    //   files={files}
    //   onChange={this.onChange.bind(this)}
    //   selectable={files.length < 1}
    //   accept=''
    // />
  }

  render() {
    const {files,uniqueApplication,selectDevice,isBtnLoading} = this.props,
    hei = document.documentElement.clientHeight;
    return (
      <div className='faceSearch' style={{height:hei-200}}>
        <NavBar title='人脸检索' isShow={true}/>
        <div className='search-warp'>
          <div className='search-title'>
            选择检索图片
          </div>
          <div className='img-picker'>
            <UploadImage
              onChange={this.onChange.bind(this)}
            />
          </div>
        </div>
        <div className='search-warp'>
          <div className='search-title'>
            选择时间段
          </div>
          <MydateSelect
            dateSelect={this.dateSelect.bind(this)}
          />
        </div>
        <div className='search-warp'>
          <div className='search-title'>
            区域选择
          </div>
          <List>
            <Item arrow="horizontal" onClick={this.selectArea.bind(this)}>{uniqueApplication.applicationName ? uniqueApplication.applicationName :'选择区域' }</Item>
          </List>
        </div>
        <div className='search-warp'>
          <div className='search-title'>
            设备选择
          </div>
          <List>
            <Item arrow="horizontal" onClick={this.selectDevice.bind(this)}>{selectDevice.length === 0 ? '选择设备' :selectDevice.reduce((pre,cur)=>{
              return `${pre} ${cur.deviceSerial},`;
            },'')}</Item>
          </List>
        </div>
        <div className='search-warp'>
          <div className='search-title'>
            阈值
          </div>
          <div>
            <InputItem
              placeholder='请输入阈值'
              type='number'
              onChange={this.scoreChange.bind(this)}
            />
          </div>
        </div>
        <img src="" style={{display: 'none'}} id='test' alt=""/>
        <Button type='primary' loading={isBtnLoading} disabled={isBtnLoading} onClick={this.faceSearch.bind(this)}>人脸检索</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return{
    files:state.faceApp.imgFiles,
    uniqueApplication:state.faceApp.uniqueApplication,
    selectDevice:state.faceApp.selectDevice,
    isBtnLoading:state.faceApp.isBtnLoading,

  };
}

export default connect(mapStateToProps)(FaceSearch);
