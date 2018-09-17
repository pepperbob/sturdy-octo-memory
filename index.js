const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const { app } = require('./server/app')

app(config.endpoints);
