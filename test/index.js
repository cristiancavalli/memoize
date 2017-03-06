import test from 'ava';
import memoize from '../index.js';

test('Basic caching', t => {
  var args = [1, 2, 3];
  var otherArgs = [1, 'hello', 3];
  var fn = function (a, b, c) {
    return a + b + c;
  };
  var memed = memoize(fn);
  t.deepEqual(memed(...args), 6);
  t.deepEqual(memed(...otherArgs), '1hello3');
});

test('Multi-part constituent caching', t => {
  var args = [[1, 'hello'], null, true];
  var otherArgs = [[1, 'goodbye'], null, true];
  var fn = function (a, b, c) {
    return a + b + c;
  };
  var memed = memoize(fn);
  t.deepEqual(memed(...args), '1,hellonulltrue');
  t.deepEqual(memed(...otherArgs), '1,goodbyenulltrue');
});
