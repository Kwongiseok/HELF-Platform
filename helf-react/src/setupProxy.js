// React (Client) 와 Node.js(Server)를 연동하기 위해 'http-proxy-middleware'를 이용

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
      })
    );
  };