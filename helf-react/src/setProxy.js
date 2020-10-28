// React (Client) 와 Node.js(Server)를 연동하기 위해 'http-proxy-middleware'를 이용

const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        proxy('/api', {
            target : 'http://localhost:5000/'
        })
    )
}