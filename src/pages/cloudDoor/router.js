import React, {Suspense} from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';
import dsbridge from 'dsbridge';
import PublicService from '../../services/PubliceService';
import config from '../faceSearch/config';
import {Toast} from 'antd-mobile'

const App = React.lazy(() => import('./routes/App')),
  Login = React.lazy(() => import('./routes/login')),
  AddDevice = React.lazy(() => import('./routes/deviceManage/cell/addDevice')),
  AddDeviceName = React.lazy(() => import('./routes/deviceManage/cell/addDeviceName')),
  DeviceDetail = React.lazy(() => import('./routes/deviceManage/cell/deviceDetail')),
  SearchDeviceResult = React.lazy(() => import('./routes/deviceManage/cell/searchResult')),
  SearchEventResult = React.lazy(() => import('./routes/eventSearch/cell/searchResult')),

  PersonDetail = React.lazy(() => import('./routes/personManage/personDetail')),
  PersonInfo = React.lazy(() => import('./routes/personManage/personInfo')),
  MessageList = React.lazy(() => import('./routes/personManage/message/messageList')),
  MessageDetail = React.lazy(() => import('./routes/personManage/message/messageDetail')),
  PhotoUpload = React.lazy(() => import('./routes/personManage/photoUpload')),
  DeviceSelect = React.lazy(() => import('./routes/personManage/deviceSelect')),
  PersonSearchResult = React.lazy(() => import('./routes/personManage/searchResult/personSearchResult')),
  DeviceSearchResult = React.lazy(() => import('./routes/personManage/searchResult/deviceSearchResult'));

//  以下为登陆界面
const ChartCode = React.lazy(() => import('./routes/login/cell/chartCode')),
  EditPassword = React.lazy(() => import('./routes/login/cell/editPassword')),
  ForgetPasswordCode = React.lazy(() => import('./routes/login/cell/forgetPasswordCode')),
  Register = React.lazy(() => import('./routes/login/cell/register')),
  Protocol = React.lazy(() => import('./routes/login/cell/protocol')),
  AddSecret = React.lazy(() => import('./routes/login/cell/addSecret')),
  ForgetPasswordPhone = React.lazy(() => import('./routes/login/cell/forgetPasswordPhone'));


function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route exact path="/index" render={() => <App />} />
          <Route exact path="/addDevice" render={() => <AddDevice />} />
          <Route exact path="/searchDeviceResult" render={() => <SearchDeviceResult />} />
          <Route exact path="/addDeviceName" render={() => <AddDeviceName />} />
          <Route exact path="/deviceDetail" render={() => <DeviceDetail />} />
          <Route exact path='/person/detail/:id' render={() => <PersonDetail />} />
          <Route exact path='/person/info' render={() => <PersonInfo />} />
          <Route exact path='/person/message' render={() => <MessageList />} />
          <Route exact path='/person/message/detail' render={() => <MessageDetail />} />
          <Route exact path='/person/upload' render={() => <PhotoUpload />} />
          <Route exact path='/person/device' render={() => <DeviceSelect />} />
          <Route exact path='/person/search' render={() => <PersonSearchResult />} />
          <Route exact path='/person/search/device' render={() => <DeviceSearchResult />} />


          <Route exact path="/searchEventResult" render={() => <SearchEventResult />} />


          <Route exact path="/login" render={() => <Login history={history} />} />
          <Route exact path="/forgetpasswordphone" render={() => <ForgetPasswordPhone history={history} />} />
          <Route exact path="/forgetpasswordcode" render={() => <ForgetPasswordCode history={history} />} />
          <Route exact path="/editpassword" render={() => <EditPassword history={history} />} />
          <Route exact path="/chartcode" render={() => <ChartCode history={history} />} />
          <Route exact path="/register" render={() => <Register history={history} />} />
          <Route exact path="/protocol" render={() => <Protocol history={history} />} />
          <Route exact path="/addSecret" render={() => <AddSecret history={history} />} />
          <Redirect to='/index' />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default RouterConfig;

