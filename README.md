readme
======


goals
-----

To scaffold a project using AngularJS, CommonJS style (compiled with [browserify](http://browserify.org)), in which modules are bundled individually and loaded asynchronously.


instructions
------------

`npm install && bower install && grunt dev` - serve the files out of the `dist/` folder. I use [http-server](https://www.npmjs.org/package/http-server).


other thoughts
--------------

Browserify seems like a very elegant way to organize the app.

While this is certainly cool, I'm not sure that it's necessary to lazy load our Angular controller/template code. It comes with certain disadvantages:

1. it breaks a number of the convenience methods of the router, because all we can tell is that a route tree will be loaded, but we don't know the names of the sub-routes in advance.
- there's lag when moving between portions of the app
- it's a solution in search of a problem. Except for the `.config()` and `.run()` blocks of individual modules, code is only executed when its needed (controllers, directives, services, etc)
- we could still lazy-load vendor code that's only used in certain parts of the app
- there are challenges about the interaction between Angular's Dependency Injection when loading modules asynchronously. For example, it's easy to overright modules that have already been registered, which leads to unusual results.
