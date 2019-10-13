const dotenv = require('dotenv').config();
const http = require('http');

const mongoose = require('./connectToMongoDb');
const socketIO = require('socket.io');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const express = require('express');
const bodyParser = require('body-parser');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');

const routes = require('./routes/index');
const middlewares = require('./middlewares/index');
// const config = require('./utils/index');

const webpackConfig = require('../webpack.config.js');

const port = process.env.PORT || 6001;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);
global.socket = io;

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/** Roots routes */

app.use('/api/v1/users', routes.users);
app.use('/api/v1/contacts', middlewares.authenticate, routes.contacts);
app.use('/api/v1/transaction', middlewares.authenticate, routes.transactions);
// app.use('/api/v1/orders', middlewares.authenticateAdmin, routes.orders);
// app.use('/api/v1/stores', middlewares.authenticateToken, routes.stores);
// app.use('/api/v1/shipment', middlewares.authenticateToken, middlewares.authorizeStore, routes.trackingHistory);
// app.use('/api/v1/carrier', middlewares.authenticateToken, middlewares.authorizeStore, routes.carriers);
// app.use('/api/v1/', middlewares.authenticateToken, middlewares.authorizeStore, routes.counts);


const isDevelopment = true;
// config.APP_ENVIRONMENT !== 'production';
console.log('isDevelopment: ', isDevelopment);
if (isDevelopment) {
  const compiler = webpack(webpackConfig);
  const webpackExpressMiddleware = webpackMiddleware(compiler, {
    hot: true,
    inline: true,
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(webpackExpressMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.join(__dirname, '../', 'client', 'public')));

} else {
  app.use(express.static(path.join(__dirname, '../', 'dist', 'public')));
  const staticPath = path.resolve(__dirname, '../dist');
  app.use('/dist', express.static(staticPath));
}

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/index.html'));
});

server.listen(port, () => console.log(`Running on localhost:${port}`));

process.on('unhandledRejection', async (reason, promise) => {
  console.log('Unhandled Rejection at:', reason);
});