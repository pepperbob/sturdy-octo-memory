const NodeCache = require('node-cache');

class Cache {

    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: true });
    }

    get(key, storeFunction) {
        const value = this.cache.get(key);
        if (value) {
            console.log("Cache Hit " + key);
            return Promise.resolve(value);
        }

        console.log("Cache miss " + key);
        return storeFunction().then((result) => {
            this.cache.set(key, result);
            return result;
        });
    }

    del(keys) {
        this.cache.del(keys);
    }

    flush() {
        this.cache.flushAll();
    }
}


module.exports = Cache;