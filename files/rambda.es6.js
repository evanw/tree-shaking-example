function curry(fn) {
  return (x, y) => {
    if (y === undefined) {
      return yHolder => fn(x, yHolder);
    }

    return fn(x, y);
  };
}

function add(x, y) {
  return x + y;
}

var add$1 = curry(add);

function addIndex(functor) {
  return function (fn, ...rest) {
    let cnt = 0;
    const newFn = (...args) => fn.apply(null, [...args, cnt++]);

    return functor.apply(null, [newFn, ...rest]);
  };
}

function curryThree(fn) {
  return (x, y, z) => {
    if (y === undefined) {
      const helper = (yHolder, zHolder) => fn(x, yHolder, zHolder);

      return curry(helper);
    } else if (z === undefined) {
      return zHolder => fn(x, y, zHolder);
    }

    return fn(x, y, z);
  };
}

function adjust(fn, index, arr) {
  const clone = arr.concat();

  return clone.map((val, key) => {
    if (key === index) {
      return fn(arr[index]);
    }

    return val;
  });
}

var adjust$1 = curryThree(adjust);

function filterObject(fn, obj) {
  const willReturn = {};
  for (const prop in obj) {
    if (fn(obj[prop])) {
      willReturn[prop] = obj[prop];
    }
  }

  return willReturn;
}

function filter(fn, arr) {
  if (arr.length === undefined) {
    return filterObject(fn, arr);
  }
  let index = -1;
  let resIndex = 0;
  const len = arr.length;
  const willReturn = [];

  while (++index < len) {
    const value = arr[index];
    if (fn(value)) {
      willReturn[resIndex++] = value;
    }
  }

  return willReturn;
}

var filter$1 = curry(filter);

function all(condition, arr) {
  return filter$1(condition, arr).length === arr.length;
}

var all$1 = curry(all);

function any(fn, arr) {
  let counter = 0;
  while (counter < arr.length) {
    if (fn(arr[counter])) {
      return true;
    }
    counter++;
  }

  return false;
}

var any$1 = curry(any);

function allPass(conditions, x) {
  if (arguments.length === 1) {
    return xHolder => allPass(conditions, xHolder);
  }

  return !any$1(condition => !condition(x), conditions);
}

function anyPass(conditions, x) {
  if (arguments.length === 1) {
    return xHolder => anyPass(conditions, xHolder);
  }

  return any$1(condition => condition(x))(conditions);
}

function append(val, arr) {
  if (typeof arr === 'string') {
    return `${arr}${val}`;
  }
  const clone = arr.concat();
  clone.push(val);

  return clone;
}

var append$1 = curry(append);

function both(x, y) {
  return input => x(input) && y(input);
}

var both$1 = curry(both);

//Taken from https://github.com/getify/Functional-Light-JS/blob/master/ch4.md
function compose(...fns) {
  return result => {
    const list = fns.slice();

    while (list.length > 0) {
      result = list.pop()(result);
    }

    return result;
  };
}

function concat(x, y) {

  return typeof x === 'string' ? `${x}${y}` : [...x, ...y];
}

var concat$1 = curry(concat);

function type(a) {
  const typeOf = typeof a;
  if (a === null) {
    return 'Null';
  } else if (a === undefined) {
    return 'Undefined';
  } else if (typeOf === 'boolean') {
    return 'Boolean';
  } else if (typeOf === 'number') {
    return 'Number';
  } else if (typeOf === 'string') {
    return 'String';
  } else if (Array.isArray(a)) {
    return 'Array';
  } else if (a instanceof RegExp) {
    return 'RegExp';
  }

  const asStr = a.toString();

  if (asStr.startsWith('async')) {
    return 'Async';
  } else if (asStr === '[object Promise]') {
    return 'Promise';
  } else if (asStr.includes('function') || asStr.includes('=>')) {
    return 'Function';
  }

  return 'Object';
}

function equals(a, b) {
  if (arguments.length === 1) {
    return bHolder => equals(a, bHolder);
  }

  if (a === b) {
    return true;
  }
  const aType = type(a);
  if (aType !== type(b)) {
    return false;
  }

  if (aType === 'Array') {
    const aClone = Array.from(a);
    const bClone = Array.from(b);

    return aClone.sort().toString() === bClone.sort().toString();
  }

  if (aType === 'Object') {
    const aKeys = Object.keys(a);
    if (aKeys.length === Object.keys(b).length) {
      if (aKeys.length === 0) {
        return true;
      }
      let flag = true;
      aKeys.map(val => {
        if (flag) {
          const aValType = type(a[val]);
          const bValType = type(b[val]);
          if (aValType === bValType) {
            if (aValType === 'Object') {
              if (Object.keys(a[val]).length === Object.keys(b[val]).length) {
                if (Object.keys(a[val]).length !== 0) {
                  if (!equals(a[val], b[val])) {
                    flag = false;
                  }
                }
              } else {
                flag = false;
              }
            } else if (!equals(a[val], b[val])) {
              flag = false;
            }
          } else {
            flag = false;
          }
        }
      });

      return flag;
    }
  }

  return false;
}

