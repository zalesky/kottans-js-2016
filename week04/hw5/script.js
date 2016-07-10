
function map(array, fn) {
  if(!(array instanceof Array)) throw new Error('First argument is not an Array');

  return new Promise((res, rej) => {
    var length = array.length,
        result = [],
        i = 0,
        count = 0;
    for (; i < length; i+=1) {
      if (typeof array[i].then == "function") {
        count++;
        array[i].then(val => {
                  result[i] = fn(array[i]);
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

//TODO {a.z.} to finish
function some(array, count){
  var rejected = [], result = [], counter = 0, i = 0, length = array.length;

  if (!(array instanceof Array && array.length >= count)) throw new Error;

  return new Promise((res, rej) => {
    for (; i < array.length; i+=1) {
      if (array[i].then == "function"){
        array[i].then((res, rej) => {})
      } else {

      }
    }
  }
}
}