import React, {Suspense} from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';

const FaceArea = React.lazy(() => import('./routes/faceArea')),
  FaceSearch = React.lazy(() => import('./routes/faceSearch')),
  AddArea = React.lazy(() => import('./routes/faceArea/cell/addArea')),
  DeviceList = React.lazy(() => import('./routes/faceArea/cell/deviceList')),
  AllDeviceList = React.lazy(() => import('./routes/faceArea/cell/allDeviceList')),
  AreaList = React.lazy(() => import('./routes/faceArea/cell/areaList')),
  ResultList = React.lazy(() => import('./routes/faceSearch/cell/resultList')),
  ResultDetail = React.lazy(() => import('./routes/faceSearch/cell/resultDetail')),
  App = React.lazy(() => import('./routes/App'));

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route exact path="/" render={() => <App history={history}/>}/>
          <Route exact path="/faceArea" render={() => <FaceArea history={history}/>}/>
          <Route exact path="/faceSearch" render={() => <FaceSearch/>}/>
          <Route exact path='/addArea' render={() => <AddArea history={history}/>}/>
          <Route exact path='/deviceList' render={() => <DeviceList history={history}/>}/>
          <Route exact path='/areaList' render={() => <AreaList history={history}/>}/>
          <Route exact path='/allDeviceList' render={() => <AllDeviceList history={history}/>}/>
          <Route exact path='/resultList' render={() => <ResultList history={history}/>}/>
          <Route exact path='/resultDetail' render={() => <ResultDetail history={history}/>}/>
          <Redirect to='/'/>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default RouterConfig;

