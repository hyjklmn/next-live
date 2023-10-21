const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const devProxy = {
    // '/api': {
    //     target: 'http://yj1211.work:8013', // 端口自己配置合适的
    //     pathRewrite: {
    //         '^/api': '/api'
    //     },
    //     changeOrigin: true
    // },
    '/dyu': {
        target: 'https://www.douyu.com',
        pathRewrite: {
            '^/dyu': ''
        },
        changeOrigin: true
    },
    '/mdyu': {
        target: 'https://m.douyu.com',
        pathRewrite: {
            '^/mdyu': ''
        },
        changeOrigin: true,
    },
    '/adyu': {
        target: 'http://alive.nsapps.cn',
        pathRewrite: {
            '^/adyu': ''
        },
        changeOrigin: true
    },
    // huya
    '/ahy': {
        target: 'https://www.huya.com',
        pathRewrite: {
            '^/ahy': ''
        },
        changeOrigin: true
    },
    '/lhy': {
        target: 'https://live.cdn.huya.com',
        pathRewrite: {
            '^/lhy': ''
        },
        changeOrigin: true
    },

    '/mhy': {
        target: 'https://m.huya.com',
        pathRewrite: {
            '^/mhy': ''
        },
        changeOrigin: true,
        onProxyReq: function(proxyReq, req, res) {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/91.0.4472.69');
            proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        },
    },
    '/shy': {
        target: 'https://search.cdn.huya.com',
        pathRewrite: {
            '^/shy': ''
        },
        changeOrigin: true
    },
    /// 匿名登录获取uid
    '/uhy': {
        target: 'https://udblgn.huya.com',
        pathRewrite: {
            '^/uhy': ''
        },
        changeOrigin: true,
    },
    //bilibili
    '/bili': {
        target: 'https://api.live.bilibili.com',
        pathRewrite: {
            '^/bili': ''
        },
        changeOrigin: true,
    },
    '/abili': {
        target: 'https://api.bilibili.com',
        pathRewrite: {
            '^/abili': ''
        },
        changeOrigin: true,
        onProxyReq: function(proxyReq, req, res) {
            proxyReq.setHeader('Cookie', 'buvid3=infoc;');
        }
    },
    // douyin
    '/dyin': {
        target: 'https://live.douyin.com',
        pathRewrite: {
            '^/dyin': ''
        },
        changeOrigin: true,
        onProxyReq: function(proxyReq, req, res) {
            proxyReq.setHeader('Referer', 'https://live.douyin.com/')
            // proxyReq.setHeader('Cookie', `__ac_nonce=${generateRandomString(21)}`)
        }
    },
    '/wdyin': {
        target: 'https://www.douyin.com',
        pathRewrite: {
            '^/wdyin': ''
        },
        changeOrigin: true,
        onProxyReq: function(proxyReq, req, res) {
            proxyReq.setHeader('Referer', 'https://www.douyin.com/');
            proxyReq.setHeader('Cookie', `__ac_nonce=${generateRandomString(21)}`)
        }
    },
    '/dysign': {
        target: 'https://tk.nsapps.cn/',
        pathRewrite: {
            '^/dysign': ''
        },
        changeOrigin: true
    }
}
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev
})
const handle = app.getRequestHandler()
app.prepare()
    .then(() => {
        const server = express()
        if (dev && devProxy) {
            Object.keys(devProxy).forEach(function (context) {
                server.setMaxListeners(0)
                server.use(createProxyMiddleware(context, devProxy[context]))
            })
        }

        server.all('*', (req, res) => {
            handle(req, res)
        })

        server.listen(port, err => {
            if (err) {
                throw err
            }
            console.log(`> Ready on http://localhost:${port}`)
        })
        
    })
    .catch(err => {
        console.log('An error occurred, unable to start the server')
        console.log('发生错误，无法启动服务器')
        console.log(err)
    })

function generateRandomString(length) {
    const values = Array.from({ length }, () => Math.floor(Math.random() * 16));
    const randomString = values.map((value) => value.toString(16)).join('');
    return randomString;
  }