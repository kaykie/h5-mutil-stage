import React, {Suspense} from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';

const App = React.lazy(() => import('./routes/App'));

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route exact path="/" render={() => <App history={history}/>}/>
          <Redirect to='/'/>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default RouterConfig;

