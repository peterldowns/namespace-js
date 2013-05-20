// A very hacky test "test" "framework". Simply goes through some expected
// behavior. This needs to be replaced with a real test runner sometime soon.

var Namespace;
// Allow runnings tests from node or in the browser
if (!Namespace) { // Namespace not in the global scope, try to load it
  var namespace = require('./namespace');
  Namespace = namespace.Namespace;
}

var ns = new Namespace();
if (ns.exists('global.age')) throw "Broken exists";

ns.updateGlobal({
  name: 'Peter',
  age: 19
})
if (!(ns.exists('global.age'))) throw "Broken exists";
if (!(ns.get('global.name') === 'Peter')) throw "Broken get";
if (!(ns.get('global.undefined', 'default') === 'default')) throw "Broken get";

ns.define('TestModule', [], function() {this.Helpers = true;});
var outer_ns = ns;
ns.define('PeterModule', ['TestModule.Helpers'], function(ns, Helpers) {
  if (ns !== outer_ns) throw "Broken define";
  if (Helpers !== outer_ns.TestModule.Helpers) throw "Broken define";
  console.log('arguments:', arguments);
  var x = 12;
  this.getX = function() {
    return x;
  }
});

if (!ns.get('PeterModule').getX() === 12) throw "Broken define/get";

ns.define('LibA', [], function(ns) {
  this.sayHello = function(name) {
    return 'Hello ' + name;
  };
});

// This call fails because LibB is not defined.
try {
  ns.define('PetersModule', ['LibA', 'LibB'], function(ns, LibA, LibB) {
    // This function depends on both LibA and LibB
    this.sayHelloToObject = function(object) {
      return LibA.sayHello(LibB.getObjectName(object, 'Anonymous'));
    };
  });
} catch (exception) {
  console.log('caught expected exception:', exception);
}

ns.define('LibB', [], function(ns) {
  this.getObjectName = function(object, _default) {
    return object.name || _default;
  };
});

// This call succeeds because both LibA and LibB are defined
ns.define('PetersModule', ['LibA', 'LibB'], function(ns, LibA, LibB) {
  // This function depends on both LibA and LibB
  this.sayHelloToObject = function(object) {
    return LibA.sayHello(LibB.getObjectName(object, 'Anonymous'));
  };
});

console.log(ns.PetersModule.sayHelloToObject({name : 'Peter'}))

console.log("All tests pass.");


