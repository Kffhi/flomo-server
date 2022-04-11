const mockRouter = require('./mock')
const tagRouter = require('./tags')
const stateRouter = require('./state')

const routes = (app) => {
    app.use('/mock', mockRouter)
    app.use('/tag', tagRouter)
    app.use('/state', stateRouter)
}

module.exports = routes
