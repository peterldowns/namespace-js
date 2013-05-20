# Namespace.js

This is a simple module for defining modules. It is very similar to [CommonJS](http://requirejs.org/docs/commonjs.html),
but differs in the following ways:

* **Not asynchronous**: for now, does not do any asynchronous loading of
  dependencies. Resolution is very simple: if the depdency has already been
  defined on the namespace, then your module will be defined, too. An exception
  will be thrown if this is not the case.
* **Many namespaces**: this file defines a `Namespace` object that should be
  instantiated.  Each instance has its own `define` and `require` methods.
* **Module names required**: does not look at filenames to guess the module
  name — you pass one in when you define a module. Explicit > implicit.
* **Instantiates your module immediately**: `Namespace.js` uses the [`new`
  keyword](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/new)
  to instantiate your module definition. Your definition *is* the export — set
  attributes on `this` to expose them.

# API

Full documentation for each method is available in the source code. I haven't
finished moving those examples to this README.

## `Namespace`
```javascript
> var myNamespace = new Namespace()
```

### `Namespace.global`
Set any variables that you'd like to make available to all modules here. Useful
for global state and shared data. 

```javascript
> var myNamespace = new Namespace()

> myNamespace.global.user = {
    name: 'Peter',
    age: '19',
  };
```

### `Namespace.updateGlobal`
Extend a namespace instance's `.global` with many values at once. The first
argument should be an object with attributes that you'd like to add to
`.global`. Optionally, pass `true` as the second argument to force an error to
be thrown if one of the attribuets is already set.

```javascript
> var myNamespace = new Namespace()

> myNamespace.updateGlobal({
    user : {
      name: 'Peter',
      age: '19',
    },
    csrf : 'w1kA(4F!!gjdk1',
    endpoint : '/user'
  });

> myNamespace.user
{name: 'Peter', age: '19'}

> myNamespace.global.csrf
'w1kA(4F!!gjdk1'

> myNamespace.global.endpoint
'/user'
```

#### Arguments:
* `settings`: a object mapping by which to extend the `Namespace.global` object.
* `overrideProtect`: a boolean. If true, this method will raise an exception
  when attempting to redefine an existing mapping.

### `Namespace.get`
A helper function for resolving a dotted name, useful for checking properties
on nested namespaces or modules. Example usage:

```javascript
> var namespace = new Namespace();

> namespace.get('TestModule');
undefined

> namespace.get('TestModule', 1994);
1994

> if (namespace.get('TestModule.foo.bar')) {
    console.log('TestModule, TestModule.foo, and TestModule.foo.bar are all defined');
  } else {
    console.log('break in the chain');
  }
break in the chain
```

#### Arguments:
* `dottedName`: the dotted name of the dependency to resolve, expressed
  relative to the root `Namespace` object.

### `Namespace.require`
Like `Namespace.get`, but throws an exception if the value does not exist.

```javascript
> var namespace = new Namespace();

> namespace.require('global.TestModuleFlag');
required value ('global.TestModuleFlag') not defined

> namespace.global.testModuleFlag = 1994;

> namespace.require('global.TestModuleFlag');
1994
```

#### Arguments:
* `dottedName`: the dotted name of the dependency to resolve, expressed
  relative to the root `Namespace` object.

### `Namespace.exists`
Returns a boolean describing whether or not a dotted name exists.

```javascript
> var namespace = new Namespace();

> namespace.global.person = {
    age: 19,
    name: 'Peter',
  };

> namespace.exists('global.person.age');
true

> namespace.exists('global.foobar');
false

> namespace.exists('global.person.dne');
false
```

#### Arguments:
* `dottedName`: the dotted name of the dependency to resolve, expressed
  relative to the root `Namespace` object.

### `Namespace.define`
A helper function to add modules to the current namespace. For example,

```javascript
> var namespace = new Namespace();
> namespace.define('Widget.Core',
                   ['dep1', 'dep2'],
                   function constructor() {...},
                   [arg1val, arg2val]);
```

will set `namespace.Widget.Core` to {} if it doesn't already exist and run

```
> constructor.apply(namespace.Widget.Core, [namespace, dep1, dep2, arg1val, arg2val]):
```

#### Arguments:
* `dottedName`: must not begin or end with a '.', and the first part of the
  must not be one of these built-in methods.
* `dependencyNames`: a list of dotted names to resolve into dependencies. Each of these is
  resolved with the `Namespace.require` method; if any of them does not exist an exception
  will be thrown.
* `moduleDefinition`: a function. It must not set any attributes on the
  Namespace object. The first argument to the definition will be this global
  Namespace object.
* `moduleArguments`: must either be an Array or a falsy value or omitted.

# Example Module Definition
TODO(peter)

# Example Helper Definition
TODO(peter)
