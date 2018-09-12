var http = require('http');
var async = require('async');
var request = require('request');

/** infrastruktur / boilerplate */
const pipeRequest = url => req => callback => req.pipe(
    request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        callback(null, JSON.parse(body));
    } else {
      callback({source: url});
    }
}));

const tasks = urls => req => urls.map(pipeRequest).map(buildCallback => buildCallback(req));

const proxy = (tasks, fn) => (req, resp) => {
    async.parallel(async.reflectAll(tasks(req)),
        (err, results) => {
            resp.writeHead(200, {"Content-Type": "application/json"});
            resp.write(JSON.stringify(fn(results)));
            resp.end();
        }
    )
}

const startServer = listener => {
    console.log('node.js application starting...');
    var svr = http.createServer(listener);
    svr.listen(9000, function() {
        console.log('Node HTTP server is listening');
    });
}

module.exports = {
    startServer,
    proxy,
    tasks
}