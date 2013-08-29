/**
 * @param {Function} classA
 * @param {Function} classB
 * @param {any} props
 */
function __extend(classA, classB, props) {
  __mixin(classA, classB);

  function __() {
    this.constructor = classA;
  }

  __.prototype = classB.prototype;
  classA.prototype = new __();

  if (props) {
    __define(classA, props);
  }
}

/**
 * @param {any} classA
 * @param {any} props
 */
function __define(classA, props) {
  __mixin(classA.prototype, props);
}

/**
 * @param {any} classA
 * @param {any} props
 */
function __mixin(objA, objB) {
  for (var prop in objB) {
    if (objB.hasOwnProperty(prop)) {
      objA[prop] = objB[prop];
    }
  }
}
