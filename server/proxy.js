var http = require('http');
var async = require('async');
var request = require('request');

var Cache = require('./cache');

const cache = new Cache(30);

const requestForwardPromise = (url, incomingReq) => {
    return new Promise((res, err) => {
        incomingReq.pipe(request(url, (error, response, body) => {
            
            if (!error && response.statusCode == 200) {
                result = { ok: JSON.parse(body) };
            } else {
                result = {error: { source: url, status: response.statusCode }};
            }

            res(result);
        }))
    })
}

/** infrastruktur / boilerplate */
const requestForwardFn = url => incomingReq => resultCallback => {
    cache.get(url, () => requestForwardPromise(url, incomingReq)).then(result => resultCallback(result.error, result.ok));
};

const requestsForUrls = urls => req => urls.map(requestForwardFn).map(executeRequestFn => executeRequestFn(req));

const executeTasksListener = (tasks, resultReducerFn) => (req, resp) => {
    async.parallel(async.reflectAll(tasks(req)),
        (err, results) => {
            resp.writeHead(200, { "Content-Type": "application/json" });
            resp.write(JSON.stringify(resultReducerFn(results)));
            resp.end();
        }
    )
}

const startServer = listener => {
    return new Promise((res, rej) => {
        console.log('node.js application starting...');
        var svr = http.createServer((req, res) => {
            console.log("Incomsing Request");
            
            listener(req, res);
        
        });
        svr.listen(9000, function () {
            console.log('Node HTTP server is listening');
            res();
        });
    })
}

module.exports = {
    startServer,
    executeTasksListener,
    requestsForUrls
}