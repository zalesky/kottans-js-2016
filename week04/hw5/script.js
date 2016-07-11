function map(array, fn) {
  if (!(array instanceof Array))
    throw new Error('First argument is not an Array');

  return new Promise((res, rej) => {
      var length = array.length,
        result = [],
        i = 0,
        count = 0;
    for (; i < length; i += 1) {
      if (typeof array[i].then == "function") {
        count++;
        array[i].then(val => {
            result[i] = fn(val);
            !--count && res(result);
          })
          .catch(rej)

      } else {
        result[i] = fn(array[i]);
        !count && res(result);
      }
    }
  }
}


function some(array, count) {
  var rejected = [],
    result = [],
    counter = 0,
    i = 0,
    length = array.length;

  if (!(array instanceof Array && length && length >= count && count > -1 && (count == count >> 0)))
    throw new Error;

  return new Promise((res, rej) => {
      function finaly_(value) {
        if (result.length < count) {
          result.push(value);
          if (length == ++counter) {
            res(result);
          }
        }
        if (length - rejected.length > count) {
          rej(rejected);
        }
      }
      for (; i < length; i += 1) {
        if (array[i].then == "function") {
          array[i].then(finaly_(value))
                  .catch(err => rejected.push(err));
        } else {
          finaly_(array[i]);
        }
      }
    }
  }
}


function reduce(array, fn) {
  if (!(array instanceof Array))
    throw new Error('First argument is not an Array');

  return new Promise((res, rej) => {
      var total = 0;
        length = array.length,
        i = 0,
        count = 0;
    for (; i < length; i += 1) {
      if (typeof array[i].then == "function") {
        count++;
        array[i].then(val => {
            total += fn(val);
            !--count && res(total);
          })
          .catch(rej)

      } else {
        total += fn(array[i]);
        !count && res(total);
      }
    }
  }
}