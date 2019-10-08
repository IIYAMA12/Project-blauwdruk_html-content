function deepCopy(oldObj) {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === 'object') {
      newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
      for (var i in oldObj) {
          newObj[i] = deepCopy(oldObj[i]);
      }
  }
  return newObj;
}

// https://coderwall.com/p/m24lsq/deep-copy-object-in-javascript