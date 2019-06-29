import dva from 'dva';
import './assets/css/index.less';
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app').default);

// 4. Router
app.router(require('./router').default);
// app.router(require('./routes/home').default);

// 5. Start
app.start('#root');
