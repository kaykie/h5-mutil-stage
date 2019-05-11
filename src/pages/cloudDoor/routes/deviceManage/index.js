import React, {Component} from 'react';
import SearchNavBar from '../../components/searchNavBar';
import MyNavBar from '../../components/navBar';
import DeviceList from './cell/deviceList';
import {connect} from 'dva';
import createHashHistory from 'history/createHashHistory';
import './index.less';
import * as faceapi from 'face-api.js';
import {ImagePicker} from 'antd-mobile';

const history = createHashHistory();

class DeviceManage extends Component {

  state = {
    imgUrl: '',
    width: '',
    height:''
  };

  async componentDidMount() {
    console.log(faceapi);
    await faceapi.nets.ssdMobilenetv1.load('./models');
  }


  submit(status) {
    console.log(status);
    this.props.dispatch({type: 'cloudDoor/searchDevice', payload: {status}});
  }

  addHandle() {
    this.props.dispatch({
      type: 'cloudDoor/save',
      payload: {addDeviceSerial: '', deviceNameError: '', initialValueDeviceName: ''}
    });
    history.push('/addDevice');
  }

  jumpSearch() {
    history.push('/searchDeviceResult');
    this.props.dispatch({
      type: 'cloudDoor/save',
      payload: {dataSource: [], pageNo: 1, isInitResult: false, isError: false}
    });
  }

  async uploadChange(files) {
    console.log(files);
    const t = this;
    const res = await faceapi.bufferToImage(files[0].file);
    this.setState({
      imgUrl: res.src
    }, async () => {
      const detections = await faceapi.detectAllFaces(document.getElementById('myImg'));
      console.log(detections);


      const canvas = document.getElementById('myCanvas'),
        size = {width: detections[0].imageWidth, height: detections[0].imageHeight},
        cvs = canvas.getContext('2d'), height = size.height, width = size.width;
      this.setState({
        height,
        width
      },()=>{
        cvs.drawImage(document.getElementById('myImg'), 0, 0, width, height);
        const drawBox = new faceapi.draw.DrawBox(detections[0].box, {
          lineWidth: 2
        });
        drawBox.draw(document.getElementById('myCanvas'));
      });


      // const style = {top:detections[0].box.y,left:detections[0].box.x,width:detections[0].box.width,height:detections[0].box.height};
      // this.setState({
      //   style
      // })
    });
  }

  render() {
    const {status} = this.props;
    return (
      <div className='deviceManage'>

        <ImagePicker
          className='cloud-image-picker'
          accept={'image/*'}
          length="1"
          selectable={true}
          onChange={this.uploadChange.bind(this)}
          multiple={false}
        />
        <div style={{position: 'relative'}}>
          <img id='myImg' src={this.state.imgUrl} alt=""/>
          <canvas width={this.state.width} height={this.state.height} id='myCanvas'/>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    status: state.cloudDoor.status,
  };
}

export default connect(mapStateToProps)(DeviceManage);