function contains(val, arr) {
  let index = -1;
  let flag = false;
  while (++index < arr.length && !flag) {
    if (equals(arr[index], val)) {
      flag = true;
    }
  }

  return flag;
}

var contains$1 = curry(contains);

//taken from the last comment of https://gist.github.com/mkuklis/5294248

function curry$1(f, a = []) {
  return (...p) => (o => o.length >= f.length ? f(...o) : curry$1(f, o))([...a, ...p]);
}

var dec = (x => x - 1);

function defaultTo(defaultArgument, inputArgument) {
  if (arguments.length === 1) {
    return inputArgumentHolder => defaultTo(defaultArgument, inputArgumentHolder);
  }

  return inputArgument === undefined || inputArgument === null || Number.isNaN(inputArgument) === true ? defaultArgument : inputArgument;
}

function divide(x, y) {
  return x / y;
}

var divide$1 = curry(divide);

function drop(dropNumber, a) {
  return a.slice(dropNumber);
}

var drop$1 = curry(drop);

function dropLast(dropNumber, a) {
  return a.slice(0, -dropNumber);
}

var dropLast$1 = curry(dropLast);

function either(x, y) {
  return input => x(input) || y(input);
}

var either$1 = curry(either);

function endsWith(x, y) {
  return y.endsWith(x);
}

var endsWith$1 = curry(endsWith);

var inc = (x => x + 1);

function find(fn, arr) {
  return arr.find(fn);
}

var find$1 = curry(find);

function findIndex(fn, arr) {
  const length = arr.length;
  let index = -1;

  while (++index < length) {
    if (fn(arr[index])) {
      return index;
    }
  }

  return -1;
}

var findIndex$1 = curry(findIndex);

function flatten(arr, willReturn) {
  willReturn = willReturn === undefined ? [] : willReturn;

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      flatten(arr[i], willReturn);
    } else {
      willReturn.push(arr[i]);
    }
  }

  return willReturn;
}

function flipExport(fn) {
  return (...input) => {
    if (input.length === 1) {
      return holder => fn(holder, input[0]);
    } else if (input.length === 2) {
      return fn(input[1], input[0]);
    }

    return undefined;
  };
}

function flip(fn, ...input) {
  return flipExport(fn);
}

function tap(fn, input) {
  fn(input);

  return input;
}

var tap$1 = curry(tap);

function mapObject(fn, obj) {
  const willReturn = {};
  for (const prop in obj) {
    willReturn[prop] = fn(obj[prop]);
  }

  return willReturn;
}

function map(fn, arr) {
  if (arr.length === undefined) {
    return mapObject(fn, arr);
  }
  let index = -1;
  const length = arr.length;
  const willReturn = Array(length);

  while (++index < length) {
    willReturn[index] = fn(arr[index]);
  }

  return willReturn;
}

var map$1 = curry(map);

function forEach(fn, arr) {
  return map$1(tap$1(fn), arr);
}

var forEach$1 = curry(forEach);

function has(prop, obj) {
  return obj[prop] !== undefined;
}

var has$1 = curry(has);

function head(a) {
  if (typeof a === 'string') {
    return a[0] || '';
  }

  return a[0];
}

function ifElse(conditionFn, ifFn, elseFn) {
  return input => {
    if (conditionFn(input) === true) {
      return ifFn(input);
    }

    return elseFn(input);
  };
}

var ifElse$1 = curryThree(ifElse);

function isNil(x) {
  return x === undefined || x === null;
}

function includes(x, y) {
  return y.includes(x);
}

var includes$1 = curry(includes);

function indexOf(x, arr) {
  let index = -1;
  const length = arr.length;

  while (++index < length) {
    if (arr[index] === x) {
      return index;
    }
  }

  return -1;
}

var indexOf$1 = curry(indexOf);

function baseSlice(array, start, end) {
  let index = -1;
  let length = array.length;

  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;

  const result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }

  return result;
}

function init(a) {
  if (typeof a === 'string') {
    return a.slice(0, -1);
  }

  return a.length ? baseSlice(a, 0, -1) : [];
}

function join(glue, arr) {
  return arr.join(glue);
}

var join$1 = curry(join);

