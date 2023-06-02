const mongoose = require("mongoose");
const util = require("util");
const redis = require("redis");
const keys = require('../config/keys')


const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.cache = function (options = {}) {
  this.shouldCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  console.log("this.shouldCache", this.shouldCache);
  if (!this.shouldCache) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify({
    ...this.getQuery(),
    collection: this.mongooseCollection.name,
  });

  const cachedData = await client.hget(this.hashKey, key);
  if (cachedData) {
    const data = JSON.parse(cachedData);
    console.log("CACHE!");
    return Array.isArray(data)
      ? data.map((doc) => new this.model(doc))
      : new this.model(data);
  } else {
    const data = await exec.apply(this, arguments);
    console.log("NO CACHE!");
    client.hset(this.hashKey, key, JSON.stringify(data));
    return data;
  }
};

module.exports = {
  clearHash(hashKey){
    client.del(JSON.stringify(hashKey));
  }
}