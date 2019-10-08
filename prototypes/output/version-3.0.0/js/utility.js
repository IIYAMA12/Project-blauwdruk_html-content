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


function getDistanceBetweenPoints2D( x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;

  return Math.sqrt( a*a + b*b );
}

function extendLine2D ( x, y, x2, y2, length ) {
  let vx = x2 - x
  let vy = y2 - y

  const ratio = length / (getDistanceBetweenPoints2D ( x, y, x2, y2 ))

  vx = vx*ratio;
  vy = vy*ratio;

  return [(x + vx),(y + vy)]
}