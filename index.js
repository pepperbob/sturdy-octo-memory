const fs = require('fs');
const {startServer, proxy, tasks} = require('./proxy');

const config = JSON.parse(fs.readFileSync('./config.json'));

const reduce = results => {
    return results.map(x => x.value)
        .filter(x => !!x)
        .reduce((acc, curr) => ({...acc, ...curr}), {});
}

startServer(proxy(tasks(config.endpoints), reduce));
