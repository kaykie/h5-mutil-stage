import React, {Component} from 'react';
import service from '../api';
import {Button} from 'antd-mobile';

class Protocol extends Component {

  state = {
    ys7Code: '',
    height: 0,
    msg:''
  };


  componentDidMount() {
    const {params} = this.props.history.location;
    if (!params) {
      this.props.history.push('/login');
      return;
    }
    const docEl = document.documentElement, metaEl = document.querySelector('meta[name="viewport"]'),
      dpr = window.devicePixelRatio || 1,height = document.documentElement.clientHeight / dpr - 68;
    this.setState({
      ys7Code: params.ys7Code,
      height
    });
    metaEl.setAttribute('content', 'width=' + docEl.clientWidth / dpr + ',initial-scale=' + 1 + ',maximum-scale=' + 1 + ', minimum-scale=' + 1 + ',user-scalable=no');
  }


  // 同意协议调用补充企业信息并进入云门禁应用
  goToDoor() {
    const params = {
      'ys7_code':this.state.ys7Code,
      clientType:1
    };
    service.addEnterPrise(params)
      .then(res =>{
          if(res.code === '200'){
            localStorage.setItem('token', 'Bearer ' + res.data.token);
            localStorage.setItem('accessToken', res.data.accessToken);
            this.props.history.push('/index');
          }else{
            this.setState({
              msg:res.msg
            },()=>{
              setTimeout(()=>{
                this.setState({
                  msg:''
                });
              },2000);
            });
          }
      })
      .catch(err =>{
        console.log(err);
      })

  }

  componentWillUnmount(){
    const docEl = document.documentElement, metaEl = document.querySelector('meta[name="viewport"]'), dpr = window.devicePixelRatio || 1,scale = 1 / dpr;
    // 设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute('content', 'width=' + docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
  }

  render() {
    const {height,msg} = this.state;
    return (
      <div className='protocol'>
        <div style={{height,overflowY:'auto'}}>
          <iframe
            className='iframeCss'
            ref={ref => this.iframe = ref}
            src='https://service.ys7.com/mobile/policy?id=148'
            frameBorder="0"
            width='100%'
            title='title'
          >
          </iframe>
        </div>
        <div className='btn-warp'>
          <Button
            onClick={this.goToDoor.bind(this)}
          >确定并进入云门禁</Button>
        </div>
        {
          msg &&
          <div className='protocol-msg'>
            {msg}
          </div>
        }

      </div>
    );
  }
}


export default Protocol;
