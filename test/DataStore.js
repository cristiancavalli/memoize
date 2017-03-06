import test from 'ava';
import DataStore from '../DataStore.js';
import isPlainObject from 'lodash.isplainobject';

var inst;

test.beforeEach(t => inst = new DataStore());

test('DataStore Simple Tree Assimilation', t => {
  var mockArgs = [1, '2', [1, '*']];
  var fn = function (a, b, c) {
    return a + b + c;
  }
  t.false(inst.known(mockArgs));
  t.deepEqual(inst.consume(mockArgs, fn), {
    argument: '1_number_0,*_string_1_array_2',
    outputArtifact: '121,*',
    children: {}
  });
  t.true(isPlainObject(inst.known(mockArgs)));
  t.deepEqual(inst.known(mockArgs).outputArtifact, '121,*');
});

test('Datastore cumulative trunk rebranding and extension', t => {
  var args = [1, 2, 3];
  var fn = function (a, b, c) {
    return a + b + c;
  }
  t.deepEqual(inst.consume(args, fn), {
    argument: "3_number_2",
    outputArtifact: 6,
    children: {}
  });
  args[2] = 4;
  t.deepEqual(inst.consume(args, fn), {
    argument: "4_number_2",
    outputArtifact: 7,
    children: {}
  });
  args[0] = 'hello';
  t.deepEqual(inst.consume(args, fn), {
    argument: "4_number_2",
    outputArtifact: 'hello24',
    children: {}
  });
  args = args.concat(['goodbye']);
  t.deepEqual(inst.consume(args, fn), {
    argument: "goodbye_string_3",
    outputArtifact: 'hello24',
    children: {}
  });
  t.deepEqual(inst.known(args.slice(0, 3), fn), {
    outputArtifact: 'hello24',
    argument: '4_number_2',
    children: {
      goodbye_string_3: {
        argument: "goodbye_string_3",
        outputArtifact: 'hello24',
        children: {}
      }
    }
  });
});
