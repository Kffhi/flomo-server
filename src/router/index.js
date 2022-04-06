const mockRouter = require("./mock")
const tagRouter = require("./tags")

const routes = (app) => {
    app.use("/mock", mockRouter)
    app.use("/tag", tagRouter)
}

module.exports = routes
