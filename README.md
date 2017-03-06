# memoize

A simple memoize implementation using tree-based caching with support for nested array arguments
[Just for fun]

## To test

```bash
> cd memoize
> npm test
```

## To Use

```js
const memoize = require('./index.js');
const cached = memoize(a => a + 2);
cached(1);
cached(2);
// This return will consist of the
// cached result of the prior,
// same-argument invocation
cached(1);
```
