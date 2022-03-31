const express = require("express")
const bodyParser = require('body-parser')
const fs = require("fs")
const path = require("path");

const hostname = "localhost"
const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())

const router = express.Router()

registerGetMockRouter()
registerSetMockRouter()

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
