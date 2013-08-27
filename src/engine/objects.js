/**
 * @param {Function} classA
 * @param {Function} classB
 * @param {any} props
 */
function extend(classA, classB, props) {
  define(classA, classB);

  function __() {
    this.constructor = classA;
  }

  __.prototype = classB.prototype;
  classA.prototype = new __();

  if (props) {
    define(classA.prototype, props);
  }
}

/**
 * @param {any} classA
 * @param {any} props
 */
function define(classA, props) {
  for (var prop in props) {
    if (props.hasOwnProperty(prop)) {
      classA[prop] = props[prop];
    }
  }
}
