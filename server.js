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
    '/hy': {
        target: 'https://www.huya.com/cache.php',
        pathRewrite: {
            '^/hy': ''
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
        target: 'https://udblgn.huya.com/web/anonymousLogin',
        pathRewrite: {
            '^/uhy': ''
        },
        changeOrigin: true,
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
