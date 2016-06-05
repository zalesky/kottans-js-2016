/**
 * Clones sources into target.
 * Tests are here http://plnkr.co/edit/IWnKYUbTMDtYDvvC0hkd
 * @param  {!Object} target    where we copy
 * @param  {!Object} sources   from here we copy methods and properties
 * @param  {Boolean} isExpand  this is an optional parameter. If true than extend objects.
 * @return {!Object}           target with new methods and properties
 */
function deepAssign(target, sources, isExpand) {

    var i = 1,
        argLength = isExpand === true ? arguments.length - 1 : arguments.length,
        newTarget = target;

    for (; i < argLength; i += 1) {
        var arrKeys = Object.keys(arguments[i]),
            keysLength = arrKeys.length,
            k = 0;
        for (; k < keysLength; k += 1) {
            var copy = arguments[i][arrKeys[k]];
            if (copy instanceof Object) {
                if (isExpand === true) {
                    newTarget[arrKeys[k]] = deepAssign(newTarget[arrKeys[k]], copy);
                } else {
                    newTarget[arrKeys[k]] = deepAssign(new copy.constructor(copy), copy);
                }

            } else {
                newTarget[arrKeys[k]] = copy;
            }

        }
    }
    return newTarget
}