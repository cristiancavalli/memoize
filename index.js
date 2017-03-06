const DataStore = require('./DataStore.js');

function memoize (fn) {
  let argShards = new DataStore();
  return function () {
    var shard = argShards.known(arguments);
    if (!shard) {
      return argShards.consume(arguments, fn).outputArtifact;
    }
    return shard.outputArtifact;
  }
}

module.exports = memoize;
