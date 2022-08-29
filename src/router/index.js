const mockRouter = require('./mock')
const tagRouter = require('./tags')
const stateRouter = require('./state')
const memoRouter = require('./memo')

const routes = (app) => {
    app.use('/mock', mockRouter)
    app.use('/tag', tagRouter)
    app.use('/state', stateRouter)
    app.use('/memo', memoRouter)
}

module.exports = routes
