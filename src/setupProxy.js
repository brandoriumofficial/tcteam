// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost/tcteam',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/backend/admin/products/products.php'
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      }
    })
  );
};