function lastIndexOf(x, arr) {
  let willReturn = -1;
  arr.map((value, key) => {
    if (equals(value, x)) {
      willReturn = key;
    }
  });

  return willReturn;
}

var lastIndexOf$1 = curry(lastIndexOf);

function last(a) {
  if (typeof a === 'string') {
    return a[a.length - 1] || '';
  }

  return a[a.length - 1];
}

function length(x) {

  return x.length;
}

function match(regex, str) {
  const willReturn = str.match(regex);

  return willReturn === null ? [] : willReturn;
}

var match$1 = curry(match);

function merge(obj, newProps) {
  return Object.assign({}, obj, newProps);
}

var merge$1 = curry(merge);

function modulo(x, y) {
  return x % y;
}

var modulo$1 = curry(modulo);

function multiply(x, y) {
  return x * y;
}

var multiply$1 = curry(multiply);

function omit(keys, obj) {
  if (arguments.length === 1) {
    return objHolder => omit(keys, objHolder);
  }
  if (obj === null || obj === undefined) {
    return undefined;
  }
  if (typeof keys === 'string') {
    keys = keys.split(',');
  }

  const willReturn = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      willReturn[key] = obj[key];
    }
  }

  return willReturn;
}

function partialCurry(fn, inputArguments = {}) {
  return inputArgumentsHolder => {
    if (type(fn) === 'Async' || type(fn) === 'Promise') {
      return new Promise((resolve, reject) => {
        fn(merge$1(inputArgumentsHolder, inputArguments)).then(resolve).catch(reject);
      });
    }

    return fn(merge$1(inputArgumentsHolder, inputArguments));
  };
}

function path(pathArr, obj) {
  if (arguments.length === 1) {
    return objHolder => path(pathArr, objHolder);
  }
  if (obj === null || obj === undefined) {
    return undefined;
  }
  let holder = obj;
  let counter = 0;
  if (typeof pathArr === 'string') {
    pathArr = pathArr.split('.');
  }
  while (counter < pathArr.length) {
    if (holder === null || holder === undefined) {
      return undefined;
    }
    holder = holder[pathArr[counter]];
    counter++;
  }

  return holder;
}

function pathOr(defaultValue, inputPath, inputObject) {
  return defaultTo(defaultValue, path(inputPath, inputObject));
}

var pathOr$1 = curry$1(pathOr);

function pick(keys, obj) {
  if (arguments.length === 1) {
    return objHolder => pick(keys, objHolder);
  }
  if (obj === null || obj === undefined) {
    return undefined;
  }
  if (typeof keys === 'string') {
    keys = keys.split(',');
  }

  const willReturn = {};
  let counter = 0;
  while (counter < keys.length) {
    if (keys[counter] in obj) {
      willReturn[keys[counter]] = obj[keys[counter]];
    }
    counter++;
  }

  return willReturn;
}

function pipe(...fns) {
  return compose(...fns.reverse());
}

function pluck(keyToPluck, arr) {
  const willReturn = [];
  map$1(val => {
    if (!(val[keyToPluck] === undefined)) {
      willReturn.push(val[keyToPluck]);
    }
  }, arr);

  return willReturn;
}

var pluck$1 = curry(pluck);

function prepend(val, arr) {
  if (typeof arr === 'string') {
    return `${val}${arr}`;
  }
  const clone = arr.concat();
  clone.unshift(val);

  return clone;
}

var prepend$1 = curry(prepend);

function prop(key, obj) {
  return obj[key];
}

var prop$1 = curry(prop);

function propEq(key, val, obj) {
  return obj[key] === val;
}

var propEq$1 = curryThree(propEq);

function range(start, end) {
  const willReturn = [];
  for (let i = start; i < end; i++) {
    willReturn.push(i);
  }

  return willReturn;
}

function reduce(fn, initialValue, arr) {
  return arr.reduce(fn, initialValue);
}

var reduce$1 = curryThree(reduce);

function reject(predicate, collection) {
  return filter$1(x => !predicate(x), collection);
}

var reject$1 = curry(reject);

function repeat(a, num) {
  const willReturn = Array(num);

  return willReturn.fill(a);
}

var repeat$1 = curry(repeat);

function replace(regex, replacer, str) {
  return str.replace(regex, replacer);
}

var replace$1 = curryThree(replace);

function reverse(arr) {
  const clone = arr.concat();

  return clone.reverse();
}

function sort(fn, arr) {
  const arrClone = arr.concat();

  return arrClone.sort(fn);
}

var sort$1 = curry(sort);

function sortBy(fn, arr) {
  const arrClone = arr.concat();

  return arrClone.sort((a, b) => {
    const fnA = fn(a);
    const fnB = fn(b);

    return fnA < fnB ? -1 : fnA > fnB ? 1 : 0;
  });
}

