calc={};
calc.add = function(argument) {
  var array = argument.match(/(-?[0-9])+/g) || [];
  var result = 0;
  var length = array.length;
  for (;length--;) {
    if(array[length] < 0)
      throw new Error('negatives not allowed ' + array[length]);
    if (array[length] > 1000) continue;
    result += +array[length];
  }

  return result;
};

module.exports = calc.add;
