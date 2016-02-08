var Utils = {};

Utils.inherits = function (subclass, parentClass) {
  var Surrogate = function () {};
  Surrogate.prototype = parentClass.prototype;
  subclass.prototype = new Surrogate();
  subclass.prototype.constructor = subclass;
}

Utils.arrayEquals = function (arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }
  return arr1[0] === arr2[0] && arr1[1] === arr2[1];
}


module.exports = Utils;
