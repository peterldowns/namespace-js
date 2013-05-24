var Namespace = function() {
  var Namespace = this;

  // Global settings accessible to all objects.
  Namespace.global = {};
  // A helper function for adding multiple settings to the global namespace.
  // Example usage:
  //
  //  > var namespace = new Namespace();
  //  > namespace.updateGlobal({
  //  >   name: 'Peter',
  //  >   age: 19,
  //  >   useful: true})
  //
  //  settings: an object of key => value to set on namespace.global.
  //
  //  overrideProtect: if truthy, will throw an exeption if setting
  //  a key that has already been set.
  Namespace.updateGlobal = function(settings, overrideProtect) {
    var overrideProtect = !!overrideProtect;
    for (var key in settings) {
      if (Object.hasOwnProperty.call(settings, key)) {
        var value = settings[key];
        if (overrideProtect && Namespace.global[key] !== undefined) {
          throw "Already defined: " + key + " => " + Namespace.global[key];
        }
        Namespace.global[key] = value;
      }
    }
  };

  // A helper function for resolving a dotted name, useful for checking
  // properties on nested namespaces or modules. Example usage:
  //
  //  > var namespace = new Namespace();
  //  > if (namespace.get('Math.Trigonometry') {
  //  >   namespace.Math.Trigonomety.cos(2 * Math.PI);
  //  > }
  //
  //  dottedName: a string of dotted paths to resolve.
  //
  //  defaultValue: the value returned if the full resolution fails at any
  //  point. Defaults to undefined.
  Namespace.get = function(dottedName, defaultValue) {
    var names = dottedName.split('.');
    var current = this;
    try {
      for (var i = 0; i < names.length; i++) {
        current = current[names[i]];
        if (current === undefined) {
          return defaultValue;
        }
      }
      return current;
    } catch (exception) {
      return defaultValue;
    }
  };

  // A helper function for determining whether or not a dotted name has been
  // defined. Example usage:
  //
  //  > var namespace = new Namespace();
  //  > namespace.global
  //  {}
  //  > namespace.global.age = 12;
  //  12
  //  > namespace.exists('global.age')
  //  true
  //  > namespace.exists('TestModule')
  //  false
  //  > namespace.define([], 'TestModule', function() {})
  //  > namespace.exists('TestModule')
  //  true
  //
  //  dottedName: a string of dotted paths to resolve.
  Namespace.exists = function(dottedName) {
    return Namespace.get(dottedName, undefined) !== undefined;
  };

  Namespace.require = function(dottedName) {
    var value = Namespace.get(dottedName, undefined);
    if (value === undefined) {
      throw "required value ('" + dottedName + "') not defined";
    }
    return value;
  }

  // A helper function to add modules to the current namespace. For example,
  //
  //  > var namespace = new Namespace();
  //  > namespace.define('Widget.Core', myfunc{...}, [arg1val, arg2val]);
  //
  // will set namespace.Widget.Core to {} if it doesn't exist and run
  //
  //  > myfunc.apply(namespace.Widget.Core, [namespace, arg1val, arg2val]):
  //
  // dottedName: must not begin or end with a '.', and the first part of the
  // must not be 'global', 'updateGlobal', 'require', 'exists', 'define', or
  // 'get'.
  //
  // dependencyNames: a list of dotted names to resolve into dependencies. Each
  // of these is resolved with the `Namespace.require` method; if any of them
  // does not exist an exception will be thrown.
  //
  // moduleDefinition: must be a Function. It must not set any attributes on
  // the Namespace object. The first argument to the definition will be this
  // global Namespace object.
  //
  // moduleArguments: must either be an Array or a falsy value or omitted.
  Namespace.define = function(dottedName, dependencyNames, moduleDefinition) {
    // Resolve dependencies before doing any sort of definition. If any of the
    // dependencies is undefined, throw an error instead of defining the
    // module.
    var dependencies = [];
    dependencyNames = dependencyNames || [];
    for (var i = 0; i < dependencyNames.length; i++) {
      var dependencyName = dependencyNames[i];
      var dependency = Namespace.get(dependencyName, undefined);
      if (dependency === undefined) {
        throw "Dependencies not met: '" + dependencyName + "' not defined";
      }
      dependencies.push(dependency);
    }

    var names = dottedName.split('.');
    // The module name is the last part of the dotted name.
    var moduleName = names.pop();
    // The first argument to every module definition is the global Namespace
    // object. This is followed by any dependencies, then any module arguments.
    dependencies.unshift(Namespace);
    // Define the module in the correct namespace, traversing the dotted names
    // until there are no more.
    var namespace = this;
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      namespace = namespace[name] = namespace[name] || {};
    };
    if (namespace[moduleName]) {
      throw "Cannot define '" + dottedName + "' (already exists)";
    }
    var module = namespace[moduleName] = {};
    moduleDefinition.apply(module, dependencies);
  };
};


// If this is being run in the node context, define our Namespace export.
var exports;
if (exports) {
  exports.Namespace = Namespace;
}
