const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://serverpetshop.onrender.com",
      changeOrigin: true,
      secure: false,
      ws: false,
    })
  );
};
