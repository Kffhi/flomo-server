const bodyParser = require('body-parser')
const fs = require("fs")
const express = require("express")
const router = require('./router')
const path = require("path");
const tagsRouter = require('./router/tags')

const app = express()
const hostname = "localhost"
const port = process.env.PORT || 2022

app.use(bodyParser.json())


registerGetMockRouter()
registerSetMockRouter()
tagsRouter.getAllTag()

app.use(router)

module.exports = app.listen(port, () => {
    console.log(`Server listening on http://${hostname}:${port}, Ctrl+C to stop`)
})

function registerGetMockRouter() {
    router.get('/getMock', function (req, res) {
        const data = fs.readFileSync(path.resolve(__dirname, './database/mock.json'), 'utf-8')
        res.json({
            msg: `增加nodemon测试`,
            data: JSON.parse(data)
        })
    })
}

function registerSetMockRouter() {
    router.get('/setMock', function (req, res) {
        let data = fs.readFileSync(path.resolve(__dirname, './database/mock.json'), 'utf-8')
        data = JSON.parse(data)
        data.setMes = req.query.msg
        data = JSON.stringify(data)
        fs.writeFile(path.resolve(__dirname, './database/mock.json'), data, () => {
            res.json({
                msg: `OK`
            })
        })
    })
}
