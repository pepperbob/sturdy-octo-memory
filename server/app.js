const {startServer, executeTasksListener, requestsForUrls} = require('./proxy');
const {combine} = require('./reducer')

module.exports = {
    app: urls => startServer(executeTasksListener(requestsForUrls(urls), combine))
}