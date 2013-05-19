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

### `Namespace.get`
TODO(peter)

### `Namespace.require`
TODO(peter)

### `Namespace.exists`
TODO(peter)

### `Namespace.define`
TODO(peter)

# Example Module Definition
TODO(peter)

# Example Helper Definition
TODO(peter)
