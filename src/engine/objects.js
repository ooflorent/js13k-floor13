/**
 * @param {any} classA
 * @param {any} classB
 */
function extend(classA, classB) {
  define(classA, classB);

  function __() {
    this.constructor = classA;
  }

  __.prototype = classB.prototype;
  classA.prototype = new __();
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