var sortBy$1 = curry(sortBy);

function split(glue, str) {
  return str.split(glue);
}

var split$1 = curry(split);

function splitEvery(num, a) {
  num = num > 1 ? num : 1;

  const willReturn = [];
  let counter = 0;
  while (counter < a.length) {
    willReturn.push(a.slice(counter, counter += num));
  }

  return willReturn;
}

var splitEvery$1 = curry(splitEvery);

function startsWith(x, y) {
  return y.startsWith(x);
}

var startsWith$1 = curry(startsWith);

function subtract(x, y) {
  return x - y;
}

var subtract$1 = curry(subtract);

function tail(arr) {
  return drop$1(1, arr);
}

function take(takeNumber, a) {
  if (typeof a === 'string') {
    return a.slice(0, takeNumber);
  }

  return baseSlice(a, 0, takeNumber);
}

var take$1 = curry(take);

function takeLast(takeNumber, a) {
  const len = a.length;
  takeNumber = takeNumber > len ? len : takeNumber;

  if (typeof a === 'string') {
    return a.slice(len - takeNumber);
  }
  takeNumber = len - takeNumber;

  return baseSlice(a, takeNumber, len);
}

var takeLast$1 = curry(takeLast);

function test(regex, str) {
  return str.search(regex) !== -1;
}

var test$1 = curry(test);

function times(fn, n) {
  return map$1(fn, range(0, n));
}

var times$1 = curry(times);

function toLower(x) {
  return x.toLowerCase();
}

function toUpper(x) {
  return x.toUpperCase();
}

function toString(x) {
  return x.toString();
}

function typedDefaultTo(defaultArgument, inputArgument) {
  if (arguments.length === 1) {
    return inputArgumentHolder => typedDefaultTo(defaultArgument, inputArgumentHolder);
  }

  return type(inputArgument) !== type(defaultArgument) ? defaultArgument : inputArgument;
}

function typedPathOr(defaultValue, inputPath, inputObject) {
  return typedDefaultTo(defaultValue, path(inputPath, inputObject));
}

var typedPathOr$1 = curry$1(typedPathOr);

function uniq(arr) {
  let index = -1;
  const willReturn = [];
  while (++index < arr.length) {
    const value = arr[index];
    if (!contains$1(value, willReturn)) {
      willReturn.push(value);
    }
  }

  return willReturn;
}

function update(index, newValue, arr) {
  const arrClone = arr.concat();

  return arrClone.fill(newValue, index, index + 1);
}

var update$1 = curryThree(update);

function values(obj) {
  const willReturn = [];
  for (const key in obj) {
    willReturn.push(obj[key]);
  }

  return willReturn;
}

function without(itemsToOmit, collection) {
  return reduce$1((accum, item) => !contains$1(item, itemsToOmit) ? accum.concat(item) : accum, [], collection);
}

const always = x => () => x;
const complement = fn => input => !fn(input);
const F = () => false;
const identity = x => x;
const not = x => !x;
const T = () => true;
const trim = x => x.trim();

export { always, complement, F, identity, not, T, trim, add$1 as add, addIndex, adjust$1 as adjust, all$1 as all, allPass, anyPass, any$1 as any, append$1 as append, both$1 as both, compose, concat$1 as concat, contains$1 as contains, curry$1 as curry, dec, defaultTo, divide$1 as divide, drop$1 as drop, dropLast$1 as dropLast, either$1 as either, endsWith$1 as endsWith, inc, equals, filter$1 as filter, find$1 as find, findIndex$1 as findIndex, flatten, flip, forEach$1 as forEach, has$1 as has, head, ifElse$1 as ifElse, isNil, includes$1 as includes, indexOf$1 as indexOf, init, join$1 as join, lastIndexOf$1 as lastIndexOf, last, length, map$1 as map, match$1 as match, merge$1 as merge, modulo$1 as modulo, multiply$1 as multiply, omit, partialCurry, path, pathOr$1 as pathOr, pick, pipe, pluck$1 as pluck, prepend$1 as prepend, prop$1 as prop, propEq$1 as propEq, range, reduce$1 as reduce, reject$1 as reject, repeat$1 as repeat, replace$1 as replace, reverse, sort$1 as sort, sortBy$1 as sortBy, split$1 as split, splitEvery$1 as splitEvery, startsWith$1 as startsWith, subtract$1 as subtract, tap$1 as tap, tail, take$1 as take, takeLast$1 as takeLast, test$1 as test, times$1 as times, toLower, toUpper, toString, type, typedPathOr$1 as typedPathOr, typedDefaultTo, uniq, update$1 as update, values, without };