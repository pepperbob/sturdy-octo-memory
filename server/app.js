const {startServer, proxy, tasks} = require('./proxy');
const {combine} = require('./reducer')

module.exports = {
    app: urls => startServer(proxy(tasks(urls), combine))
}