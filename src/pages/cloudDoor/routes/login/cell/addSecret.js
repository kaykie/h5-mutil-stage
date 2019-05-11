import React, {Component} from 'react';
import MliveHeader from '../components/MliveHeader/index';
import MyInputItem from '../components/inputItem';
import MyButton from '../components/button';
import service from '../api';
import '../index.less';

class AddSecret extends Component {

  state={
    appKey:'',
    ys7Code:'',
    msg:''
  };

  componentDidMount(){
    const {params} = this.props.history.location;
    if(!params){
      this.props.history.push('/login');
      return
    }
    this.setState({
      appKey:params.appKey,
      ys7Code:params.ys7Code
    })
  }

  leftClick(){
    this.props.history.goBack()
  }

  geToDoor(){
    this.myInputItem.myValidateFields((obj)=>{
      // obj 即为输入的数据
      const params = {
        'ys7_code':this.state.ys7Code,
        clientType:1,
        appKey:this.state.appKey,
        appSecret:obj.secret
      };
     this.getToken(params);
    });

  }

  getToken(params){
    service.addEnterPrise(params)
      .then(res =>{
        console.log(res);
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
              })
            },2000)
          })
        }
      })
      .catch(err =>{
        console.log(err);
      })
  }

  render() {
    const {appKey,msg} = this.state;
    return (
      <div className='addSecret'>
        <MliveHeader
          leftShow leftClick={this.leftClick.bind(this)} title='完善信息'
        />
        <div className='addSecret-info'>
          <h3>
            您是莹石开发者用户
          </h3>
          <h4>需要您输入您的Secret</h4>
          <div>Appkey</div>
          <p>{appKey}</p>
          <MyInputItem
            wrappedComponentRef={ref => this.myInputItem = ref}
            dataSource={[
              {
                label: '',
                type:'text',
                placeholder: '请输入您的Secret',
                initialValue: '',
                key: 'secret',
                rules: [
                  {required: true, message: '请输入您的Secret'},
                ],
                error: ''
              }
            ]}
          />
          <div className='addSecret-getSecret'>
            <a href="https://open.ys7.com/console/application.html">前往开放平台获取Secret</a>
          </div>
        </div>
        {
          msg &&
          <div className='addSecret-msg'>
            {msg}
          </div>
        }
        <MyButton
          title='确定并进入云门禁'
          onClick={this.geToDoor.bind(this)}
        />
      </div>
    );
  }
}


export default AddSecret;
