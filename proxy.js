// proxy.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://7.wan.com",
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "",
    },

    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("Cookie", "name=x39lvk0hn");
      proxyReq.setHeader(
        "Cookie",
        "PHPSESSID=72bdc30c83b21dc4fabe239d31540b38"
      );
      proxyReq.setHeader(
        "Cookie",
        "gameplf_anti_csrf=eb341820cd3a3485461a61b1e97d31b1"
      );
      proxyReq.setHeader(
        "Cookie",
        "login_check_ip=3991f24fdbc85d5e32d314c789c24441"
      );
      proxyReq.setHeader("Cookie", "WAN_COM_LANGUAGES=pt");
      proxyReq.setHeader(
        "Cookie",
        "gameplf_v2_wan_ab_auth=59adS453n7O742Wm%2FhXcmjplj51MmiYeXbJ4Tp9P9Bcq6wmP4Ea3NV8CR0dmACaRLN2cFAFi6XQ"
      );

      proxyReq.setHeader("Cookie", cookies);
      proxyReq.setHeader("Origin", "https://7.wan.com");

      console.log("Proxying request to:", proxyReq.path);
      console.log("Request Headers:", req.headers);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Garante que o navegador aceite a resposta
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "*");
    },
  })
);

app.listen(3000, () => {
  console.log("Proxy rodando em http://localhost:3000");
});
