const express = require("express")
const bodyParser = require('body-parser')

const hostname = "localhost"
const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())

const router = express.Router()

registerSimpleRouter()

app.use(router)

module.exports = app.listen(port, () => {
    console.log(`Server listening on http://${hostname}:${port}, Ctrl+C to stop`)
})

function registerSimpleRouter() {
    router.get('/simple/get', function (req, res) {
        res.json({
            msg: `hello world`
        })
    })
}
