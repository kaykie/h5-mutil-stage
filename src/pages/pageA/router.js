import React, {Suspense} from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';

const App = React.lazy(() => import('./routes/App'));

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route exact path="/index" render={() => <App />} />
          <Redirect to='/index' />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default RouterConfig;

