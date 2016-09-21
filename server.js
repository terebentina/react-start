const path = require('path');
const app = require('express')();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

if (process.env.NODE_ENV == 'development') {
  // eslint-disable-next-line
  const webpack = require('webpack');
  // eslint-disable-next-line
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // eslint-disable-next-line
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const devConfig = require('./webpack.config.dev');
  const testConfig = require('./webpack.config.test');

  const testsCompiler = webpack(testConfig);

  testsCompiler.watch({}, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Test file bundled');
  });

  const compiler = webpack(devConfig);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: devConfig.output.publicPath,
    stats: { colors: true },
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));

  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
}

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 3000, process.env.HOSTNAME || '0.0.0.0', () => {
  console.log('App started');
});
