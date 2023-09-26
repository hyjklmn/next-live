const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  let rewtire = {
    // 通过路径重写，去除请求路径中的 `/backend`
    '': ''
  }
  // 代理目标地址
  // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
  // xxxxx 替换为你跨域请求的服务器 如： http://baidu.com
  if (req.url.startsWith('/dyu')) {
    target = 'https://www.douyu.com'
    rewtire = {
      '^/dyu': ''
    }
  }
  if (req.url.startsWith('/adyu')) {
    target = 'http://alive.nsapps.cn'
    rewtire = {
      '^/adyu': ''
    }
  }
  if (req.url.startsWith('/mdyu')) {
    target = 'https://m.douyu.com'
    rewtire = {
      '^/mdyu': ''
    }
  }
  //huya
  if (req.url.startsWith('/hy')) {
    target = 'https://www.huya.com/cache.php'
    rewtire = {
      '^/hy': ''
    }
  }
  if (req.url.startsWith('/lhy')) {
    target = 'https://live.cdn.huya.com'
    rewtire = {
      '^/lhy': ''
    }
  }
  if (req.url.startsWith('/mhy')) {
    target = 'https://m.huya.com'
    rewtire = {
      '^/mhy': ''
    }
  }
  if (req.url.startsWith('/shy')) {
    target = 'https://search.cdn.huya.com'
    rewtire = {
      '^/shy': ''
    }
  }
  if (req.url.startsWith('/uhy')) {
    target = 'https://udblgn.huya.com/web/anonymousLogin'
    rewtire = {
      '^/uhy': ''
    }
  }
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite:rewtire
  })(req, res)
}