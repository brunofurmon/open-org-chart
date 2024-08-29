const http = require('http');
const express = require('express');
// const cors = require('cors');
// const compress = require('compression')();
// const bodyParser = require('body-parser');
// const helmet = require('helmet');
const healtcheckRouterBuilder = require('../routes/healthcheck/routes');
const homeRoutesBuilder = require('../routes/home/routes');
const render = require('./utils');
const nextApp = require('next');
const nextConfig = require('../../../../next.config');


const init = (services) => {

  const nextWrappedHttpServer = async () => {
    const devMode = process.env.NODE_ENV !== 'production';
  
    const app = nextApp({ ...nextConfig, dev: devMode });    
    const appHandle = app.getRequestHandler();
    await app.prepare();

    const server = express();
  
    // Security enforcement
    // app.disable('x-powered-by');
    // app.use(helmet());
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(bodyParser.json({ limit: '5mb' }));
    // app.use(compress);
    // app.use(cors());
  
    // Public assets
    server.use(express.static('public'));

    // Routing
    server.use('/', healtcheckRouterBuilder.init({ cacheIsReady: services.cache.isReady}));
    const renderFuncion = render(app);
    server.use('/', homeRoutesBuilder.init(services, renderFuncion));
    server.get('/_next/*', appHandle);
  
    return server;
  };

  return {
    nextWrappedHttpServer
  }
};

module.exports = init;
