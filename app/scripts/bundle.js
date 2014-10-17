(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

/**
 * @ngdoc overview
 * @name angularBrowserfyModuleApp
 * @description
 * # angularBrowserfyModuleApp
 *
 * Main module of the application.
 */

angular.module('angularBrowserfyModuleApp', [
        require('angular-ui-router'),
        require('./common'),
//        require('./apples'),
//        require('./oranges')
    ])
    .config(require('./routes'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./common":3,"./routes":4,"angular-ui-router":5}],2:[function(require,module,exports){
'use strict';

/**
 * @ngdoc directive
 * @name buildium.common.date
 * @description
 *
 * # buildium.common.date
 * Create a div w/ an ISO timestamp
 */

module.exports = function DateDirective () {
    var directive = {};

    directive.restrict = 'E';
    directive.template = '<div>Common: ' + new Date().toISOString() + '</div>';

    return directive;
};

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

/**
 * @ngdoc overview
 * @name creditRetriever.common
 * @description
 *
 * # creditRetriever.common
 * Contains code common across modules
 */
module.exports = angular
    .module('buildium.common', [])
    .directive('bd.date', require('./directives/date'))
    .name;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./directives/date":2}],4:[function(require,module,exports){
'use strict';

/* @ngInject */
module.exports = function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'scripts/common/views/index.html'
        });
};
module.exports.$inject = ["$stateProvider", "$locationProvider"];


},{}],5:[function(require,module,exports){
/**
 * State-based routing for AngularJS
 * @version v0.2.11
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'ui.router';
}

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

var isDefined = angular.isDefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    isObject = angular.isObject,
    isArray = angular.isArray,
    forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy;

function inherit(parent, extra) {
  return extend(new (extend(function() {}, { prototype: parent }))(), extra);
}

function merge(dst) {
  forEach(arguments, function(obj) {
    if (obj !== dst) {
      forEach(obj, function(value, key) {
        if (!dst.hasOwnProperty(key)) dst[key] = value;
      });
    }
  });
  return dst;
}

/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object} first The first state.
 * @param {Object} second The second state.
 * @return {Array} Returns an array of state names in descending order, not including the root.
 */
function ancestors(first, second) {
  var path = [];

  for (var n in first.path) {
    if (first.path[n] !== second.path[n]) break;
    path.push(first.path[n]);
  }
  return path;
}

/**
 * IE8-safe wrapper for `Object.keys()`.
 *
 * @param {Object} object A JavaScript object.
 * @return {Array} Returns the keys of the object as an array.
 */
function objectKeys(object) {
  if (Object.keys) {
    return Object.keys(object);
  }
  var result = [];

  angular.forEach(object, function(val, key) {
    result.push(key);
  });
  return result;
}

/**
 * IE8-safe wrapper for `Array.prototype.indexOf()`.
 *
 * @param {Array} array A JavaScript array.
 * @param {*} value A value to search the array for.
 * @return {Number} Returns the array index value of `value`, or `-1` if not present.
 */
function arraySearch(array, value) {
  if (Array.prototype.indexOf) {
    return array.indexOf(value, Number(arguments[2]) || 0);
  }
  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
  from = (from < 0) ? Math.ceil(from) : Math.floor(from);

  if (from < 0) from += len;

  for (; from < len; from++) {
    if (from in array && array[from] === value) return from;
  }
  return -1;
}

/**
 * Merges a set of parameters with all parameters inherited between the common parents of the
 * current state and a given destination state.
 *
 * @param {Object} currentParams The value of the current state parameters ($stateParams).
 * @param {Object} newParams The set of parameters which will be composited with inherited params.
 * @param {Object} $current Internal definition of object representing the current state.
 * @param {Object} $to Internal definition of object representing state to transition to.
 */
function inheritParams(currentParams, newParams, $current, $to) {
  var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];

  for (var i in parents) {
    if (!parents[i].params) continue;
    parentParams = objectKeys(parents[i].params);
    if (!parentParams.length) continue;

    for (var j in parentParams) {
      if (arraySearch(inheritList, parentParams[j]) >= 0) continue;
      inheritList.push(parentParams[j]);
      inherited[parentParams[j]] = currentParams[parentParams[j]];
    }
  }
  return extend({}, inherited, newParams);
}

/**
 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
 *
 * @param {Object} a The first object.
 * @param {Object} b The second object.
 * @param {Array} keys The list of keys within each object to compare. If the list is empty or not specified,
 *                     it defaults to the list of keys in `a`.
 * @return {Boolean} Returns `true` if the keys match, otherwise `false`.
 */
function equalForKeys(a, b, keys) {
  if (!keys) {
    keys = [];
    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
  }

  for (var i=0; i<keys.length; i++) {
    var k = keys[i];
    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
  }
  return true;
}

/**
 * Returns the subset of an object, based on a list of keys.
 *
 * @param {Array} keys
 * @param {Object} values
 * @return {Boolean} Returns a subset of `values`.
 */
function filterByKeys(keys, values) {
  var filtered = {};

  forEach(keys, function (name) {
    filtered[name] = values[name];
  });
  return filtered;
}
/**
 * @ngdoc overview
 * @name ui.router.util
 *
 * @description
 * # ui.router.util sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 *
 */
angular.module('ui.router.util', ['ng']);

/**
 * @ngdoc overview
 * @name ui.router.router
 * 
 * @requires ui.router.util
 *
 * @description
 * # ui.router.router sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 */
angular.module('ui.router.router', ['ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router.state
 * 
 * @requires ui.router.router
 * @requires ui.router.util
 *
 * @description
 * # ui.router.state sub-module
 *
 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 * 
 */
angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router
 *
 * @requires ui.router.state
 *
 * @description
 * # ui.router
 * 
 * ## The main module for ui.router 
 * There are several sub-modules included with the ui.router module, however only this module is needed
 * as a dependency within your angular app. The other modules are for organization purposes. 
 *
 * The modules are:
 * * ui.router - the main "umbrella" module
 * * ui.router.router - 
 * 
 * *You'll need to include **only** this module as the dependency within your angular app.*
 * 
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the ui-router script -->
 *   <script src="js/angular-ui-router.min.js"></script>
 *   <script>
 *     // ...and add 'ui.router' as a dependency
 *     var myApp = angular.module('myApp', ['ui.router']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('ui.router', ['ui.router.state']);

angular.module('ui.router.compat', ['ui.router']);

/**
 * @ngdoc object
 * @name ui.router.util.$resolve
 *
 * @requires $q
 * @requires $injector
 *
 * @description
 * Manages resolution of (acyclic) graphs of promises.
 */
$Resolve.$inject = ['$q', '$injector'];
function $Resolve(  $q,    $injector) {
  
  var VISIT_IN_PROGRESS = 1,
      VISIT_DONE = 2,
      NOTHING = {},
      NO_DEPENDENCIES = [],
      NO_LOCALS = NOTHING,
      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING });
  

  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#study
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Studies a set of invocables that are likely to be used multiple times.
   * <pre>
   * $resolve.study(invocables)(locals, parent, self)
   * </pre>
   * is equivalent to
   * <pre>
   * $resolve.resolve(invocables, locals, parent, self)
   * </pre>
   * but the former is more efficient (in fact `resolve` just calls `study` 
   * internally).
   *
   * @param {object} invocables Invocable objects
   * @return {function} a function to pass in locals, parent and self
   */
  this.study = function (invocables) {
    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
    
    // Perform a topological sort of invocables to build an ordered plan
    var plan = [], cycle = [], visited = {};
    function visit(value, key) {
      if (visited[key] === VISIT_DONE) return;
      
      cycle.push(key);
      if (visited[key] === VISIT_IN_PROGRESS) {
        cycle.splice(0, cycle.indexOf(key));
        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
      }
      visited[key] = VISIT_IN_PROGRESS;
      
      if (isString(value)) {
        plan.push(key, [ function() { return $injector.get(value); }], NO_DEPENDENCIES);
      } else {
        var params = $injector.annotate(value);
        forEach(params, function (param) {
          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
        });
        plan.push(key, value, params);
      }
      
      cycle.pop();
      visited[key] = VISIT_DONE;
    }
    forEach(invocables, visit);
    invocables = cycle = visited = null; // plan is all that's required
    
    function isResolve(value) {
      return isObject(value) && value.then && value.$$promises;
    }
    
    return function (locals, parent, self) {
      if (isResolve(locals) && self === undefined) {
        self = parent; parent = locals; locals = null;
      }
      if (!locals) locals = NO_LOCALS;
      else if (!isObject(locals)) {
        throw new Error("'locals' must be an object");
      }       
      if (!parent) parent = NO_PARENT;
      else if (!isResolve(parent)) {
        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
      }
      
      // To complete the overall resolution, we have to wait for the parent
      // promise and for the promise for each invokable in our plan.
      var resolution = $q.defer(),
          result = resolution.promise,
          promises = result.$$promises = {},
          values = extend({}, locals),
          wait = 1 + plan.length/3,
          merged = false;
          
      function done() {
        // Merge parent values we haven't got yet and publish our own $$values
        if (!--wait) {
          if (!merged) merge(values, parent.$$values); 
          result.$$values = values;
          result.$$promises = true; // keep for isResolve()
          delete result.$$inheritedValues;
          resolution.resolve(values);
        }
      }
      
      function fail(reason) {
        result.$$failure = reason;
        resolution.reject(reason);
      }
      
      // Short-circuit if parent has already failed
      if (isDefined(parent.$$failure)) {
        fail(parent.$$failure);
        return result;
      }
      
      if (parent.$$inheritedValues) {
        merge(values, parent.$$inheritedValues);
      }

      // Merge parent values if the parent has already resolved, or merge
      // parent promises and wait if the parent resolve is still in progress.
      if (parent.$$values) {
        merged = merge(values, parent.$$values);
        result.$$inheritedValues = parent.$$values;
        done();
      } else {
        if (parent.$$inheritedValues) {
          result.$$inheritedValues = parent.$$inheritedValues;
        }        
        extend(promises, parent.$$promises);
        parent.then(done, fail);
      }
      
      // Process each invocable in the plan, but ignore any where a local of the same name exists.
      for (var i=0, ii=plan.length; i<ii; i+=3) {
        if (locals.hasOwnProperty(plan[i])) done();
        else invoke(plan[i], plan[i+1], plan[i+2]);
      }
      
      function invoke(key, invocable, params) {
        // Create a deferred for this invocation. Failures will propagate to the resolution as well.
        var invocation = $q.defer(), waitParams = 0;
        function onfailure(reason) {
          invocation.reject(reason);
          fail(reason);
        }
        // Wait for any parameter that we have a promise for (either from parent or from this
        // resolve; in that case study() will have made sure it's ordered before us in the plan).
        forEach(params, function (dep) {
          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
            waitParams++;
            promises[dep].then(function (result) {
              values[dep] = result;
              if (!(--waitParams)) proceed();
            }, onfailure);
          }
        });
        if (!waitParams) proceed();
        function proceed() {
          if (isDefined(result.$$failure)) return;
          try {
            invocation.resolve($injector.invoke(invocable, self, values));
            invocation.promise.then(function (result) {
              values[key] = result;
              done();
            }, onfailure);
          } catch (e) {
            onfailure(e);
          }
        }
        // Publish promise synchronously; invocations further down in the plan may depend on it.
        promises[key] = invocation.promise;
      }
      
      return result;
    };
  };
  
  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#resolve
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Resolves a set of invocables. An invocable is a function to be invoked via 
   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
   * An invocable can either return a value directly,
   * or a `$q` promise. If a promise is returned it will be resolved and the 
   * resulting value will be used instead. Dependencies of invocables are resolved 
   * (in this order of precedence)
   *
   * - from the specified `locals`
   * - from another invocable that is part of this `$resolve` call
   * - from an invocable that is inherited from a `parent` call to `$resolve` 
   *   (or recursively
   * - from any ancestor `$resolve` of that parent).
   *
   * The return value of `$resolve` is a promise for an object that contains 
   * (in this order of precedence)
   *
   * - any `locals` (if specified)
   * - the resolved return values of all injectables
   * - any values inherited from a `parent` call to `$resolve` (if specified)
   *
   * The promise will resolve after the `parent` promise (if any) and all promises 
   * returned by injectables have been resolved. If any invocable 
   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
   * same error. A rejection of a `parent` promise (if specified) will likewise be 
   * propagated immediately. Once the `$resolve` promise has been rejected, no 
   * further invocables will be called.
   * 
   * Cyclic dependencies between invocables are not permitted and will caues `$resolve`
   * to throw an error. As a special case, an injectable can depend on a parameter 
   * with the same name as the injectable, which will be fulfilled from the `parent` 
   * injectable of the same name. This allows inherited values to be decorated. 
   * Note that in this case any other injectable in the same `$resolve` with the same
   * dependency would see the decorated value, not the inherited value.
   *
   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
   * exception.
   *
   * Invocables are invoked eagerly as soon as all dependencies are available. 
   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
   *
   * As a special case, an invocable can be a string, in which case it is taken to 
   * be a service name to be passed to `$injector.get()`. This is supported primarily 
   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
   * routes.
   *
   * @param {object} invocables functions to invoke or 
   * `$injector` services to fetch.
   * @param {object} locals  values to make available to the injectables
   * @param {object} parent  a promise returned by another call to `$resolve`.
   * @param {object} self  the `this` for the invoked methods
   * @return {object} Promise for an object that contains the resolved return value
   * of all invocables, as well as any inherited and local values.
   */
  this.resolve = function (invocables, locals, parent, self) {
    return this.study(invocables)(locals, parent, self);
  };
}

angular.module('ui.router.util').service('$resolve', $Resolve);


/**
 * @ngdoc object
 * @name ui.router.util.$templateFactory
 *
 * @requires $http
 * @requires $templateCache
 * @requires $injector
 *
 * @description
 * Service. Manages loading of templates.
 */
$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
function $TemplateFactory(  $http,   $templateCache,   $injector) {

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromConfig
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a configuration object. 
   *
   * @param {object} config Configuration object for which to load a template. 
   * The following properties are search in the specified order, and the first one 
   * that is defined is used to create the template:
   *
   * @param {string|object} config.template html string template or function to 
   * load via {@link ui.router.util.$templateFactory#fromString fromString}.
   * @param {string|object} config.templateUrl url to load or a function returning 
   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl}.
   * @param {Function} config.templateProvider function to invoke via 
   * {@link ui.router.util.$templateFactory#fromProvider fromProvider}.
   * @param {object} params  Parameters to pass to the template function.
   * @param {object} locals Locals to pass to `invoke` if the template is loaded 
   * via a `templateProvider`. Defaults to `{ params: params }`.
   *
   * @return {string|object}  The template html as a string, or a promise for 
   * that string,or `null` if no template is configured.
   */
  this.fromConfig = function (config, params, locals) {
    return (
      isDefined(config.template) ? this.fromString(config.template, params) :
      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
      null
    );
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromString
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a string or a function returning a string.
   *
   * @param {string|object} template html template as a string or function that 
   * returns an html template as a string.
   * @param {object} params Parameters to pass to the template function.
   *
   * @return {string|object} The template html as a string, or a promise for that 
   * string.
   */
  this.fromString = function (template, params) {
    return isFunction(template) ? template(params) : template;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   * 
   * @description
   * Loads a template from the a URL via `$http` and `$templateCache`.
   *
   * @param {string|Function} url url of the template to load, or a function 
   * that returns a url.
   * @param {Object} params Parameters to pass to the url function.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromUrl = function (url, params) {
    if (isFunction(url)) url = url(params);
    if (url == null) return null;
    else return $http
        .get(url, { cache: $templateCache })
        .then(function(response) { return response.data; });
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromProvider
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template by invoking an injectable provider function.
   *
   * @param {Function} provider Function to invoke via `$injector.invoke`
   * @param {Object} params Parameters for the template.
   * @param {Object} locals Locals to pass to `invoke`. Defaults to 
   * `{ params: params }`.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromProvider = function (provider, params, locals) {
    return $injector.invoke(provider, null, locals || { params: params });
  };
}

angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);

/**
 * @ngdoc object
 * @name ui.router.util.type:UrlMatcher
 *
 * @description
 * Matches URLs against patterns and extracts named parameters from the path or the search
 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
 * do not influence whether or not a URL is matched, but their values are passed through into
 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec}.
 * 
 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
 * syntax, which optionally allows a regular expression for the parameter to be specified:
 *
 * * `':'` name - colon placeholder
 * * `'*'` name - catch-all placeholder
 * * `'{' name '}'` - curly placeholder
 * * `'{' name ':' regexp '}'` - curly placeholder with regexp. Should the regexp itself contain
 *   curly braces, they must be in matched pairs or escaped with a backslash.
 *
 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
 * must be unique within the pattern (across both path and search parameters). For colon 
 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
 * number of characters other than '/'. For catch-all placeholders the path parameter matches
 * any number of characters.
 * 
 * Examples:
 * 
 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
 * * `'/user/{id:[^/]*}'` - Same as the previous example.
 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
 *   parameter consists of 1 to 8 hex digits.
 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
 *   path into the parameter 'path'.
 * * `'/files/*path'` - ditto.
 *
 * @param {string} pattern  The pattern to compile into a matcher.
 * @param {Object} config  A configuration object hash:
 *
 * * `caseInsensitive` - `true` if URL matching should be case insensitive, otherwise `false`, the default value (for backward compatibility) is `false`.
 * * `strict` - `false` if matching against a URL with a trailing slash should be treated as equivalent to a URL without a trailing slash, the default value is `true`.
 *
 * @property {string} prefix  A static prefix of this pattern. The matcher guarantees that any
 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()} returns
 *   non-null) will start with this prefix.
 *
 * @property {string} source  The pattern that was passed into the constructor
 *
 * @property {string} sourcePath  The path portion of the source property
 *
 * @property {string} sourceSearch  The search portion of the source property
 *
 * @property {string} regex  The constructed regex that will be used to match against the url when 
 *   it is time to determine which url will match.
 *
 * @returns {Object}  New `UrlMatcher` object
 */
function UrlMatcher(pattern, config) {
  config = angular.isObject(config) ? config : {};

  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
  //   '*' name
  //   ':' name
  //   '{' name '}'
  //   '{' name ':' regexp '}'
  // The regular expression is somewhat complicated due to the need to allow curly braces
  // inside the regular expression. The placeholder regexp breaks down as follows:
  //    ([:*])(\w+)               classic placeholder ($1 / $2)
  //    \{(\w+)(?:\:( ... ))?\}   curly brace placeholder ($3) with optional regexp ... ($4)
  //    (?: ... | ... | ... )+    the regexp consists of any number of atoms, an atom being either
  //    [^{}\\]+                  - anything other than curly braces or backslash
  //    \\.                       - a backslash escape
  //    \{(?:[^{}\\]+|\\.)*\}     - a matched set of curly braces containing other atoms
  var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      compiled = '^', last = 0, m,
      segments = this.segments = [],
      params = this.params = {};

  /**
   * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
   * default value, which may be the result of an injectable function.
   */
  function $value(value) {
    /*jshint validthis: true */
    return isDefined(value) ? this.type.decode(value) : $UrlMatcherFactory.$$getDefaultValue(this);
  }

  function addParameter(id, type, config) {
    if (!/^\w+(-+\w+)*$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
    if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
    params[id] = extend({ type: type || new Type(), $value: $value }, config);
  }

  function quoteRegExp(string, pattern, isOptional) {
    var result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
    if (!pattern) return result;
    var flag = isOptional ? '?' : '';
    return result + flag + '(' + pattern + ')' + flag;
  }

  function paramConfig(param) {
    if (!config.params || !config.params[param]) return {};
    var cfg = config.params[param];
    return isObject(cfg) ? cfg : { value: cfg };
  }

  this.source = pattern;

  // Split into static segments separated by path parameter placeholders.
  // The number of segments is always 1 more than the number of parameters.
  var id, regexp, segment, type, cfg;

  while ((m = placeholder.exec(pattern))) {
    id      = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
    regexp  = m[4] || (m[1] == '*' ? '.*' : '[^/]*');
    segment = pattern.substring(last, m.index);
    type    = this.$types[regexp] || new Type({ pattern: new RegExp(regexp) });
    cfg     = paramConfig(id);

    if (segment.indexOf('?') >= 0) break; // we're into the search part

    compiled += quoteRegExp(segment, type.$subPattern(), isDefined(cfg.value));
    addParameter(id, type, cfg);
    segments.push(segment);
    last = placeholder.lastIndex;
  }
  segment = pattern.substring(last);

  // Find any search parameter names and remove them from the last segment
  var i = segment.indexOf('?');

  if (i >= 0) {
    var search = this.sourceSearch = segment.substring(i);
    segment = segment.substring(0, i);
    this.sourcePath = pattern.substring(0, last + i);

    // Allow parameters to be separated by '?' as well as '&' to make concat() easier
    forEach(search.substring(1).split(/[&?]/), function(key) {
      addParameter(key, null, paramConfig(key));
    });
  } else {
    this.sourcePath = pattern;
    this.sourceSearch = '';
  }

  compiled += quoteRegExp(segment) + (config.strict === false ? '\/?' : '') + '$';
  segments.push(segment);

  this.regexp = new RegExp(compiled, config.caseInsensitive ? 'i' : undefined);
  this.prefix = segments[0];
}

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#concat
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns a new matcher for a pattern constructed by appending the path part and adding the
 * search parameters of the specified pattern to this pattern. The current pattern is not
 * modified. This can be understood as creating a pattern for URLs that are relative to (or
 * suffixes of) the current pattern.
 *
 * @example
 * The following two matchers are equivalent:
 * <pre>
 * new UrlMatcher('/user/{id}?q').concat('/details?date');
 * new UrlMatcher('/user/{id}/details?q&date');
 * </pre>
 *
 * @param {string} pattern  The pattern to append.
 * @param {Object} config  An object hash of the configuration for the matcher.
 * @returns {UrlMatcher}  A matcher for the concatenated pattern.
 */
UrlMatcher.prototype.concat = function (pattern, config) {
  // Because order of search parameters is irrelevant, we can add our own search
  // parameters to the end of the new pattern. Parse the new pattern by itself
  // and then join the bits together, but it's much easier to do this on a string level.
  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, config);
};

UrlMatcher.prototype.toString = function () {
  return this.source;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#exec
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Tests the specified path against this matcher, and returns an object containing the captured
 * parameter values, or null if the path does not match. The returned object contains the values
 * of any search parameters that are mentioned in the pattern, but their value may be null if
 * they are not present in `searchParams`. This means that search parameters are always treated
 * as optional.
 *
 * @example
 * <pre>
 * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
 *   x: '1', q: 'hello'
 * });
 * // returns { id: 'bob', q: 'hello', r: null }
 * </pre>
 *
 * @param {string} path  The URL path to match, e.g. `$location.path()`.
 * @param {Object} searchParams  URL search parameters, e.g. `$location.search()`.
 * @returns {Object}  The captured parameter values.
 */
UrlMatcher.prototype.exec = function (path, searchParams) {
  var m = this.regexp.exec(path);
  if (!m) return null;
  searchParams = searchParams || {};

  var params = this.parameters(), nTotal = params.length,
    nPath = this.segments.length - 1,
    values = {}, i, cfg, param;

  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");

  for (i = 0; i < nPath; i++) {
    param = params[i];
    cfg = this.params[param];
    values[param] = cfg.$value(m[i + 1]);
  }
  for (/**/; i < nTotal; i++) {
    param = params[i];
    cfg = this.params[param];
    values[param] = cfg.$value(searchParams[param]);
  }

  return values;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#parameters
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns the names of all path and search parameters of this pattern in an unspecified order.
 * 
 * @returns {Array.<string>}  An array of parameter names. Must be treated as read-only. If the
 *    pattern has no parameters, an empty array is returned.
 */
UrlMatcher.prototype.parameters = function (param) {
  if (!isDefined(param)) return objectKeys(this.params);
  return this.params[param] || null;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#validate
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Checks an object hash of parameters to validate their correctness according to the parameter
 * types of this `UrlMatcher`.
 *
 * @param {Object} params The object hash of parameters to validate.
 * @returns {boolean} Returns `true` if `params` validates, otherwise `false`.
 */
UrlMatcher.prototype.validates = function (params) {
  var result = true, isOptional, cfg, self = this;

  forEach(params, function(val, key) {
    if (!self.params[key]) return;
    cfg = self.params[key];
    isOptional = !val && isDefined(cfg.value);
    result = result && (isOptional || cfg.type.is(val));
  });
  return result;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#format
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Creates a URL that matches this pattern by substituting the specified values
 * for the path and search parameters. Null values for path parameters are
 * treated as empty strings.
 *
 * @example
 * <pre>
 * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
 * // returns '/user/bob?q=yes'
 * </pre>
 *
 * @param {Object} values  the values to substitute for the parameters in this pattern.
 * @returns {string}  the formatted URL (path and optionally search part).
 */
UrlMatcher.prototype.format = function (values) {
  var segments = this.segments, params = this.parameters();

  if (!values) return segments.join('').replace('//', '/');

  var nPath = segments.length - 1, nTotal = params.length,
    result = segments[0], i, search, value, param, cfg, array;

  if (!this.validates(values)) return null;

  for (i = 0; i < nPath; i++) {
    param = params[i];
    value = values[param];
    cfg   = this.params[param];

    if (!isDefined(value) && (segments[i] === '/' || segments[i + 1] === '/')) continue;
    if (value != null) result += encodeURIComponent(cfg.type.encode(value));
    result += segments[i + 1];
  }

  for (/**/; i < nTotal; i++) {
    param = params[i];
    value = values[param];
    if (value == null) continue;
    array = isArray(value);

    if (array) {
      value = value.map(encodeURIComponent).join('&' + param + '=');
    }
    result += (search ? '&' : '?') + param + '=' + (array ? value : encodeURIComponent(value));
    search = true;
  }
  return result;
};

UrlMatcher.prototype.$types = {};

/**
 * @ngdoc object
 * @name ui.router.util.type:Type
 *
 * @description
 * Implements an interface to define custom parameter types that can be decoded from and encoded to
 * string parameters matched in a URL. Used by {@link ui.router.util.type:UrlMatcher `UrlMatcher`}
 * objects when matching or formatting URLs, or comparing or validating parameter values.
 *
 * See {@link ui.router.util.$urlMatcherFactory#methods_type `$urlMatcherFactory#type()`} for more
 * information on registering custom types.
 *
 * @param {Object} config  A configuration object hash that includes any method in `Type`'s public
 *        interface, and/or `pattern`, which should contain a custom regular expression used to match
 *        string parameters originating from a URL.
 *
 * @property {RegExp} pattern The regular expression pattern used to match values of this type when
 *           coming from a substring of a URL.
 *
 * @returns {Object}  Returns a new `Type` object.
 */
function Type(config) {
  extend(this, config);
}

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#is
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Detects whether a value is of a particular type. Accepts a native (decoded) value
 * and determines whether it matches the current `Type` object.
 *
 * @param {*} val  The value to check.
 * @param {string} key  Optional. If the type check is happening in the context of a specific
 *        {@link ui.router.util.type:UrlMatcher `UrlMatcher`} object, this is the name of the
 *        parameter in which `val` is stored. Can be used for meta-programming of `Type` objects.
 * @returns {Boolean}  Returns `true` if the value matches the type, otherwise `false`.
 */
Type.prototype.is = function(val, key) {
  return true;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#encode
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Encodes a custom/native type value to a string that can be embedded in a URL. Note that the
 * return value does *not* need to be URL-safe (i.e. passed through `encodeURIComponent()`), it
 * only needs to be a representation of `val` that has been coerced to a string.
 *
 * @param {*} val  The value to encode.
 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
 *        meta-programming of `Type` objects.
 * @returns {string}  Returns a string representation of `val` that can be encoded in a URL.
 */
Type.prototype.encode = function(val, key) {
  return val;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#decode
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Converts a string URL parameter value to a custom/native value.
 *
 * @param {string} val  The URL parameter value to decode.
 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
 *        meta-programming of `Type` objects.
 * @returns {*}  Returns a custom representation of the URL parameter value.
 */
Type.prototype.decode = function(val, key) {
  return val;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#equals
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Determines whether two decoded values are equivalent.
 *
 * @param {*} a  A value to compare against.
 * @param {*} b  A value to compare against.
 * @returns {Boolean}  Returns `true` if the values are equivalent/equal, otherwise `false`.
 */
Type.prototype.equals = function(a, b) {
  return a == b;
};

Type.prototype.$subPattern = function() {
  var sub = this.pattern.toString();
  return sub.substr(1, sub.length - 2);
};

Type.prototype.pattern = /.*/;

/**
 * @ngdoc object
 * @name ui.router.util.$urlMatcherFactory
 *
 * @description
 * Factory for {@link ui.router.util.type:UrlMatcher `UrlMatcher`} instances. The factory
 * is also available to providers under the name `$urlMatcherFactoryProvider`.
 */
function $UrlMatcherFactory() {

  var isCaseInsensitive = false, isStrictMode = true;

  var enqueue = true, typeQueue = [], injector, defaultTypes = {
    int: {
      decode: function(val) {
        return parseInt(val, 10);
      },
      is: function(val) {
        if (!isDefined(val)) return false;
        return this.decode(val.toString()) === val;
      },
      pattern: /\d+/
    },
    bool: {
      encode: function(val) {
        return val ? 1 : 0;
      },
      decode: function(val) {
        return parseInt(val, 10) === 0 ? false : true;
      },
      is: function(val) {
        return val === true || val === false;
      },
      pattern: /0|1/
    },
    string: {
      pattern: /[^\/]*/
    },
    date: {
      equals: function (a, b) {
        return a.toISOString() === b.toISOString();
      },
      decode: function (val) {
        return new Date(val);
      },
      encode: function (val) {
        return [
          val.getFullYear(),
          ('0' + (val.getMonth() + 1)).slice(-2),
          ('0' + val.getDate()).slice(-2)
        ].join("-");
      },
      pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/
    }
  };

  function getDefaultConfig() {
    return {
      strict: isStrictMode,
      caseInsensitive: isCaseInsensitive
    };
  }

  function isInjectable(value) {
    return (isFunction(value) || (isArray(value) && isFunction(value[value.length - 1])));
  }

  /**
   * [Internal] Get the default value of a parameter, which may be an injectable function.
   */
  $UrlMatcherFactory.$$getDefaultValue = function(config) {
    if (!isInjectable(config.value)) return config.value;
    if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
    return injector.invoke(config.value);
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#caseInsensitive
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Defines whether URL matching should be case sensitive (the default behavior), or not.
   *
   * @param {boolean} value `false` to match URL in a case sensitive manner; otherwise `true`;
   */
  this.caseInsensitive = function(value) {
    isCaseInsensitive = value;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#strictMode
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Defines whether URLs should match trailing slashes, or not (the default behavior).
   *
   * @param {boolean} value `false` to match trailing slashes in URLs, otherwise `true`.
   */
  this.strictMode = function(value) {
    isStrictMode = value;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#compile
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Creates a {@link ui.router.util.type:UrlMatcher `UrlMatcher`} for the specified pattern.
   *   
   * @param {string} pattern  The URL pattern.
   * @param {Object} config  The config object hash.
   * @returns {UrlMatcher}  The UrlMatcher.
   */
  this.compile = function (pattern, config) {
    return new UrlMatcher(pattern, extend(getDefaultConfig(), config));
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#isMatcher
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Returns true if the specified object is a `UrlMatcher`, or false otherwise.
   *
   * @param {Object} object  The object to perform the type check against.
   * @returns {Boolean}  Returns `true` if the object matches the `UrlMatcher` interface, by
   *          implementing all the same methods.
   */
  this.isMatcher = function (o) {
    if (!isObject(o)) return false;
    var result = true;

    forEach(UrlMatcher.prototype, function(val, name) {
      if (isFunction(val)) {
        result = result && (isDefined(o[name]) && isFunction(o[name]));
      }
    });
    return result;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#type
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Registers a custom {@link ui.router.util.type:Type `Type`} object that can be used to
   * generate URLs with typed parameters.
   *
   * @param {string} name  The type name.
   * @param {Object|Function} def  The type definition. See
   *        {@link ui.router.util.type:Type `Type`} for information on the values accepted.
   *
   * @returns {Object}  Returns `$urlMatcherFactoryProvider`.
   *
   * @example
   * This is a simple example of a custom type that encodes and decodes items from an
   * array, using the array index as the URL-encoded value:
   *
   * <pre>
   * var list = ['John', 'Paul', 'George', 'Ringo'];
   *
   * $urlMatcherFactoryProvider.type('listItem', {
   *   encode: function(item) {
   *     // Represent the list item in the URL using its corresponding index
   *     return list.indexOf(item);
   *   },
   *   decode: function(item) {
   *     // Look up the list item by index
   *     return list[parseInt(item, 10)];
   *   },
   *   is: function(item) {
   *     // Ensure the item is valid by checking to see that it appears
   *     // in the list
   *     return list.indexOf(item) > -1;
   *   }
   * });
   *
   * $stateProvider.state('list', {
   *   url: "/list/{item:listItem}",
   *   controller: function($scope, $stateParams) {
   *     console.log($stateParams.item);
   *   }
   * });
   *
   * // ...
   *
   * // Changes URL to '/list/3', logs "Ringo" to the console
   * $state.go('list', { item: "Ringo" });
   * </pre>
   *
   * This is a more complex example of a type that relies on dependency injection to
   * interact with services, and uses the parameter name from the URL to infer how to
   * handle encoding and decoding parameter values:
   *
   * <pre>
   * // Defines a custom type that gets a value from a service,
   * // where each service gets different types of values from
   * // a backend API:
   * $urlMatcherFactoryProvider.type('dbObject', function(Users, Posts) {
   *
   *   // Matches up services to URL parameter names
   *   var services = {
   *     user: Users,
   *     post: Posts
   *   };
   *
   *   return {
   *     encode: function(object) {
   *       // Represent the object in the URL using its unique ID
   *       return object.id;
   *     },
   *     decode: function(value, key) {
   *       // Look up the object by ID, using the parameter
   *       // name (key) to call the correct service
   *       return services[key].findById(value);
   *     },
   *     is: function(object, key) {
   *       // Check that object is a valid dbObject
   *       return angular.isObject(object) && object.id && services[key];
   *     }
   *     equals: function(a, b) {
   *       // Check the equality of decoded objects by comparing
   *       // their unique IDs
   *       return a.id === b.id;
   *     }
   *   };
   * });
   *
   * // In a config() block, you can then attach URLs with
   * // type-annotated parameters:
   * $stateProvider.state('users', {
   *   url: "/users",
   *   // ...
   * }).state('users.item', {
   *   url: "/{user:dbObject}",
   *   controller: function($scope, $stateParams) {
   *     // $stateParams.user will now be an object returned from
   *     // the Users service
   *   },
   *   // ...
   * });
   * </pre>
   */
  this.type = function (name, def) {
    if (!isDefined(def)) return UrlMatcher.prototype.$types[name];
    typeQueue.push({ name: name, def: def });
    if (!enqueue) flushTypeQueue();
    return this;
  };

  /* No need to document $get, since it returns this */
  this.$get = ['$injector', function ($injector) {
    injector = $injector;
    enqueue = false;
    UrlMatcher.prototype.$types = {};
    flushTypeQueue();

    forEach(defaultTypes, function(type, name) {
      if (!UrlMatcher.prototype.$types[name]) UrlMatcher.prototype.$types[name] = new Type(type);
    });
    return this;
  }];

  // To ensure proper order of operations in object configuration, and to allow internal
  // types to be overridden, `flushTypeQueue()` waits until `$urlMatcherFactory` is injected
  // before actually wiring up and assigning type definitions
  function flushTypeQueue() {
    forEach(typeQueue, function(type) {
      if (UrlMatcher.prototype.$types[type.name]) {
        throw new Error("A type named '" + type.name + "' has already been defined.");
      }
      var def = new Type(isInjectable(type.def) ? injector.invoke(type.def) : type.def);
      UrlMatcher.prototype.$types[type.name] = def;
    });
  }
}

// Register as a provider so it's available to other providers
angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);

/**
 * @ngdoc object
 * @name ui.router.router.$urlRouterProvider
 *
 * @requires ui.router.util.$urlMatcherFactoryProvider
 * @requires $locationProvider
 *
 * @description
 * `$urlRouterProvider` has the responsibility of watching `$location`. 
 * When `$location` changes it runs through a list of rules one by one until a 
 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
 *
 * There are several methods on `$urlRouterProvider` that make it useful to use directly
 * in your module config.
 */
$UrlRouterProvider.$inject = ['$locationProvider', '$urlMatcherFactoryProvider'];
function $UrlRouterProvider(   $locationProvider,   $urlMatcherFactory) {
  var rules = [], otherwise = null, interceptDeferred = false, listener;

  // Returns a string that is a prefix of all strings matching the RegExp
  function regExpPrefix(re) {
    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
  }

  // Interpolates matched values into a String.replace()-style pattern
  function interpolate(pattern, match) {
    return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
      return match[what === '$' ? 0 : Number(what)];
    });
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#rule
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines rules that are used by `$urlRouterProvider` to find matches for
   * specific URLs.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // Here's an example of how you might allow case insensitive urls
   *   $urlRouterProvider.rule(function ($injector, $location) {
   *     var path = $location.path(),
   *         normalized = path.toLowerCase();
   *
   *     if (path !== normalized) {
   *       return normalized;
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {object} rule Handler function that takes `$injector` and `$location`
   * services as arguments. You can use them to return a valid path as a string.
   *
   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
   */
  this.rule = function (rule) {
    if (!isFunction(rule)) throw new Error("'rule' must be a function");
    rules.push(rule);
    return this;
  };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouterProvider#otherwise
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines a path that is used when an invalid route is requested.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // if the path doesn't match any of the urls you configured
   *   // otherwise will take care of routing the user to the
   *   // specified url
   *   $urlRouterProvider.otherwise('/index');
   *
   *   // Example of using function rule as param
   *   $urlRouterProvider.otherwise(function ($injector, $location) {
   *     return '/a/valid/url';
   *   });
   * });
   * </pre>
   *
   * @param {string|object} rule The url path you want to redirect to or a function 
   * rule that returns the url path. The function version is passed two params: 
   * `$injector` and `$location` services, and must return a url string.
   *
   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
   */
  this.otherwise = function (rule) {
    if (isString(rule)) {
      var redirect = rule;
      rule = function () { return redirect; };
    }
    else if (!isFunction(rule)) throw new Error("'rule' must be a function");
    otherwise = rule;
    return this;
  };


  function handleIfMatch($injector, handler, match) {
    if (!match) return false;
    var result = $injector.invoke(handler, handler, { $match: match });
    return isDefined(result) ? result : true;
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#when
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Registers a handler for a given url matching. if handle is a string, it is
   * treated as a redirect, and is interpolated according to the syntax of match
   * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
   *
   * If the handler is a function, it is injectable. It gets invoked if `$location`
   * matches. You have the option of inject the match object as `$match`.
   *
   * The handler can return
   *
   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
   *   will continue trying to find another one that matches.
   * - **string** which is treated as a redirect and passed to `$location.url()`
   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
   *     if ($state.$current.navigable !== state ||
   *         !equalForKeys($match, $stateParams) {
   *      $state.transitionTo(state, $match, false);
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {string|object} what The incoming path that you want to redirect.
   * @param {string|object} handler The path you want to redirect your user to.
   */
  this.when = function (what, handler) {
    var redirect, handlerIsString = isString(handler);
    if (isString(what)) what = $urlMatcherFactory.compile(what);

    if (!handlerIsString && !isFunction(handler) && !isArray(handler))
      throw new Error("invalid 'handler' in when()");

    var strategies = {
      matcher: function (what, handler) {
        if (handlerIsString) {
          redirect = $urlMatcherFactory.compile(handler);
          handler = ['$match', function ($match) { return redirect.format($match); }];
        }
        return extend(function ($injector, $location) {
          return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
        }, {
          prefix: isString(what.prefix) ? what.prefix : ''
        });
      },
      regex: function (what, handler) {
        if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");

        if (handlerIsString) {
          redirect = handler;
          handler = ['$match', function ($match) { return interpolate(redirect, $match); }];
        }
        return extend(function ($injector, $location) {
          return handleIfMatch($injector, handler, what.exec($location.path()));
        }, {
          prefix: regExpPrefix(what)
        });
      }
    };

    var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp };

    for (var n in check) {
      if (check[n]) return this.rule(strategies[n](what, handler));
    }

    throw new Error("invalid 'what' in when()");
  };

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#deferIntercept
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Disables (or enables) deferring location change interception.
   *
   * If you wish to customize the behavior of syncing the URL (for example, if you wish to
   * defer a transition but maintain the current URL), call this method at configuration time.
   * Then, at run time, call `$urlRouter.listen()` after you have configured your own
   * `$locationChangeSuccess` event handler.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *
   *   // Prevent $urlRouter from automatically intercepting URL changes;
   *   // this allows you to configure custom behavior in between
   *   // location changes and route synchronization:
   *   $urlRouterProvider.deferIntercept();
   *
   * }).run(function ($rootScope, $urlRouter, UserService) {
   *
   *   $rootScope.$on('$locationChangeSuccess', function(e) {
   *     // UserService is an example service for managing user state
   *     if (UserService.isLoggedIn()) return;
   *
   *     // Prevent $urlRouter's default handler from firing
   *     e.preventDefault();
   *
   *     UserService.handleLogin().then(function() {
   *       // Once the user has logged in, sync the current URL
   *       // to the router:
   *       $urlRouter.sync();
   *     });
   *   });
   *
   *   // Configures $urlRouter's listener *after* your custom listener
   *   $urlRouter.listen();
   * });
   * </pre>
   *
   * @param {boolean} defer Indicates whether to defer location change interception. Passing
            no parameter is equivalent to `true`.
   */
  this.deferIntercept = function (defer) {
    if (defer === undefined) defer = true;
    interceptDeferred = defer;
  };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouter
   *
   * @requires $location
   * @requires $rootScope
   * @requires $injector
   * @requires $browser
   *
   * @description
   *
   */
  this.$get = $get;
  $get.$inject = ['$location', '$rootScope', '$injector', '$browser'];
  function $get(   $location,   $rootScope,   $injector,   $browser) {

    var baseHref = $browser.baseHref(), location = $location.url();

    function appendBasePath(url, isHtml5, absolute) {
      if (baseHref === '/') return url;
      if (isHtml5) return baseHref.slice(0, -1) + url;
      if (absolute) return baseHref.slice(1) + url;
      return url;
    }

    // TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
    function update(evt) {
      if (evt && evt.defaultPrevented) return;

      function check(rule) {
        var handled = rule($injector, $location);

        if (!handled) return false;
        if (isString(handled)) $location.replace().url(handled);
        return true;
      }
      var n = rules.length, i;

      for (i = 0; i < n; i++) {
        if (check(rules[i])) return;
      }
      // always check otherwise last to allow dynamic updates to the set of rules
      if (otherwise) check(otherwise);
    }

    function listen() {
      listener = listener || $rootScope.$on('$locationChangeSuccess', update);
      return listener;
    }

    if (!interceptDeferred) listen();

    return {
      /**
       * @ngdoc function
       * @name ui.router.router.$urlRouter#sync
       * @methodOf ui.router.router.$urlRouter
       *
       * @description
       * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
       * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event,
       * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed
       * with the transition by calling `$urlRouter.sync()`.
       *
       * @example
       * <pre>
       * angular.module('app', ['ui.router'])
       *   .run(function($rootScope, $urlRouter) {
       *     $rootScope.$on('$locationChangeSuccess', function(evt) {
       *       // Halt state change from even starting
       *       evt.preventDefault();
       *       // Perform custom logic
       *       var meetsRequirement = ...
       *       // Continue with the update and state transition if logic allows
       *       if (meetsRequirement) $urlRouter.sync();
       *     });
       * });
       * </pre>
       */
      sync: function() {
        update();
      },

      listen: function() {
        return listen();
      },

      update: function(read) {
        if (read) {
          location = $location.url();
          return;
        }
        if ($location.url() === location) return;

        $location.url(location);
        $location.replace();
      },

      push: function(urlMatcher, params, options) {
        $location.url(urlMatcher.format(params || {}));
        if (options && options.replace) $location.replace();
      },

      /**
       * @ngdoc function
       * @name ui.router.router.$urlRouter#href
       * @methodOf ui.router.router.$urlRouter
       *
       * @description
       * A URL generation method that returns the compiled URL for a given
       * {@link ui.router.util.type:UrlMatcher `UrlMatcher`}, populated with the provided parameters.
       *
       * @example
       * <pre>
       * $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
       *   person: "bob"
       * });
       * // $bob == "/about/bob";
       * </pre>
       *
       * @param {UrlMatcher} urlMatcher The `UrlMatcher` object which is used as the template of the URL to generate.
       * @param {object=} params An object of parameter values to fill the matcher's required parameters.
       * @param {object=} options Options object. The options are:
       *
       * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
       *
       * @returns {string} Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
       */
      href: function(urlMatcher, params, options) {
        if (!urlMatcher.validates(params)) return null;

        var isHtml5 = $locationProvider.html5Mode();
        var url = urlMatcher.format(params);
        options = options || {};

        if (!isHtml5 && url !== null) {
          url = "#" + $locationProvider.hashPrefix() + url;
        }
        url = appendBasePath(url, isHtml5, options.absolute);

        if (!options.absolute || !url) {
          return url;
        }

        var slash = (!isHtml5 && url ? '/' : ''), port = $location.port();
        port = (port === 80 || port === 443 ? '' : ':' + port);

        return [$location.protocol(), '://', $location.host(), port, slash, url].join('');
      }
    };
  }
}

angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$stateProvider
 *
 * @requires ui.router.router.$urlRouterProvider
 * @requires ui.router.util.$urlMatcherFactoryProvider
 *
 * @description
 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
 * on state.
 *
 * A state corresponds to a "place" in the application in terms of the overall UI and
 * navigation. A state describes (via the controller / template / view properties) what
 * the UI looks like and does at that place.
 *
 * States often have things in common, and the primary way of factoring out these
 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
 * nested states.
 *
 * The `$stateProvider` provides interfaces to declare these states for your app.
 */
$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider'];
function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory) {

  var root, states = {}, $state, queue = {}, abstractKey = 'abstract';

  // Builds state properties from definition passed to registerState()
  var stateBuilder = {

    // Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
    // state.children = [];
    // if (parent) parent.children.push(state);
    parent: function(state) {
      if (isDefined(state.parent) && state.parent) return findState(state.parent);
      // regex matches any valid composite state name
      // would match "contact.list" but not "contacts"
      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
      return compositeName ? findState(compositeName[1]) : root;
    },

    // inherit 'data' from parent and override by own values (if any)
    data: function(state) {
      if (state.parent && state.parent.data) {
        state.data = state.self.data = extend({}, state.parent.data, state.data);
      }
      return state.data;
    },

    // Build a URLMatcher if necessary, either via a relative or absolute URL
    url: function(state) {
      var url = state.url, config = { params: state.params || {} };

      if (isString(url)) {
        if (url.charAt(0) == '^') return $urlMatcherFactory.compile(url.substring(1), config);
        return (state.parent.navigable || root).url.concat(url, config);
      }

      if (!url || $urlMatcherFactory.isMatcher(url)) return url;
      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
    },

    // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
    navigable: function(state) {
      return state.url ? state : (state.parent ? state.parent.navigable : null);
    },

    // Derive parameters for this state and ensure they're a super-set of parent's parameters
    params: function(state) {
      if (!state.params) {
        return state.url ? state.url.params : state.parent.params;
      }
      return state.params;
    },

    // If there is no explicit multi-view configuration, make one up so we don't have
    // to handle both cases in the view directive later. Note that having an explicit
    // 'views' property will mean the default unnamed view properties are ignored. This
    // is also a good time to resolve view names to absolute names, so everything is a
    // straight lookup at link time.
    views: function(state) {
      var views = {};

      forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
        views[name] = view;
      });
      return views;
    },

    ownParams: function(state) {
      state.params = state.params || {};

      if (!state.parent) {
          return objectKeys(state.params);
      }
      var paramNames = {}; forEach(state.params, function (v, k) { paramNames[k] = true; });

      forEach(state.parent.params, function (v, k) {
        if (!paramNames[k]) {
          throw new Error("Missing required parameter '" + k + "' in state '" + state.name + "'");
        }
        paramNames[k] = false;
      });
      var ownParams = [];

      forEach(paramNames, function (own, p) {
        if (own) ownParams.push(p);
      });
      return ownParams;
    },

    // Keep a full path from the root down to this state as this is needed for state activation.
    path: function(state) {
      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
    },

    // Speed up $state.contains() as it's used a lot
    includes: function(state) {
      var includes = state.parent ? extend({}, state.parent.includes) : {};
      includes[state.name] = true;
      return includes;
    },

    $delegates: {}
  };

  function isRelative(stateName) {
    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
  }

  function findState(stateOrName, base) {
    if (!stateOrName) return undefined;

    var isStr = isString(stateOrName),
        name  = isStr ? stateOrName : stateOrName.name,
        path  = isRelative(name);

    if (path) {
      if (!base) throw new Error("No reference point given for path '"  + name + "'");
      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;

      for (; i < pathLength; i++) {
        if (rel[i] === "" && i === 0) {
          current = base;
          continue;
        }
        if (rel[i] === "^") {
          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
          current = current.parent;
          continue;
        }
        break;
      }
      rel = rel.slice(i).join(".");
      name = current.name + (current.name && rel ? "." : "") + rel;
    }
    var state = states[name];

    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
      return state;
    }
    return undefined;
  }

  function queueState(parentName, state) {
    if (!queue[parentName]) {
      queue[parentName] = [];
    }
    queue[parentName].push(state);
  }

  function registerState(state) {
    // Wrap a new object around the state so we can store our private details easily.
    state = inherit(state, {
      self: state,
      resolve: state.resolve || {},
      toString: function() { return this.name; }
    });

    var name = state.name;
    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "'' is already defined");

    // Get parent name
    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
        : (isString(state.parent)) ? state.parent
        : '';

    // If parent is not registered yet, add state to queue and register later
    if (parentName && !states[parentName]) {
      return queueState(parentName, state.self);
    }

    for (var key in stateBuilder) {
      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
    }
    states[name] = state;

    // Register the state in the global state list and with $urlRouter if necessary.
    if (!state[abstractKey] && state.url) {
      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
          $state.transitionTo(state, $match, { location: false });
        }
      }]);
    }

    // Register any queued children
    if (queue[name]) {
      for (var i = 0; i < queue[name].length; i++) {
        registerState(queue[name][i]);
      }
    }

    return state;
  }

  // Checks text to see if it looks like a glob.
  function isGlob (text) {
    return text.indexOf('*') > -1;
  }

  // Returns true if glob matches current $state name.
  function doesStateMatchGlob (glob) {
    var globSegments = glob.split('.'),
        segments = $state.$current.name.split('.');

    //match greedy starts
    if (globSegments[0] === '**') {
       segments = segments.slice(segments.indexOf(globSegments[1]));
       segments.unshift('**');
    }
    //match greedy ends
    if (globSegments[globSegments.length - 1] === '**') {
       segments.splice(segments.indexOf(globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
       segments.push('**');
    }

    if (globSegments.length != segments.length) {
      return false;
    }

    //match single stars
    for (var i = 0, l = globSegments.length; i < l; i++) {
      if (globSegments[i] === '*') {
        segments[i] = '*';
      }
    }

    return segments.join('') === globSegments.join('');
  }


  // Implicit root state that is always active
  root = registerState({
    name: '',
    url: '^',
    views: null,
    'abstract': true
  });
  root.navigable = null;


  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#decorator
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Allows you to extend (carefully) or override (at your own peril) the 
   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
   * to add custom functionality to ui-router, for example inferring templateUrl 
   * based on the state name.
   *
   * When passing only a name, it returns the current (original or decorated) builder
   * function that matches `name`.
   *
   * The builder functions that can be decorated are listed below. Though not all
   * necessarily have a good use case for decoration, that is up to you to decide.
   *
   * In addition, users can attach custom decorators, which will generate new 
   * properties within the state's internal definition. There is currently no clear 
   * use-case for this beyond accessing internal states (i.e. $state.$current), 
   * however, expect this to become increasingly relevant as we introduce additional 
   * meta-programming features.
   *
   * **Warning**: Decorators should not be interdependent because the order of 
   * execution of the builder functions in non-deterministic. Builder functions 
   * should only be dependent on the state definition object and super function.
   *
   *
   * Existing builder functions and current return values:
   *
   * - **parent** `{object}` - returns the parent state object.
   * - **data** `{object}` - returns state data, including any inherited data that is not
   *   overridden by own values (if any).
   * - **url** `{object}` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher}
   *   or `null`.
   * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is 
   *   navigable).
   * - **params** `{object}` - returns an array of state params that are ensured to 
   *   be a super-set of parent's params.
   * - **views** `{object}` - returns a views object where each key is an absolute view 
   *   name (i.e. "viewName@stateName") and each value is the config object 
   *   (template, controller) for the view. Even when you don't use the views object 
   *   explicitly on a state config, one is still created for you internally.
   *   So by decorating this builder function you have access to decorating template 
   *   and controller properties.
   * - **ownParams** `{object}` - returns an array of params that belong to the state, 
   *   not including any params defined by ancestor states.
   * - **path** `{string}` - returns the full path from the root down to this state. 
   *   Needed for state activation.
   * - **includes** `{object}` - returns an object that includes every state that 
   *   would pass a `$state.includes()` test.
   *
   * @example
   * <pre>
   * // Override the internal 'views' builder with a function that takes the state
   * // definition, and a reference to the internal function being overridden:
   * $stateProvider.decorator('views', function (state, parent) {
   *   var result = {},
   *       views = parent(state);
   *
   *   angular.forEach(views, function (config, name) {
   *     var autoName = (state.name + '.' + name).replace('.', '/');
   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
   *     result[name] = config;
   *   });
   *   return result;
   * });
   *
   * $stateProvider.state('home', {
   *   views: {
   *     'contact.list': { controller: 'ListController' },
   *     'contact.item': { controller: 'ItemController' }
   *   }
   * });
   *
   * // ...
   *
   * $state.go('home');
   * // Auto-populates list and item views with /partials/home/contact/list.html,
   * // and /partials/home/contact/item.html, respectively.
   * </pre>
   *
   * @param {string} name The name of the builder function to decorate. 
   * @param {object} func A function that is responsible for decorating the original 
   * builder function. The function receives two parameters:
   *
   *   - `{object}` - state - The state config object.
   *   - `{object}` - super - The original builder function.
   *
   * @return {object} $stateProvider - $stateProvider instance
   */
  this.decorator = decorator;
  function decorator(name, func) {
    /*jshint validthis: true */
    if (isString(name) && !isDefined(func)) {
      return stateBuilder[name];
    }
    if (!isFunction(func) || !isString(name)) {
      return this;
    }
    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
      stateBuilder.$delegates[name] = stateBuilder[name];
    }
    stateBuilder[name] = func;
    return this;
  }

  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#state
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Registers a state configuration under a given state name. The stateConfig object
   * has the following acceptable properties.
   *
   * <a id='template'></a>
   *
   * - **`template`** - {string|function=} - html template as a string or a function that returns
   *   an html template as a string which should be used by the uiView directives. This property 
   *   takes precedence over templateUrl.
   *   
   *   If `template` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by
   *     applying the current state
   *
   * <a id='templateUrl'></a>
   *
   * - **`templateUrl`** - {string|function=} - path or function that returns a path to an html 
   *   template that should be used by uiView.
   *   
   *   If `templateUrl` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by 
   *     applying the current state
   *
   * <a id='templateProvider'></a>
   *
   * - **`templateProvider`** - {function=} - Provider function that returns HTML content
   *   string.
   *
   * <a id='controller'></a>
   *
   * - **`controller`** - {string|function=} -  Controller fn that should be associated with newly 
   *   related scope or the name of a registered controller if passed as a string.
   *
   * <a id='controllerProvider'></a>
   *
   * - **`controllerProvider`** - {function=} - Injectable provider function that returns
   *   the actual controller or string.
   *
   * <a id='controllerAs'></a>
   * 
   * - **`controllerAs`** – {string=} – A controller alias name. If present the controller will be 
   *   published to scope under the controllerAs name.
   *
   * <a id='resolve'></a>
   *
   * - **`resolve`** - {object.&lt;string, function&gt;=} - An optional map of dependencies which 
   *   should be injected into the controller. If any of these dependencies are promises, 
   *   the router will wait for them all to be resolved or one to be rejected before the 
   *   controller is instantiated. If all the promises are resolved successfully, the values 
   *   of the resolved promises are injected and $stateChangeSuccess event is fired. If any 
   *   of the promises are rejected the $stateChangeError event is fired. The map object is:
   *   
   *   - key - {string}: name of dependency to be injected into controller
   *   - factory - {string|function}: If string then it is alias for service. Otherwise if function, 
   *     it is injected and return value it treated as dependency. If result is a promise, it is 
   *     resolved before its value is injected into controller.
   *
   * <a id='url'></a>
   *
   * - **`url`** - {string=} - A url with optional parameters. When a state is navigated or
   *   transitioned to, the `$stateParams` service will be populated with any 
   *   parameters that were passed.
   *
   * <a id='params'></a>
   *
   * - **`params`** - {object=} - An array of parameter names or regular expressions. Only 
   *   use this within a state if you are not using url. Otherwise you can specify your
   *   parameters within the url. When a state is navigated or transitioned to, the 
   *   $stateParams service will be populated with any parameters that were passed.
   *
   * <a id='views'></a>
   *
   * - **`views`** - {object=} - Use the views property to set up multiple views or to target views
   *   manually/explicitly.
   *
   * <a id='abstract'></a>
   *
   * - **`abstract`** - {boolean=} - An abstract state will never be directly activated, 
   *   but can provide inherited properties to its common children states.
   *
   * <a id='onEnter'></a>
   *
   * - **`onEnter`** - {object=} - Callback function for when a state is entered. Good way
   *   to trigger an action or dispatch an event, such as opening a dialog.
   * If minifying your scripts, make sure to use the `['injection1', 'injection2', function(injection1, injection2){}]` syntax.
   *
   * <a id='onExit'></a>
   *
   * - **`onExit`** - {object=} - Callback function for when a state is exited. Good way to
   *   trigger an action or dispatch an event, such as opening a dialog.
   * If minifying your scripts, make sure to use the `['injection1', 'injection2', function(injection1, injection2){}]` syntax.
   *
   * <a id='reloadOnSearch'></a>
   *
   * - **`reloadOnSearch = true`** - {boolean=} - If `false`, will not retrigger the same state 
   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
   *   Useful for when you'd like to modify $location.search() without triggering a reload.
   *
   * <a id='data'></a>
   *
   * - **`data`** - {object=} - Arbitrary data object, useful for custom configuration.
   *
   * @example
   * <pre>
   * // Some state name examples
   *
   * // stateName can be a single top-level name (must be unique).
   * $stateProvider.state("home", {});
   *
   * // Or it can be a nested state name. This state is a child of the 
   * // above "home" state.
   * $stateProvider.state("home.newest", {});
   *
   * // Nest states as deeply as needed.
   * $stateProvider.state("home.newest.abc.xyz.inception", {});
   *
   * // state() returns $stateProvider, so you can chain state declarations.
   * $stateProvider
   *   .state("home", {})
   *   .state("about", {})
   *   .state("contacts", {});
   * </pre>
   *
   * @param {string} name A unique state name, e.g. "home", "about", "contacts". 
   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
   * @param {object} definition State configuration object.
   */
  this.state = state;
  function state(name, definition) {
    /*jshint validthis: true */
    if (isObject(name)) definition = name;
    else definition.name = name;
    registerState(definition);
    return this;
  }

  /**
   * @ngdoc object
   * @name ui.router.state.$state
   *
   * @requires $rootScope
   * @requires $q
   * @requires ui.router.state.$view
   * @requires $injector
   * @requires ui.router.util.$resolve
   * @requires ui.router.state.$stateParams
   * @requires ui.router.router.$urlRouter
   *
   * @property {object} params A param object, e.g. {sectionId: section.id)}, that 
   * you'd like to test against the current active state.
   * @property {object} current A reference to the state's config object. However 
   * you passed it in. Useful for accessing custom data.
   * @property {object} transition Currently pending transition. A promise that'll 
   * resolve or reject.
   *
   * @description
   * `$state` service is responsible for representing states as well as transitioning
   * between them. It also provides interfaces to ask for current state or even states
   * you're coming from.
   */
  this.$get = $get;
  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$urlRouter'];
  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $urlRouter) {

    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
    var TransitionPrevented = $q.reject(new Error('transition prevented'));
    var TransitionAborted = $q.reject(new Error('transition aborted'));
    var TransitionFailed = $q.reject(new Error('transition failed'));

    // Handles the case where a state which is the target of a transition is not found, and the user
    // can optionally retry or defer the transition
    function handleRedirect(redirect, state, params, options) {
      /**
       * @ngdoc event
       * @name ui.router.state.$state#$stateNotFound
       * @eventOf ui.router.state.$state
       * @eventType broadcast on root scope
       * @description
       * Fired when a requested state **cannot be found** using the provided state name during transition.
       * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
       * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
       * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
       * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
       *
       * @param {Object} event Event object.
       * @param {Object} unfoundState Unfound State information. Contains: `to, toParams, options` properties.
       * @param {State} fromState Current state object.
       * @param {Object} fromParams Current state params.
       *
       * @example
       *
       * <pre>
       * // somewhere, assume lazy.state has not been defined
       * $state.go("lazy.state", {a:1, b:2}, {inherit:false});
       *
       * // somewhere else
       * $scope.$on('$stateNotFound',
       * function(event, unfoundState, fromState, fromParams){
       *     console.log(unfoundState.to); // "lazy.state"
       *     console.log(unfoundState.toParams); // {a:1, b:2}
       *     console.log(unfoundState.options); // {inherit:false} + default options
       * })
       * </pre>
       */
      var evt = $rootScope.$broadcast('$stateNotFound', redirect, state, params);

      if (evt.defaultPrevented) {
        $urlRouter.update();
        return TransitionAborted;
      }

      if (!evt.retry) {
        return null;
      }

      // Allow the handler to return a promise to defer state lookup retry
      if (options.$retry) {
        $urlRouter.update();
        return TransitionFailed;
      }
      var retryTransition = $state.transition = $q.when(evt.retry);

      retryTransition.then(function() {
        if (retryTransition !== $state.transition) return TransitionSuperseded;
        redirect.options.$retry = true;
        return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
      }, function() {
        return TransitionAborted;
      });
      $urlRouter.update();

      return retryTransition;
    }

    root.locals = { resolve: null, globals: { $stateParams: {} } };

    $state = {
      params: {},
      current: root.self,
      $current: root,
      transition: null
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#reload
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method that force reloads the current state. All resolves are re-resolved, events are not re-fired, 
     * and controllers reinstantiated (bug with controllers reinstantiating right now, fixing soon).
     *
     * @example
     * <pre>
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     *     $state.reload();
     *   }
     * });
     * </pre>
     *
     * `reload()` is just an alias for:
     * <pre>
     * $state.transitionTo($state.current, $stateParams, { 
     *   reload: true, inherit: false, notify: false 
     * });
     * </pre>
     */
    $state.reload = function reload() {
      $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: false });
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#go
     * @methodOf ui.router.state.$state
     *
     * @description
     * Convenience method for transitioning to a new state. `$state.go` calls 
     * `$state.transitionTo` internally but automatically sets options to 
     * `{ location: true, inherit: true, relative: $state.$current, notify: true }`. 
     * This allows you to easily use an absolute or relative to path and specify 
     * only the parameters you'd like to update (while letting unspecified parameters 
     * inherit from the currently active ancestor states).
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.go('contact.detail');
     *   };
     * });
     * </pre>
     * <img src='../ngdoc_assets/StateGoExamples.png'/>
     *
     * @param {string} to Absolute state name or relative state path. Some examples:
     *
     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
     * - `$state.go('^')` - will go to a parent state
     * - `$state.go('^.sibling')` - will go to a sibling state
     * - `$state.go('.child.grandchild')` - will go to grandchild state
     *
     * @param {object=} params A map of the parameters that will be sent to the state, 
     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
     * defined parameters. This allows, for example, going to a sibling state that shares parameters
     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
     * will get you all current parameters, etc.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition.
     *
     * Possible success values:
     *
     * - $state.current
     *
     * <br/>Possible rejection values:
     *
     * - 'transition superseded' - when a newer transition has been started after this one
     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
     *   when a `$stateNotFound` `event.retry` promise errors.
     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
     * - *resolve error* - when an error has occurred with a `resolve`
     *
     */
    $state.go = function go(to, params, options) {
      return $state.transitionTo(to, params, extend({ inherit: true, relative: $state.$current }, options));
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#transitionTo
     * @methodOf ui.router.state.$state
     *
     * @description
     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go}
     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.transitionTo('contact.detail');
     *   };
     * });
     * </pre>
     *
     * @param {string} to State name.
     * @param {object=} toParams A map of the parameters that will be sent to the state,
     * will populate $stateParams.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go}.
     */
    $state.transitionTo = function transitionTo(to, toParams, options) {
      toParams = toParams || {};
      options = extend({
        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
      }, options || {});

      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
      var evt, toState = findState(to, options.relative);

      if (!isDefined(toState)) {
        var redirect = { to: to, toParams: toParams, options: options };
        var redirectResult = handleRedirect(redirect, from.self, fromParams, options);

        if (redirectResult) {
          return redirectResult;
        }

        // Always retry once if the $stateNotFound was not prevented
        // (handles either redirect changed or state lazy-definition)
        to = redirect.to;
        toParams = redirect.toParams;
        options = redirect.options;
        toState = findState(to, options.relative);

        if (!isDefined(toState)) {
          if (!options.relative) throw new Error("No such state '" + to + "'");
          throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
        }
      }
      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
      if (options.inherit) toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
      to = toState;

      var toPath = to.path;

      // Starting from the root of the path, keep all levels that haven't changed
      var keep = 0, state = toPath[keep], locals = root.locals, toLocals = [];

      if (!options.reload) {
        while (state && state === fromPath[keep] && equalForKeys(toParams, fromParams, state.ownParams)) {
          locals = toLocals[keep] = state.locals;
          keep++;
          state = toPath[keep];
        }
      }

      // If we're going to the same state and all locals are kept, we've got nothing to do.
      // But clear 'transition', as we still want to cancel any other pending transitions.
      // TODO: We may not want to bump 'transition' if we're called from a location change
      // that we've initiated ourselves, because we might accidentally abort a legitimate
      // transition initiated from code?
      if (shouldTriggerReload(to, from, locals, options)) {
        if (to.self.reloadOnSearch !== false) $urlRouter.update();
        $state.transition = null;
        return $q.when($state.current);
      }

      // Filter parameters before we pass them to event handlers etc.
      toParams = filterByKeys(objectKeys(to.params), toParams || {});

      // Broadcast start event and cancel the transition if requested
      if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeStart
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when the state transition **begins**. You can use `event.preventDefault()`
         * to prevent the transition from happening and then the transition promise will be
         * rejected with a `'transition prevented'` value.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         *
         * @example
         *
         * <pre>
         * $rootScope.$on('$stateChangeStart',
         * function(event, toState, toParams, fromState, fromParams){
         *     event.preventDefault();
         *     // transitionTo() promise will be rejected with
         *     // a 'transition prevented' error
         * })
         * </pre>
         */
        if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams).defaultPrevented) {
          $urlRouter.update();
          return TransitionPrevented;
        }
      }

      // Resolve locals for the remaining states, but don't update any global state just
      // yet -- if anything fails to resolve the current state needs to remain untouched.
      // We also set up an inheritance chain for the locals here. This allows the view directive
      // to quickly look up the correct definition for each view in the current state. Even
      // though we create the locals object itself outside resolveState(), it is initially
      // empty and gets filled asynchronously. We need to keep track of the promise for the
      // (fully resolved) current locals, and pass this down the chain.
      var resolved = $q.when(locals);

      for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
        locals = toLocals[l] = inherit(locals);
        resolved = resolveState(state, toParams, state === to, resolved, locals);
      }

      // Once everything is resolved, we are ready to perform the actual transition
      // and return a promise for the new state. We also keep track of what the
      // current promise is, so that we can detect overlapping transitions and
      // keep only the outcome of the last transition.
      var transition = $state.transition = resolved.then(function () {
        var l, entering, exiting;

        if ($state.transition !== transition) return TransitionSuperseded;

        // Exit 'from' states not kept
        for (l = fromPath.length - 1; l >= keep; l--) {
          exiting = fromPath[l];
          if (exiting.self.onExit) {
            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
          }
          exiting.locals = null;
        }

        // Enter 'to' states not kept
        for (l = keep; l < toPath.length; l++) {
          entering = toPath[l];
          entering.locals = toLocals[l];
          if (entering.self.onEnter) {
            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
          }
        }

        // Run it again, to catch any transitions in callbacks
        if ($state.transition !== transition) return TransitionSuperseded;

        // Update globals in $state
        $state.$current = to;
        $state.current = to.self;
        $state.params = toParams;
        copy($state.params, $stateParams);
        $state.transition = null;

        if (options.location && to.navigable) {
          $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
            replace: options.location === 'replace'
          });
        }

        if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeSuccess
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired once the state transition is **complete**.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         */
          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
        }
        $urlRouter.update(true);

        return $state.current;
      }, function (error) {
        if ($state.transition !== transition) return TransitionSuperseded;

        $state.transition = null;
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeError
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when an **error occurs** during transition. It's important to note that if you
         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
         * they will not throw traditionally. You must listen for this $stateChangeError event to
         * catch **ALL** errors.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         * @param {Error} error The resolve error object.
         */
        evt = $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);

        if (!evt.defaultPrevented) {
            $urlRouter.update();
        }

        return $q.reject(error);
      });

      return transition;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#is
     * @methodOf ui.router.state.$state
     *
     * @description
     * Similar to {@link ui.router.state.$state#methods_includes $state.includes},
     * but only checks for the full state name. If params is supplied then it will be 
     * tested for strict equality against the current active params object, so all params 
     * must match with none missing and no extras.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * // absolute name
     * $state.is('contact.details.item'); // returns true
     * $state.is(contactDetailItemStateObject); // returns true
     *
     * // relative name (. and ^), typically from a template
     * // E.g. from the 'contacts.details' template
     * <div ng-class="{highlighted: $state.is('.item')}">Item</div>
     * </pre>
     *
     * @param {string|object} stateName The state name (absolute or relative) or state object you'd like to check.
     * @param {object=} params A param object, e.g. `{sectionId: section.id}`, that you'd like 
     * to test against the current active state.
     * @returns {boolean} Returns true if it is the state.
     */
    $state.is = function is(stateOrName, params) {
      var state = findState(stateOrName);

      if (!isDefined(state)) {
        return undefined;
      }

      if ($state.$current !== state) {
        return false;
      }

      return isDefined(params) && params !== null ? angular.equals($stateParams, params) : true;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#includes
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method to determine if the current active state is equal to or is the child of the
     * state stateName. If any params are passed then they will be tested for a match as well.
     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
     *
     * @example
     * Partial and relative names
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * // Using partial names
     * $state.includes("contacts"); // returns true
     * $state.includes("contacts.details"); // returns true
     * $state.includes("contacts.details.item"); // returns true
     * $state.includes("contacts.list"); // returns false
     * $state.includes("about"); // returns false
     *
     * // Using relative names (. and ^), typically from a template
     * // E.g. from the 'contacts.details' template
     * <div ng-class="{highlighted: $state.includes('.item')}">Item</div>
     * </pre>
     *
     * Basic globbing patterns
     * <pre>
     * $state.$current.name = 'contacts.details.item.url';
     *
     * $state.includes("*.details.*.*"); // returns true
     * $state.includes("*.details.**"); // returns true
     * $state.includes("**.item.**"); // returns true
     * $state.includes("*.details.item.url"); // returns true
     * $state.includes("*.details.*.url"); // returns true
     * $state.includes("*.details.*"); // returns false
     * $state.includes("item.**"); // returns false
     * </pre>
     *
     * @param {string} stateOrName A partial name, relative name, or glob pattern
     * to be searched for within the current state name.
     * @param {object} params A param object, e.g. `{sectionId: section.id}`,
     * that you'd like to test against the current active state.
     * @returns {boolean} Returns true if it does include the state
     */
    $state.includes = function includes(stateOrName, params) {
      if (isString(stateOrName) && isGlob(stateOrName)) {
        if (!doesStateMatchGlob(stateOrName)) {
          return false;
        }
        stateOrName = $state.$current.name;
      }
      var state = findState(stateOrName);

      if (!isDefined(state)) {
        return undefined;
      }
      if (!isDefined($state.$current.includes[state.name])) {
        return false;
      }
      return equalForKeys(params, $stateParams);
    };


    /**
     * @ngdoc function
     * @name ui.router.state.$state#href
     * @methodOf ui.router.state.$state
     *
     * @description
     * A url generation method that returns the compiled url for the given state populated with the given params.
     *
     * @example
     * <pre>
     * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
     * </pre>
     *
     * @param {string|object} stateOrName The state name or state object you'd like to generate a url from.
     * @param {object=} params An object of parameter values to fill the state's required parameters.
     * @param {object=} options Options object. The options are:
     *
     * - **`lossy`** - {boolean=true} -  If true, and if there is no url associated with the state provided in the
     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
     *    ancestor with a valid url).
     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     * 
     * @returns {string} compiled state url
     */
    $state.href = function href(stateOrName, params, options) {
      options = extend({
        lossy:    true,
        inherit:  true,
        absolute: false,
        relative: $state.$current
      }, options || {});

      var state = findState(stateOrName, options.relative);

      if (!isDefined(state)) return null;
      if (options.inherit) params = inheritParams($stateParams, params || {}, $state.$current, state);
      
      var nav = (state && options.lossy) ? state.navigable : state;

      if (!nav || !nav.url) {
        return null;
      }
      return $urlRouter.href(nav.url, filterByKeys(objectKeys(state.params), params || {}), {
        absolute: options.absolute
      });
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#get
     * @methodOf ui.router.state.$state
     *
     * @description
     * Returns the state configuration object for any specific state or all states.
     *
     * @param {string|Sbject=} stateOrName (absolute or relative) If provided, will only get the config for
     * the requested state. If not provided, returns an array of ALL state configs.
     * @returns {Object|Array} State configuration object or array of all objects.
     */
    $state.get = function (stateOrName, context) {
      if (arguments.length === 0) return objectKeys(states).map(function(name) { return states[name].self; });
      var state = findState(stateOrName, context);
      return (state && state.self) ? state.self : null;
    };

    function resolveState(state, params, paramsAreFiltered, inherited, dst) {
      // Make a restricted $stateParams with only the parameters that apply to this state if
      // necessary. In addition to being available to the controller and onEnter/onExit callbacks,
      // we also need $stateParams to be available for any $injector calls we make during the
      // dependency resolution process.
      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(objectKeys(state.params), params);
      var locals = { $stateParams: $stateParams };

      // Resolve 'global' dependencies for the state, i.e. those not specific to a view.
      // We're also including $stateParams in this; that way the parameters are restricted
      // to the set that should be visible to the state, and are independent of when we update
      // the global $state and $stateParams values.
      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
      var promises = [dst.resolve.then(function (globals) {
        dst.globals = globals;
      })];
      if (inherited) promises.push(inherited);

      // Resolve template and dependencies for all views.
      forEach(state.views, function (view, name) {
        var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
        injectables.$template = [ function () {
          return $view.load(name, { view: view, locals: locals, params: $stateParams }) || '';
        }];

        promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function (result) {
          // References to the controller (only instantiated at link time)
          if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
            var injectLocals = angular.extend({}, injectables, locals);
            result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
          } else {
            result.$$controller = view.controller;
          }
          // Provide access to the state itself for internal use
          result.$$state = state;
          result.$$controllerAs = view.controllerAs;
          dst[name] = result;
        }));
      });

      // Wait for all the promises and then return the activation object
      return $q.all(promises).then(function (values) {
        return dst;
      });
    }

    return $state;
  }

  function shouldTriggerReload(to, from, locals, options) {
    if (to === from && ((locals === from.locals && !options.reload) || (to.self.reloadOnSearch === false))) {
      return true;
    }
  }
}

angular.module('ui.router.state')
  .value('$stateParams', {})
  .provider('$state', $StateProvider);


$ViewProvider.$inject = [];
function $ViewProvider() {

  this.$get = $get;
  /**
   * @ngdoc object
   * @name ui.router.state.$view
   *
   * @requires ui.router.util.$templateFactory
   * @requires $rootScope
   *
   * @description
   *
   */
  $get.$inject = ['$rootScope', '$templateFactory'];
  function $get(   $rootScope,   $templateFactory) {
    return {
      // $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... })
      /**
       * @ngdoc function
       * @name ui.router.state.$view#load
       * @methodOf ui.router.state.$view
       *
       * @description
       *
       * @param {string} name name
       * @param {object} options option object.
       */
      load: function load(name, options) {
        var result, defaults = {
          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {}
        };
        options = extend(defaults, options);

        if (options.view) {
          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
        }
        if (result && options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$viewContentLoading
         * @eventOf ui.router.state.$view
         * @eventType broadcast on root scope
         * @description
         *
         * Fired once the view **begins loading**, *before* the DOM is rendered.
         *
         * @param {Object} event Event object.
         * @param {Object} viewConfig The view config properties (template, controller, etc).
         *
         * @example
         *
         * <pre>
         * $scope.$on('$viewContentLoading',
         * function(event, viewConfig){
         *     // Access to all the view config properties.
         *     // and one special property 'targetView'
         *     // viewConfig.targetView
         * });
         * </pre>
         */
          $rootScope.$broadcast('$viewContentLoading', options);
        }
        return result;
      }
    };
  }
}

angular.module('ui.router.state').provider('$view', $ViewProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$uiViewScrollProvider
 *
 * @description
 * Provider that returns the {@link ui.router.state.$uiViewScroll} service function.
 */
function $ViewScrollProvider() {

  var useAnchorScroll = false;

  /**
   * @ngdoc function
   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
   * @methodOf ui.router.state.$uiViewScrollProvider
   *
   * @description
   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
   * scrolling based on the url anchor.
   */
  this.useAnchorScroll = function () {
    useAnchorScroll = true;
  };

  /**
   * @ngdoc object
   * @name ui.router.state.$uiViewScroll
   *
   * @requires $anchorScroll
   * @requires $timeout
   *
   * @description
   * When called with a jqLite element, it scrolls the element into view (after a
   * `$timeout` so the DOM has time to refresh).
   *
   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`}.
   */
  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
    if (useAnchorScroll) {
      return $anchorScroll;
    }

    return function ($element) {
      $timeout(function () {
        $element[0].scrollIntoView();
      }, 0, false);
    };
  }];
}

angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-view
 *
 * @requires ui.router.state.$state
 * @requires $compile
 * @requires $controller
 * @requires $injector
 * @requires ui.router.state.$uiViewScroll
 * @requires $document
 *
 * @restrict ECA
 *
 * @description
 * The ui-view directive tells $state where to place your templates.
 *
 * @param {string=} ui-view A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states.
 *
 * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
 * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
 * scroll ui-view elements into view when they are populated during a state activation.
 *
 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
 *
 * @param {string=} onload Expression to evaluate whenever the view updates.
 * 
 * @example
 * A view can be unnamed or named. 
 * <pre>
 * <!-- Unnamed -->
 * <div ui-view></div> 
 * 
 * <!-- Named -->
 * <div ui-view="viewName"></div>
 * </pre>
 *
 * You can only have one unnamed view within any template (or root html). If you are only using a 
 * single view and it is unnamed then you can populate it like so:
 * <pre>
 * <div ui-view></div> 
 * $stateProvider.state("home", {
 *   template: "<h1>HELLO!</h1>"
 * })
 * </pre>
 * 
 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#views `views`}
 * config property, by name, in this case an empty name:
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * But typically you'll only use the views property if you name your view or have more than one view 
 * in the same template. There's not really a compelling reason to name a view if its the only one, 
 * but you could if you wanted, like so:
 * <pre>
 * <div ui-view="main"></div>
 * </pre> 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "main": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * Really though, you'll use views to set up multiple views:
 * <pre>
 * <div ui-view></div>
 * <div ui-view="chart"></div> 
 * <div ui-view="data"></div> 
 * </pre>
 * 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     },
 *     "chart": {
 *       template: "<chart_thing/>"
 *     },
 *     "data": {
 *       template: "<data_thing/>"
 *     }
 *   }    
 * })
 * </pre>
 *
 * Examples for `autoscroll`:
 *
 * <pre>
 * <!-- If autoscroll present with no expression,
 *      then scroll ui-view into view -->
 * <ui-view autoscroll/>
 *
 * <!-- If autoscroll present with valid expression,
 *      then scroll ui-view into view if expression evaluates to true -->
 * <ui-view autoscroll='true'/>
 * <ui-view autoscroll='false'/>
 * <ui-view autoscroll='scopeVariable'/>
 * </pre>
 */
$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll'];
function $ViewDirective(   $state,   $injector,   $uiViewScroll) {

  function getService() {
    return ($injector.has) ? function(service) {
      return $injector.has(service) ? $injector.get(service) : null;
    } : function(service) {
      try {
        return $injector.get(service);
      } catch (e) {
        return null;
      }
    };
  }

  var service = getService(),
      $animator = service('$animator'),
      $animate = service('$animate');

  // Returns a set of DOM manipulation functions based on which Angular version
  // it should use
  function getRenderer(attrs, scope) {
    var statics = function() {
      return {
        enter: function (element, target, cb) { target.after(element); cb(); },
        leave: function (element, cb) { element.remove(); cb(); }
      };
    };

    if ($animate) {
      return {
        enter: function(element, target, cb) { $animate.enter(element, null, target, cb); },
        leave: function(element, cb) { $animate.leave(element, cb); }
      };
    }

    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
        leave: function(element, cb) { animate.leave(element); cb(); }
      };
    }

    return statics();
  }

  var directive = {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile: function (tElement, tAttrs, $transclude) {
      return function (scope, $element, attrs) {
        var previousEl, currentEl, currentScope, latestLocals,
            onloadExp     = attrs.onload || '',
            autoScrollExp = attrs.autoscroll,
            renderer      = getRenderer(attrs, scope);

        scope.$on('$stateChangeSuccess', function() {
          updateView(false);
        });
        scope.$on('$viewContentLoading', function() {
          updateView(false);
        });

        updateView(true);

        function cleanupLastView() {
          if (previousEl) {
            previousEl.remove();
            previousEl = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }

          if (currentEl) {
            renderer.leave(currentEl, function() {
              previousEl = null;
            });

            previousEl = currentEl;
            currentEl = null;
          }
        }

        function updateView(firstTime) {
          var newScope,
              name            = getUiViewName(attrs, $element.inheritedData('$uiView')),
              previousLocals  = name && $state.$current && $state.$current.locals[name];

          if (!firstTime && previousLocals === latestLocals) return; // nothing to do
          newScope = scope.$new();
          latestLocals = $state.$current.locals[name];

          var clone = $transclude(newScope, function(clone) {
            renderer.enter(clone, $element, function onUiViewEnter() {
              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                $uiViewScroll(clone);
              }
            });
            cleanupLastView();
          });

          currentEl = clone;
          currentScope = newScope;
          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoaded
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description           *
           * Fired once the view is **loaded**, *after* the DOM is rendered.
           *
           * @param {Object} event Event object.
           */
          currentScope.$emit('$viewContentLoaded');
          currentScope.$eval(onloadExp);
        }
      };
    }
  };

  return directive;
}

$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state'];
function $ViewDirectiveFill ($compile, $controller, $state) {
  return {
    restrict: 'ECA',
    priority: -400,
    compile: function (tElement) {
      var initial = tElement.html();
      return function (scope, $element, attrs) {
        var current = $state.$current,
            name = getUiViewName(attrs, $element.inheritedData('$uiView')),
            locals  = current && current.locals[name];

        if (! locals) {
          return;
        }

        $element.data('$uiView', { name: name, state: locals.$$state });
        $element.html(locals.$template ? locals.$template : initial);

        var link = $compile($element.contents());

        if (locals.$$controller) {
          locals.$scope = scope;
          var controller = $controller(locals.$$controller, locals);
          if (locals.$$controllerAs) {
            scope[locals.$$controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        link(scope);
      };
    }
  };
}

/**
 * Shared ui-view code for both directives:
 * Given attributes and inherited $uiView data, return the view's name
 */
function getUiViewName(attrs, inherited) {
  var name = attrs.uiView || attrs.name || '';
  return name.indexOf('@') >= 0 ?  name :  (name + '@' + (inherited ? inherited.state.name : ''));
}

angular.module('ui.router.state').directive('uiView', $ViewDirective);
angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

function parseStateRef(ref, current) {
  var preparsed = ref.match(/^\s*({[^}]*})\s*$/), parsed;
  if (preparsed) ref = current + '(' + preparsed[1] + ')';
  parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
  return { state: parsed[1], paramExpr: parsed[3] || null };
}

function stateContext(el) {
  var stateData = el.parent().inheritedData('$uiView');

  if (stateData && stateData.state && stateData.state.name) {
    return stateData.state;
  }
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref
 *
 * @requires ui.router.state.$state
 * @requires $timeout
 *
 * @restrict A
 *
 * @description
 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated 
 * URL, the directive will automatically generate & update the `href` attribute via 
 * the {@link ui.router.state.$state#methods_href $state.href()} method. Clicking 
 * the link will trigger a state transition with optional parameters. 
 *
 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be 
 * handled natively by the browser.
 *
 * You can also use relative state paths within ui-sref, just like the relative 
 * paths passed to `$state.go()`. You just need to be aware that the path is relative
 * to the state that the link lives in, in other words the state that loaded the 
 * template containing the link.
 *
 * You can specify options to pass to {@link ui.router.state.$state#go $state.go()}
 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
 * and `reload`.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the 
 * following template:
 * <pre>
 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a> | <a ui-sref="{page: 2}">Next page</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
 *     </li>
 * </ul>
 * </pre>
 * 
 * Then the compiled html would be (assuming Html5Mode is off and current state is contacts):
 * <pre>
 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a> | <a href="#/contacts?page=2" ui-sref="{page: 2}">Next page</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
 *     </li>
 * </ul>
 *
 * <a ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
 * </pre>
 *
 * @param {string} ui-sref 'stateName' can be any valid absolute or relative state
 * @param {Object} ui-sref-opts options to pass to {@link ui.router.state.$state#go $state.go()}
 */
$StateRefDirective.$inject = ['$state', '$timeout'];
function $StateRefDirective($state, $timeout) {
  var allowedOptions = ['location', 'inherit', 'reload'];

  return {
    restrict: 'A',
    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
    link: function(scope, element, attrs, uiSrefActive) {
      var ref = parseStateRef(attrs.uiSref, $state.current.name);
      var params = null, url = null, base = stateContext(element) || $state.$current;
      var isForm = element[0].nodeName === "FORM";
      var attr = isForm ? "action" : "href", nav = true;

      var options = { relative: base, inherit: true };
      var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};

      angular.forEach(allowedOptions, function(option) {
        if (option in optionsOverride) {
          options[option] = optionsOverride[option];
        }
      });

      var update = function(newVal) {
        if (newVal) params = newVal;
        if (!nav) return;

        var newHref = $state.href(ref.state, params, options);

        var activeDirective = uiSrefActive[1] || uiSrefActive[0];
        if (activeDirective) {
          activeDirective.$$setStateInfo(ref.state, params);
        }
        if (newHref === null) {
          nav = false;
          return false;
        }
        element[0][attr] = newHref;
      };

      if (ref.paramExpr) {
        scope.$watch(ref.paramExpr, function(newVal, oldVal) {
          if (newVal !== params) update(newVal);
        }, true);
        params = scope.$eval(ref.paramExpr);
      }
      update();

      if (isForm) return;

      element.bind("click", function(e) {
        var button = e.which || e.button;
        if ( !(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target')) ) {
          // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
          var transition = $timeout(function() {
            $state.go(ref.state, params, options);
          });
          e.preventDefault();

          e.preventDefault = function() {
            $timeout.cancel(transition);
          };
        }
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * A directive working alongside ui-sref to add classes to an element when the
 * related ui-sref directive's state is active, and removing them when it is inactive.
 * The primary use-case is to simplify the special appearance of navigation menus
 * relying on `ui-sref`, by having the "active" state's menu button appear different,
 * distinguishing it from the inactive menu items.
 *
 * ui-sref-active can live on the same element as ui-sref or on a parent element. The first
 * ui-sref-active found at the same level or above the ui-sref will be used.
 *
 * Will activate when the ui-sref's target state or any child state is active. If you
 * need to activate only when the ui-sref target state is active and *not* any of
 * it's children, then you will use
 * {@link ui.router.state.directive:ui-sref-active-eq ui-sref-active-eq}
 *
 * @example
 * Given the following template:
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item">
 *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 *
 *
 * When the app state is "app.user" (or any children states), and contains the state parameter "user" with value "bilbobaggins",
 * the resulting HTML will appear as (note the 'active' class):
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item active">
 *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 *
 * The class name is interpolated **once** during the directives link time (any further changes to the
 * interpolated value are ignored).
 *
 * Multiple classes may be specified in a space-separated format:
 * <pre>
 * <ul>
 *   <li ui-sref-active='class1 class2 class3'>
 *     <a ui-sref="app.user">link</a>
 *   </li>
 * </ul>
 * </pre>
 */

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active-eq
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * The same as {@link ui.router.state.directive:ui-sref-active ui-sref-active} but will will only activate
 * when the exact target state used in the `ui-sref` is active; no child states.
 *
 */
$StateRefActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
function $StateRefActiveDirective($state, $stateParams, $interpolate) {
  return  {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      var state, params, activeClass;

      // There probably isn't much point in $observing this
      // uiSrefActive and uiSrefActiveEq share the same directive object with some
      // slight difference in logic routing
      activeClass = $interpolate($attrs.uiSrefActiveEq || $attrs.uiSrefActive || '', false)($scope);

      // Allow uiSref to communicate with uiSrefActive[Equals]
      this.$$setStateInfo = function (newState, newParams) {
        state = $state.get(newState, stateContext($element));
        params = newParams;
        update();
      };

      $scope.$on('$stateChangeSuccess', update);

      // Update route state
      function update() {
        if (isMatch()) {
          $element.addClass(activeClass);
        } else {
          $element.removeClass(activeClass);
        }
      }

      function isMatch() {
        if (typeof $attrs.uiSrefActiveEq !== 'undefined') {
          return $state.$current.self === state && matchesParams();
        } else {
          return $state.includes(state.name) && matchesParams();
        }
      }

      function matchesParams() {
        return !params || equalForKeys(params, $stateParams);
      }
    }]
  };
}

angular.module('ui.router.state')
  .directive('uiSref', $StateRefDirective)
  .directive('uiSrefActive', $StateRefActiveDirective)
  .directive('uiSrefActiveEq', $StateRefActiveDirective);

/**
 * @ngdoc filter
 * @name ui.router.state.filter:isState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")}.
 */
$IsStateFilter.$inject = ['$state'];
function $IsStateFilter($state) {
  return function(state) {
    return $state.is(state);
  };
}

/**
 * @ngdoc filter
 * @name ui.router.state.filter:includedByState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')}.
 */
$IncludedByStateFilter.$inject = ['$state'];
function $IncludedByStateFilter($state) {
  return function(state) {
    return $state.includes(state);
  };
}

angular.module('ui.router.state')
  .filter('isState', $IsStateFilter)
  .filter('includedByState', $IncludedByStateFilter);
})(window, window.angular);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmVuL0RvY3VtZW50cy9hbmd1bGFyLWJyb3dzZXJmeS1tb2R1bGUvYXBwL3NjcmlwdHMvYXBwLmpzIiwiL1VzZXJzL2Jlbi9Eb2N1bWVudHMvYW5ndWxhci1icm93c2VyZnktbW9kdWxlL2FwcC9zY3JpcHRzL2NvbW1vbi9kaXJlY3RpdmVzL2RhdGUuanMiLCIvVXNlcnMvYmVuL0RvY3VtZW50cy9hbmd1bGFyLWJyb3dzZXJmeS1tb2R1bGUvYXBwL3NjcmlwdHMvY29tbW9uL2luZGV4LmpzIiwiL1VzZXJzL2Jlbi9Eb2N1bWVudHMvYW5ndWxhci1icm93c2VyZnktbW9kdWxlL2FwcC9zY3JpcHRzL3JvdXRlcy5qcyIsIi9Vc2Vycy9iZW4vRG9jdW1lbnRzL2FuZ3VsYXItYnJvd3NlcmZ5LW1vZHVsZS9ub2RlX21vZHVsZXMvYW5ndWxhci11aS1yb3V0ZXIvcmVsZWFzZS9hbmd1bGFyLXVpLXJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuYW5ndWxhciA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuYW5ndWxhciA6IG51bGwpO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgYW5ndWxhckJyb3dzZXJmeU1vZHVsZUFwcFxuICogQGRlc2NyaXB0aW9uXG4gKiAjIGFuZ3VsYXJCcm93c2VyZnlNb2R1bGVBcHBcbiAqXG4gKiBNYWluIG1vZHVsZSBvZiB0aGUgYXBwbGljYXRpb24uXG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJCcm93c2VyZnlNb2R1bGVBcHAnLCBbXG4gICAgICAgIHJlcXVpcmUoJ2FuZ3VsYXItdWktcm91dGVyJyksXG4gICAgICAgIHJlcXVpcmUoJy4vY29tbW9uJyksXG4vLyAgICAgICAgcmVxdWlyZSgnLi9hcHBsZXMnKSxcbi8vICAgICAgICByZXF1aXJlKCcuL29yYW5nZXMnKVxuICAgIF0pXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcycpKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIGJ1aWxkaXVtLmNvbW1vbi5kYXRlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiAjIGJ1aWxkaXVtLmNvbW1vbi5kYXRlXG4gKiBDcmVhdGUgYSBkaXYgdy8gYW4gSVNPIHRpbWVzdGFtcFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gRGF0ZURpcmVjdGl2ZSAoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHt9O1xuXG4gICAgZGlyZWN0aXZlLnJlc3RyaWN0ID0gJ0UnO1xuICAgIGRpcmVjdGl2ZS50ZW1wbGF0ZSA9ICc8ZGl2PkNvbW1vbjogJyArIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSArICc8L2Rpdj4nO1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuYW5ndWxhciA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuYW5ndWxhciA6IG51bGwpO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgY3JlZGl0UmV0cmlldmVyLmNvbW1vblxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogIyBjcmVkaXRSZXRyaWV2ZXIuY29tbW9uXG4gKiBDb250YWlucyBjb2RlIGNvbW1vbiBhY3Jvc3MgbW9kdWxlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcbiAgICAubW9kdWxlKCdidWlsZGl1bS5jb21tb24nLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdiZC5kYXRlJywgcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2RhdGUnKSlcbiAgICAubmFtZTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbi8qIEBuZ0luamVjdCAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnaW5kZXgnLCB7XG4gICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc2NyaXB0cy9jb21tb24vdmlld3MvaW5kZXguaHRtbCdcbiAgICAgICAgfSk7XG59O1xubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJGxvY2F0aW9uUHJvdmlkZXJcIl07XG5cbiIsIi8qKlxuICogU3RhdGUtYmFzZWQgcm91dGluZyBmb3IgQW5ndWxhckpTXG4gKiBAdmVyc2lvbiB2MC4yLjExXG4gKiBAbGluayBodHRwOi8vYW5ndWxhci11aS5naXRodWIuY29tL1xuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UsIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuLyogY29tbW9uanMgcGFja2FnZSBtYW5hZ2VyIHN1cHBvcnQgKGVnIGNvbXBvbmVudGpzKSAqL1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgPT09IGV4cG9ydHMpe1xuICBtb2R1bGUuZXhwb3J0cyA9ICd1aS5yb3V0ZXInO1xufVxuXG4oZnVuY3Rpb24gKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7XG4vKmpzaGludCBnbG9iYWxzdHJpY3Q6dHJ1ZSovXG4vKmdsb2JhbCBhbmd1bGFyOmZhbHNlKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGlzRGVmaW5lZCA9IGFuZ3VsYXIuaXNEZWZpbmVkLFxuICAgIGlzRnVuY3Rpb24gPSBhbmd1bGFyLmlzRnVuY3Rpb24sXG4gICAgaXNTdHJpbmcgPSBhbmd1bGFyLmlzU3RyaW5nLFxuICAgIGlzT2JqZWN0ID0gYW5ndWxhci5pc09iamVjdCxcbiAgICBpc0FycmF5ID0gYW5ndWxhci5pc0FycmF5LFxuICAgIGZvckVhY2ggPSBhbmd1bGFyLmZvckVhY2gsXG4gICAgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQsXG4gICAgY29weSA9IGFuZ3VsYXIuY29weTtcblxuZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQsIGV4dHJhKSB7XG4gIHJldHVybiBleHRlbmQobmV3IChleHRlbmQoZnVuY3Rpb24oKSB7fSwgeyBwcm90b3R5cGU6IHBhcmVudCB9KSkoKSwgZXh0cmEpO1xufVxuXG5mdW5jdGlvbiBtZXJnZShkc3QpIHtcbiAgZm9yRWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogIT09IGRzdCkge1xuICAgICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFkc3QuaGFzT3duUHJvcGVydHkoa2V5KSkgZHN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkc3Q7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNvbW1vbiBhbmNlc3RvciBwYXRoIGJldHdlZW4gdHdvIHN0YXRlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZmlyc3QgVGhlIGZpcnN0IHN0YXRlLlxuICogQHBhcmFtIHtPYmplY3R9IHNlY29uZCBUaGUgc2Vjb25kIHN0YXRlLlxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2Ygc3RhdGUgbmFtZXMgaW4gZGVzY2VuZGluZyBvcmRlciwgbm90IGluY2x1ZGluZyB0aGUgcm9vdC5cbiAqL1xuZnVuY3Rpb24gYW5jZXN0b3JzKGZpcnN0LCBzZWNvbmQpIHtcbiAgdmFyIHBhdGggPSBbXTtcblxuICBmb3IgKHZhciBuIGluIGZpcnN0LnBhdGgpIHtcbiAgICBpZiAoZmlyc3QucGF0aFtuXSAhPT0gc2Vjb25kLnBhdGhbbl0pIGJyZWFrO1xuICAgIHBhdGgucHVzaChmaXJzdC5wYXRoW25dKTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cblxuLyoqXG4gKiBJRTgtc2FmZSB3cmFwcGVyIGZvciBgT2JqZWN0LmtleXMoKWAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBBIEphdmFTY3JpcHQgb2JqZWN0LlxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgdGhlIGtleXMgb2YgdGhlIG9iamVjdCBhcyBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0S2V5cyhvYmplY3QpIHtcbiAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGFuZ3VsYXIuZm9yRWFjaChvYmplY3QsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSUU4LXNhZmUgd3JhcHBlciBmb3IgYEFycmF5LnByb3RvdHlwZS5pbmRleE9mKClgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IEEgSmF2YVNjcmlwdCBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQSB2YWx1ZSB0byBzZWFyY2ggdGhlIGFycmF5IGZvci5cbiAqIEByZXR1cm4ge051bWJlcn0gUmV0dXJucyB0aGUgYXJyYXkgaW5kZXggdmFsdWUgb2YgYHZhbHVlYCwgb3IgYC0xYCBpZiBub3QgcHJlc2VudC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTZWFyY2goYXJyYXksIHZhbHVlKSB7XG4gIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIHJldHVybiBhcnJheS5pbmRleE9mKHZhbHVlLCBOdW1iZXIoYXJndW1lbnRzWzJdKSB8fCAwKTtcbiAgfVxuICB2YXIgbGVuID0gYXJyYXkubGVuZ3RoID4+PiAwLCBmcm9tID0gTnVtYmVyKGFyZ3VtZW50c1syXSkgfHwgMDtcbiAgZnJvbSA9IChmcm9tIDwgMCkgPyBNYXRoLmNlaWwoZnJvbSkgOiBNYXRoLmZsb29yKGZyb20pO1xuXG4gIGlmIChmcm9tIDwgMCkgZnJvbSArPSBsZW47XG5cbiAgZm9yICg7IGZyb20gPCBsZW47IGZyb20rKykge1xuICAgIGlmIChmcm9tIGluIGFycmF5ICYmIGFycmF5W2Zyb21dID09PSB2YWx1ZSkgcmV0dXJuIGZyb207XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIE1lcmdlcyBhIHNldCBvZiBwYXJhbWV0ZXJzIHdpdGggYWxsIHBhcmFtZXRlcnMgaW5oZXJpdGVkIGJldHdlZW4gdGhlIGNvbW1vbiBwYXJlbnRzIG9mIHRoZVxuICogY3VycmVudCBzdGF0ZSBhbmQgYSBnaXZlbiBkZXN0aW5hdGlvbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY3VycmVudFBhcmFtcyBUaGUgdmFsdWUgb2YgdGhlIGN1cnJlbnQgc3RhdGUgcGFyYW1ldGVycyAoJHN0YXRlUGFyYW1zKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBuZXdQYXJhbXMgVGhlIHNldCBvZiBwYXJhbWV0ZXJzIHdoaWNoIHdpbGwgYmUgY29tcG9zaXRlZCB3aXRoIGluaGVyaXRlZCBwYXJhbXMuXG4gKiBAcGFyYW0ge09iamVjdH0gJGN1cnJlbnQgSW50ZXJuYWwgZGVmaW5pdGlvbiBvZiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIHtPYmplY3R9ICR0byBJbnRlcm5hbCBkZWZpbml0aW9uIG9mIG9iamVjdCByZXByZXNlbnRpbmcgc3RhdGUgdG8gdHJhbnNpdGlvbiB0by5cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdFBhcmFtcyhjdXJyZW50UGFyYW1zLCBuZXdQYXJhbXMsICRjdXJyZW50LCAkdG8pIHtcbiAgdmFyIHBhcmVudHMgPSBhbmNlc3RvcnMoJGN1cnJlbnQsICR0byksIHBhcmVudFBhcmFtcywgaW5oZXJpdGVkID0ge30sIGluaGVyaXRMaXN0ID0gW107XG5cbiAgZm9yICh2YXIgaSBpbiBwYXJlbnRzKSB7XG4gICAgaWYgKCFwYXJlbnRzW2ldLnBhcmFtcykgY29udGludWU7XG4gICAgcGFyZW50UGFyYW1zID0gb2JqZWN0S2V5cyhwYXJlbnRzW2ldLnBhcmFtcyk7XG4gICAgaWYgKCFwYXJlbnRQYXJhbXMubGVuZ3RoKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGogaW4gcGFyZW50UGFyYW1zKSB7XG4gICAgICBpZiAoYXJyYXlTZWFyY2goaW5oZXJpdExpc3QsIHBhcmVudFBhcmFtc1tqXSkgPj0gMCkgY29udGludWU7XG4gICAgICBpbmhlcml0TGlzdC5wdXNoKHBhcmVudFBhcmFtc1tqXSk7XG4gICAgICBpbmhlcml0ZWRbcGFyZW50UGFyYW1zW2pdXSA9IGN1cnJlbnRQYXJhbXNbcGFyZW50UGFyYW1zW2pdXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV4dGVuZCh7fSwgaW5oZXJpdGVkLCBuZXdQYXJhbXMpO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGEgbm9uLXN0cmljdCBjb21wYXJpc29uIG9mIHRoZSBzdWJzZXQgb2YgdHdvIG9iamVjdHMsIGRlZmluZWQgYnkgYSBsaXN0IG9mIGtleXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIGZpcnN0IG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBzZWNvbmQgb2JqZWN0LlxuICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgbGlzdCBvZiBrZXlzIHdpdGhpbiBlYWNoIG9iamVjdCB0byBjb21wYXJlLiBJZiB0aGUgbGlzdCBpcyBlbXB0eSBvciBub3Qgc3BlY2lmaWVkLFxuICogICAgICAgICAgICAgICAgICAgICBpdCBkZWZhdWx0cyB0byB0aGUgbGlzdCBvZiBrZXlzIGluIGBhYC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBrZXlzIG1hdGNoLCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxGb3JLZXlzKGEsIGIsIGtleXMpIHtcbiAgaWYgKCFrZXlzKSB7XG4gICAga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIG4gaW4gYSkga2V5cy5wdXNoKG4pOyAvLyBVc2VkIGluc3RlYWQgb2YgT2JqZWN0LmtleXMoKSBmb3IgSUU4IGNvbXBhdGliaWxpdHlcbiAgfVxuXG4gIGZvciAodmFyIGk9MDsgaTxrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgIGlmIChhW2tdICE9IGJba10pIHJldHVybiBmYWxzZTsgLy8gTm90ICc9PT0nLCB2YWx1ZXMgYXJlbid0IG5lY2Vzc2FyaWx5IG5vcm1hbGl6ZWRcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdWJzZXQgb2YgYW4gb2JqZWN0LCBiYXNlZCBvbiBhIGxpc3Qgb2Yga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBrZXlzXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIGEgc3Vic2V0IG9mIGB2YWx1ZXNgLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJCeUtleXMoa2V5cywgdmFsdWVzKSB7XG4gIHZhciBmaWx0ZXJlZCA9IHt9O1xuXG4gIGZvckVhY2goa2V5cywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBmaWx0ZXJlZFtuYW1lXSA9IHZhbHVlc1tuYW1lXTtcbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJlZDtcbn1cbi8qKlxuICogQG5nZG9jIG92ZXJ2aWV3XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyB1aS5yb3V0ZXIudXRpbCBzdWItbW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYSBkZXBlbmRlbmN5IG9mIG90aGVyIHN1Yi1tb2R1bGVzLiBEbyBub3QgaW5jbHVkZSB0aGlzIG1vZHVsZSBhcyBhIGRlcGVuZGVuY3lcbiAqIGluIHlvdXIgYW5ndWxhciBhcHAgKHVzZSB7QGxpbmsgdWkucm91dGVyfSBtb2R1bGUgaW5zdGVhZCkuXG4gKlxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnLCBbJ25nJ10pO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgdWkucm91dGVyLnJvdXRlclxuICogXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWxcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgdWkucm91dGVyLnJvdXRlciBzdWItbW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYSBkZXBlbmRlbmN5IG9mIG90aGVyIHN1Yi1tb2R1bGVzLiBEbyBub3QgaW5jbHVkZSB0aGlzIG1vZHVsZSBhcyBhIGRlcGVuZGVuY3lcbiAqIGluIHlvdXIgYW5ndWxhciBhcHAgKHVzZSB7QGxpbmsgdWkucm91dGVyfSBtb2R1bGUgaW5zdGVhZCkuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIucm91dGVyJywgWyd1aS5yb3V0ZXIudXRpbCddKTtcblxuLyoqXG4gKiBAbmdkb2Mgb3ZlcnZpZXdcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZVxuICogXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnJvdXRlclxuICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIHVpLnJvdXRlci5zdGF0ZSBzdWItbW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYSBkZXBlbmRlbmN5IG9mIHRoZSBtYWluIHVpLnJvdXRlciBtb2R1bGUuIERvIG5vdCBpbmNsdWRlIHRoaXMgbW9kdWxlIGFzIGEgZGVwZW5kZW5jeVxuICogaW4geW91ciBhbmd1bGFyIGFwcCAodXNlIHtAbGluayB1aS5yb3V0ZXJ9IG1vZHVsZSBpbnN0ZWFkKS5cbiAqIFxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJywgWyd1aS5yb3V0ZXIucm91dGVyJywgJ3VpLnJvdXRlci51dGlsJ10pO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgdWkucm91dGVyXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyB1aS5yb3V0ZXJcbiAqIFxuICogIyMgVGhlIG1haW4gbW9kdWxlIGZvciB1aS5yb3V0ZXIgXG4gKiBUaGVyZSBhcmUgc2V2ZXJhbCBzdWItbW9kdWxlcyBpbmNsdWRlZCB3aXRoIHRoZSB1aS5yb3V0ZXIgbW9kdWxlLCBob3dldmVyIG9ubHkgdGhpcyBtb2R1bGUgaXMgbmVlZGVkXG4gKiBhcyBhIGRlcGVuZGVuY3kgd2l0aGluIHlvdXIgYW5ndWxhciBhcHAuIFRoZSBvdGhlciBtb2R1bGVzIGFyZSBmb3Igb3JnYW5pemF0aW9uIHB1cnBvc2VzLiBcbiAqXG4gKiBUaGUgbW9kdWxlcyBhcmU6XG4gKiAqIHVpLnJvdXRlciAtIHRoZSBtYWluIFwidW1icmVsbGFcIiBtb2R1bGVcbiAqICogdWkucm91dGVyLnJvdXRlciAtIFxuICogXG4gKiAqWW91J2xsIG5lZWQgdG8gaW5jbHVkZSAqKm9ubHkqKiB0aGlzIG1vZHVsZSBhcyB0aGUgZGVwZW5kZW5jeSB3aXRoaW4geW91ciBhbmd1bGFyIGFwcC4qXG4gKiBcbiAqIDxwcmU+XG4gKiA8IWRvY3R5cGUgaHRtbD5cbiAqIDxodG1sIG5nLWFwcD1cIm15QXBwXCI+XG4gKiA8aGVhZD5cbiAqICAgPHNjcmlwdCBzcmM9XCJqcy9hbmd1bGFyLmpzXCI+PC9zY3JpcHQ+XG4gKiAgIDwhLS0gSW5jbHVkZSB0aGUgdWktcm91dGVyIHNjcmlwdCAtLT5cbiAqICAgPHNjcmlwdCBzcmM9XCJqcy9hbmd1bGFyLXVpLXJvdXRlci5taW4uanNcIj48L3NjcmlwdD5cbiAqICAgPHNjcmlwdD5cbiAqICAgICAvLyAuLi5hbmQgYWRkICd1aS5yb3V0ZXInIGFzIGEgZGVwZW5kZW5jeVxuICogICAgIHZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJ10pO1xuICogICA8L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqIDxib2R5PlxuICogPC9ib2R5PlxuICogPC9odG1sPlxuICogPC9wcmU+XG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXInLCBbJ3VpLnJvdXRlci5zdGF0ZSddKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5jb21wYXQnLCBbJ3VpLnJvdXRlciddKTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZVxuICpcbiAqIEByZXF1aXJlcyAkcVxuICogQHJlcXVpcmVzICRpbmplY3RvclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTWFuYWdlcyByZXNvbHV0aW9uIG9mIChhY3ljbGljKSBncmFwaHMgb2YgcHJvbWlzZXMuXG4gKi9cbiRSZXNvbHZlLiRpbmplY3QgPSBbJyRxJywgJyRpbmplY3RvciddO1xuZnVuY3Rpb24gJFJlc29sdmUoICAkcSwgICAgJGluamVjdG9yKSB7XG4gIFxuICB2YXIgVklTSVRfSU5fUFJPR1JFU1MgPSAxLFxuICAgICAgVklTSVRfRE9ORSA9IDIsXG4gICAgICBOT1RISU5HID0ge30sXG4gICAgICBOT19ERVBFTkRFTkNJRVMgPSBbXSxcbiAgICAgIE5PX0xPQ0FMUyA9IE5PVEhJTkcsXG4gICAgICBOT19QQVJFTlQgPSBleHRlbmQoJHEud2hlbihOT1RISU5HKSwgeyAkJHByb21pc2VzOiBOT1RISU5HLCAkJHZhbHVlczogTk9USElORyB9KTtcbiAgXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZSNzdHVkeVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHJlc29sdmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN0dWRpZXMgYSBzZXQgb2YgaW52b2NhYmxlcyB0aGF0IGFyZSBsaWtlbHkgdG8gYmUgdXNlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICogPHByZT5cbiAgICogJHJlc29sdmUuc3R1ZHkoaW52b2NhYmxlcykobG9jYWxzLCBwYXJlbnQsIHNlbGYpXG4gICAqIDwvcHJlPlxuICAgKiBpcyBlcXVpdmFsZW50IHRvXG4gICAqIDxwcmU+XG4gICAqICRyZXNvbHZlLnJlc29sdmUoaW52b2NhYmxlcywgbG9jYWxzLCBwYXJlbnQsIHNlbGYpXG4gICAqIDwvcHJlPlxuICAgKiBidXQgdGhlIGZvcm1lciBpcyBtb3JlIGVmZmljaWVudCAoaW4gZmFjdCBgcmVzb2x2ZWAganVzdCBjYWxscyBgc3R1ZHlgIFxuICAgKiBpbnRlcm5hbGx5KS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGludm9jYWJsZXMgSW52b2NhYmxlIG9iamVjdHNcbiAgICogQHJldHVybiB7ZnVuY3Rpb259IGEgZnVuY3Rpb24gdG8gcGFzcyBpbiBsb2NhbHMsIHBhcmVudCBhbmQgc2VsZlxuICAgKi9cbiAgdGhpcy5zdHVkeSA9IGZ1bmN0aW9uIChpbnZvY2FibGVzKSB7XG4gICAgaWYgKCFpc09iamVjdChpbnZvY2FibGVzKSkgdGhyb3cgbmV3IEVycm9yKFwiJ2ludm9jYWJsZXMnIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICAgIFxuICAgIC8vIFBlcmZvcm0gYSB0b3BvbG9naWNhbCBzb3J0IG9mIGludm9jYWJsZXMgdG8gYnVpbGQgYW4gb3JkZXJlZCBwbGFuXG4gICAgdmFyIHBsYW4gPSBbXSwgY3ljbGUgPSBbXSwgdmlzaXRlZCA9IHt9O1xuICAgIGZ1bmN0aW9uIHZpc2l0KHZhbHVlLCBrZXkpIHtcbiAgICAgIGlmICh2aXNpdGVkW2tleV0gPT09IFZJU0lUX0RPTkUpIHJldHVybjtcbiAgICAgIFxuICAgICAgY3ljbGUucHVzaChrZXkpO1xuICAgICAgaWYgKHZpc2l0ZWRba2V5XSA9PT0gVklTSVRfSU5fUFJPR1JFU1MpIHtcbiAgICAgICAgY3ljbGUuc3BsaWNlKDAsIGN5Y2xlLmluZGV4T2Yoa2V5KSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkN5Y2xpYyBkZXBlbmRlbmN5OiBcIiArIGN5Y2xlLmpvaW4oXCIgLT4gXCIpKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0ZWRba2V5XSA9IFZJU0lUX0lOX1BST0dSRVNTO1xuICAgICAgXG4gICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHBsYW4ucHVzaChrZXksIFsgZnVuY3Rpb24oKSB7IHJldHVybiAkaW5qZWN0b3IuZ2V0KHZhbHVlKTsgfV0sIE5PX0RFUEVOREVOQ0lFUyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGFyYW1zID0gJGluamVjdG9yLmFubm90YXRlKHZhbHVlKTtcbiAgICAgICAgZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgIGlmIChwYXJhbSAhPT0ga2V5ICYmIGludm9jYWJsZXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB2aXNpdChpbnZvY2FibGVzW3BhcmFtXSwgcGFyYW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcGxhbi5wdXNoKGtleSwgdmFsdWUsIHBhcmFtcyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGN5Y2xlLnBvcCgpO1xuICAgICAgdmlzaXRlZFtrZXldID0gVklTSVRfRE9ORTtcbiAgICB9XG4gICAgZm9yRWFjaChpbnZvY2FibGVzLCB2aXNpdCk7XG4gICAgaW52b2NhYmxlcyA9IGN5Y2xlID0gdmlzaXRlZCA9IG51bGw7IC8vIHBsYW4gaXMgYWxsIHRoYXQncyByZXF1aXJlZFxuICAgIFxuICAgIGZ1bmN0aW9uIGlzUmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiB2YWx1ZS50aGVuICYmIHZhbHVlLiQkcHJvbWlzZXM7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiAobG9jYWxzLCBwYXJlbnQsIHNlbGYpIHtcbiAgICAgIGlmIChpc1Jlc29sdmUobG9jYWxzKSAmJiBzZWxmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2VsZiA9IHBhcmVudDsgcGFyZW50ID0gbG9jYWxzOyBsb2NhbHMgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKCFsb2NhbHMpIGxvY2FscyA9IE5PX0xPQ0FMUztcbiAgICAgIGVsc2UgaWYgKCFpc09iamVjdChsb2NhbHMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidsb2NhbHMnIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICAgICAgfSAgICAgICBcbiAgICAgIGlmICghcGFyZW50KSBwYXJlbnQgPSBOT19QQVJFTlQ7XG4gICAgICBlbHNlIGlmICghaXNSZXNvbHZlKHBhcmVudCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3BhcmVudCcgbXVzdCBiZSBhIHByb21pc2UgcmV0dXJuZWQgYnkgJHJlc29sdmUucmVzb2x2ZSgpXCIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBUbyBjb21wbGV0ZSB0aGUgb3ZlcmFsbCByZXNvbHV0aW9uLCB3ZSBoYXZlIHRvIHdhaXQgZm9yIHRoZSBwYXJlbnRcbiAgICAgIC8vIHByb21pc2UgYW5kIGZvciB0aGUgcHJvbWlzZSBmb3IgZWFjaCBpbnZva2FibGUgaW4gb3VyIHBsYW4uXG4gICAgICB2YXIgcmVzb2x1dGlvbiA9ICRxLmRlZmVyKCksXG4gICAgICAgICAgcmVzdWx0ID0gcmVzb2x1dGlvbi5wcm9taXNlLFxuICAgICAgICAgIHByb21pc2VzID0gcmVzdWx0LiQkcHJvbWlzZXMgPSB7fSxcbiAgICAgICAgICB2YWx1ZXMgPSBleHRlbmQoe30sIGxvY2FscyksXG4gICAgICAgICAgd2FpdCA9IDEgKyBwbGFuLmxlbmd0aC8zLFxuICAgICAgICAgIG1lcmdlZCA9IGZhbHNlO1xuICAgICAgICAgIFxuICAgICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgICAgLy8gTWVyZ2UgcGFyZW50IHZhbHVlcyB3ZSBoYXZlbid0IGdvdCB5ZXQgYW5kIHB1Ymxpc2ggb3VyIG93biAkJHZhbHVlc1xuICAgICAgICBpZiAoIS0td2FpdCkge1xuICAgICAgICAgIGlmICghbWVyZ2VkKSBtZXJnZSh2YWx1ZXMsIHBhcmVudC4kJHZhbHVlcyk7IFxuICAgICAgICAgIHJlc3VsdC4kJHZhbHVlcyA9IHZhbHVlcztcbiAgICAgICAgICByZXN1bHQuJCRwcm9taXNlcyA9IHRydWU7IC8vIGtlZXAgZm9yIGlzUmVzb2x2ZSgpXG4gICAgICAgICAgZGVsZXRlIHJlc3VsdC4kJGluaGVyaXRlZFZhbHVlcztcbiAgICAgICAgICByZXNvbHV0aW9uLnJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBmYWlsKHJlYXNvbikge1xuICAgICAgICByZXN1bHQuJCRmYWlsdXJlID0gcmVhc29uO1xuICAgICAgICByZXNvbHV0aW9uLnJlamVjdChyZWFzb24pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBTaG9ydC1jaXJjdWl0IGlmIHBhcmVudCBoYXMgYWxyZWFkeSBmYWlsZWRcbiAgICAgIGlmIChpc0RlZmluZWQocGFyZW50LiQkZmFpbHVyZSkpIHtcbiAgICAgICAgZmFpbChwYXJlbnQuJCRmYWlsdXJlKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHBhcmVudC4kJGluaGVyaXRlZFZhbHVlcykge1xuICAgICAgICBtZXJnZSh2YWx1ZXMsIHBhcmVudC4kJGluaGVyaXRlZFZhbHVlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1lcmdlIHBhcmVudCB2YWx1ZXMgaWYgdGhlIHBhcmVudCBoYXMgYWxyZWFkeSByZXNvbHZlZCwgb3IgbWVyZ2VcbiAgICAgIC8vIHBhcmVudCBwcm9taXNlcyBhbmQgd2FpdCBpZiB0aGUgcGFyZW50IHJlc29sdmUgaXMgc3RpbGwgaW4gcHJvZ3Jlc3MuXG4gICAgICBpZiAocGFyZW50LiQkdmFsdWVzKSB7XG4gICAgICAgIG1lcmdlZCA9IG1lcmdlKHZhbHVlcywgcGFyZW50LiQkdmFsdWVzKTtcbiAgICAgICAgcmVzdWx0LiQkaW5oZXJpdGVkVmFsdWVzID0gcGFyZW50LiQkdmFsdWVzO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGFyZW50LiQkaW5oZXJpdGVkVmFsdWVzKSB7XG4gICAgICAgICAgcmVzdWx0LiQkaW5oZXJpdGVkVmFsdWVzID0gcGFyZW50LiQkaW5oZXJpdGVkVmFsdWVzO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZXh0ZW5kKHByb21pc2VzLCBwYXJlbnQuJCRwcm9taXNlcyk7XG4gICAgICAgIHBhcmVudC50aGVuKGRvbmUsIGZhaWwpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBQcm9jZXNzIGVhY2ggaW52b2NhYmxlIGluIHRoZSBwbGFuLCBidXQgaWdub3JlIGFueSB3aGVyZSBhIGxvY2FsIG9mIHRoZSBzYW1lIG5hbWUgZXhpc3RzLlxuICAgICAgZm9yICh2YXIgaT0wLCBpaT1wbGFuLmxlbmd0aDsgaTxpaTsgaSs9Mykge1xuICAgICAgICBpZiAobG9jYWxzLmhhc093blByb3BlcnR5KHBsYW5baV0pKSBkb25lKCk7XG4gICAgICAgIGVsc2UgaW52b2tlKHBsYW5baV0sIHBsYW5baSsxXSwgcGxhbltpKzJdKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gaW52b2tlKGtleSwgaW52b2NhYmxlLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgZGVmZXJyZWQgZm9yIHRoaXMgaW52b2NhdGlvbi4gRmFpbHVyZXMgd2lsbCBwcm9wYWdhdGUgdG8gdGhlIHJlc29sdXRpb24gYXMgd2VsbC5cbiAgICAgICAgdmFyIGludm9jYXRpb24gPSAkcS5kZWZlcigpLCB3YWl0UGFyYW1zID0gMDtcbiAgICAgICAgZnVuY3Rpb24gb25mYWlsdXJlKHJlYXNvbikge1xuICAgICAgICAgIGludm9jYXRpb24ucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgZmFpbChyZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdhaXQgZm9yIGFueSBwYXJhbWV0ZXIgdGhhdCB3ZSBoYXZlIGEgcHJvbWlzZSBmb3IgKGVpdGhlciBmcm9tIHBhcmVudCBvciBmcm9tIHRoaXNcbiAgICAgICAgLy8gcmVzb2x2ZTsgaW4gdGhhdCBjYXNlIHN0dWR5KCkgd2lsbCBoYXZlIG1hZGUgc3VyZSBpdCdzIG9yZGVyZWQgYmVmb3JlIHVzIGluIHRoZSBwbGFuKS5cbiAgICAgICAgZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIChkZXApIHtcbiAgICAgICAgICBpZiAocHJvbWlzZXMuaGFzT3duUHJvcGVydHkoZGVwKSAmJiAhbG9jYWxzLmhhc093blByb3BlcnR5KGRlcCkpIHtcbiAgICAgICAgICAgIHdhaXRQYXJhbXMrKztcbiAgICAgICAgICAgIHByb21pc2VzW2RlcF0udGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgIHZhbHVlc1tkZXBdID0gcmVzdWx0O1xuICAgICAgICAgICAgICBpZiAoISgtLXdhaXRQYXJhbXMpKSBwcm9jZWVkKCk7XG4gICAgICAgICAgICB9LCBvbmZhaWx1cmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghd2FpdFBhcmFtcykgcHJvY2VlZCgpO1xuICAgICAgICBmdW5jdGlvbiBwcm9jZWVkKCkge1xuICAgICAgICAgIGlmIChpc0RlZmluZWQocmVzdWx0LiQkZmFpbHVyZSkpIHJldHVybjtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaW52b2NhdGlvbi5yZXNvbHZlKCRpbmplY3Rvci5pbnZva2UoaW52b2NhYmxlLCBzZWxmLCB2YWx1ZXMpKTtcbiAgICAgICAgICAgIGludm9jYXRpb24ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgdmFsdWVzW2tleV0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0sIG9uZmFpbHVyZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgb25mYWlsdXJlKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQdWJsaXNoIHByb21pc2Ugc3luY2hyb25vdXNseTsgaW52b2NhdGlvbnMgZnVydGhlciBkb3duIGluIHRoZSBwbGFuIG1heSBkZXBlbmQgb24gaXQuXG4gICAgICAgIHByb21pc2VzW2tleV0gPSBpbnZvY2F0aW9uLnByb21pc2U7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHJlc29sdmUjcmVzb2x2ZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHJlc29sdmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc29sdmVzIGEgc2V0IG9mIGludm9jYWJsZXMuIEFuIGludm9jYWJsZSBpcyBhIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgdmlhIFxuICAgKiBgJGluamVjdG9yLmludm9rZSgpYCwgYW5kIGNhbiBoYXZlIGFuIGFyYml0cmFyeSBudW1iZXIgb2YgZGVwZW5kZW5jaWVzLiBcbiAgICogQW4gaW52b2NhYmxlIGNhbiBlaXRoZXIgcmV0dXJuIGEgdmFsdWUgZGlyZWN0bHksXG4gICAqIG9yIGEgYCRxYCBwcm9taXNlLiBJZiBhIHByb21pc2UgaXMgcmV0dXJuZWQgaXQgd2lsbCBiZSByZXNvbHZlZCBhbmQgdGhlIFxuICAgKiByZXN1bHRpbmcgdmFsdWUgd2lsbCBiZSB1c2VkIGluc3RlYWQuIERlcGVuZGVuY2llcyBvZiBpbnZvY2FibGVzIGFyZSByZXNvbHZlZCBcbiAgICogKGluIHRoaXMgb3JkZXIgb2YgcHJlY2VkZW5jZSlcbiAgICpcbiAgICogLSBmcm9tIHRoZSBzcGVjaWZpZWQgYGxvY2Fsc2BcbiAgICogLSBmcm9tIGFub3RoZXIgaW52b2NhYmxlIHRoYXQgaXMgcGFydCBvZiB0aGlzIGAkcmVzb2x2ZWAgY2FsbFxuICAgKiAtIGZyb20gYW4gaW52b2NhYmxlIHRoYXQgaXMgaW5oZXJpdGVkIGZyb20gYSBgcGFyZW50YCBjYWxsIHRvIGAkcmVzb2x2ZWAgXG4gICAqICAgKG9yIHJlY3Vyc2l2ZWx5XG4gICAqIC0gZnJvbSBhbnkgYW5jZXN0b3IgYCRyZXNvbHZlYCBvZiB0aGF0IHBhcmVudCkuXG4gICAqXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgb2YgYCRyZXNvbHZlYCBpcyBhIHByb21pc2UgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIFxuICAgKiAoaW4gdGhpcyBvcmRlciBvZiBwcmVjZWRlbmNlKVxuICAgKlxuICAgKiAtIGFueSBgbG9jYWxzYCAoaWYgc3BlY2lmaWVkKVxuICAgKiAtIHRoZSByZXNvbHZlZCByZXR1cm4gdmFsdWVzIG9mIGFsbCBpbmplY3RhYmxlc1xuICAgKiAtIGFueSB2YWx1ZXMgaW5oZXJpdGVkIGZyb20gYSBgcGFyZW50YCBjYWxsIHRvIGAkcmVzb2x2ZWAgKGlmIHNwZWNpZmllZClcbiAgICpcbiAgICogVGhlIHByb21pc2Ugd2lsbCByZXNvbHZlIGFmdGVyIHRoZSBgcGFyZW50YCBwcm9taXNlIChpZiBhbnkpIGFuZCBhbGwgcHJvbWlzZXMgXG4gICAqIHJldHVybmVkIGJ5IGluamVjdGFibGVzIGhhdmUgYmVlbiByZXNvbHZlZC4gSWYgYW55IGludm9jYWJsZSBcbiAgICogKG9yIGAkaW5qZWN0b3IuaW52b2tlYCkgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgb3IgaWYgYSBwcm9taXNlIHJldHVybmVkIGJ5IGFuIFxuICAgKiBpbnZvY2FibGUgaXMgcmVqZWN0ZWQsIHRoZSBgJHJlc29sdmVgIHByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgXG4gICAqIHNhbWUgZXJyb3IuIEEgcmVqZWN0aW9uIG9mIGEgYHBhcmVudGAgcHJvbWlzZSAoaWYgc3BlY2lmaWVkKSB3aWxsIGxpa2V3aXNlIGJlIFxuICAgKiBwcm9wYWdhdGVkIGltbWVkaWF0ZWx5LiBPbmNlIHRoZSBgJHJlc29sdmVgIHByb21pc2UgaGFzIGJlZW4gcmVqZWN0ZWQsIG5vIFxuICAgKiBmdXJ0aGVyIGludm9jYWJsZXMgd2lsbCBiZSBjYWxsZWQuXG4gICAqIFxuICAgKiBDeWNsaWMgZGVwZW5kZW5jaWVzIGJldHdlZW4gaW52b2NhYmxlcyBhcmUgbm90IHBlcm1pdHRlZCBhbmQgd2lsbCBjYXVlcyBgJHJlc29sdmVgXG4gICAqIHRvIHRocm93IGFuIGVycm9yLiBBcyBhIHNwZWNpYWwgY2FzZSwgYW4gaW5qZWN0YWJsZSBjYW4gZGVwZW5kIG9uIGEgcGFyYW1ldGVyIFxuICAgKiB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGluamVjdGFibGUsIHdoaWNoIHdpbGwgYmUgZnVsZmlsbGVkIGZyb20gdGhlIGBwYXJlbnRgIFxuICAgKiBpbmplY3RhYmxlIG9mIHRoZSBzYW1lIG5hbWUuIFRoaXMgYWxsb3dzIGluaGVyaXRlZCB2YWx1ZXMgdG8gYmUgZGVjb3JhdGVkLiBcbiAgICogTm90ZSB0aGF0IGluIHRoaXMgY2FzZSBhbnkgb3RoZXIgaW5qZWN0YWJsZSBpbiB0aGUgc2FtZSBgJHJlc29sdmVgIHdpdGggdGhlIHNhbWVcbiAgICogZGVwZW5kZW5jeSB3b3VsZCBzZWUgdGhlIGRlY29yYXRlZCB2YWx1ZSwgbm90IHRoZSBpbmhlcml0ZWQgdmFsdWUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBtaXNzaW5nIGRlcGVuZGVuY2llcyAtLSB1bmxpa2UgY3ljbGljIGRlcGVuZGVuY2llcyAtLSB3aWxsIGNhdXNlIGFuIFxuICAgKiAoYXN5bmNocm9ub3VzKSByZWplY3Rpb24gb2YgdGhlIGAkcmVzb2x2ZWAgcHJvbWlzZSByYXRoZXIgdGhhbiBhIChzeW5jaHJvbm91cykgXG4gICAqIGV4Y2VwdGlvbi5cbiAgICpcbiAgICogSW52b2NhYmxlcyBhcmUgaW52b2tlZCBlYWdlcmx5IGFzIHNvb24gYXMgYWxsIGRlcGVuZGVuY2llcyBhcmUgYXZhaWxhYmxlLiBcbiAgICogVGhpcyBpcyB0cnVlIGV2ZW4gZm9yIGRlcGVuZGVuY2llcyBpbmhlcml0ZWQgZnJvbSBhIGBwYXJlbnRgIGNhbGwgdG8gYCRyZXNvbHZlYC5cbiAgICpcbiAgICogQXMgYSBzcGVjaWFsIGNhc2UsIGFuIGludm9jYWJsZSBjYW4gYmUgYSBzdHJpbmcsIGluIHdoaWNoIGNhc2UgaXQgaXMgdGFrZW4gdG8gXG4gICAqIGJlIGEgc2VydmljZSBuYW1lIHRvIGJlIHBhc3NlZCB0byBgJGluamVjdG9yLmdldCgpYC4gVGhpcyBpcyBzdXBwb3J0ZWQgcHJpbWFyaWx5IFxuICAgKiBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgd2l0aCB0aGUgYHJlc29sdmVgIHByb3BlcnR5IG9mIGAkcm91dGVQcm92aWRlcmAgXG4gICAqIHJvdXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGludm9jYWJsZXMgZnVuY3Rpb25zIHRvIGludm9rZSBvciBcbiAgICogYCRpbmplY3RvcmAgc2VydmljZXMgdG8gZmV0Y2guXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsb2NhbHMgIHZhbHVlcyB0byBtYWtlIGF2YWlsYWJsZSB0byB0aGUgaW5qZWN0YWJsZXNcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmVudCAgYSBwcm9taXNlIHJldHVybmVkIGJ5IGFub3RoZXIgY2FsbCB0byBgJHJlc29sdmVgLlxuICAgKiBAcGFyYW0ge29iamVjdH0gc2VsZiAgdGhlIGB0aGlzYCBmb3IgdGhlIGludm9rZWQgbWV0aG9kc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9IFByb21pc2UgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSByZXNvbHZlZCByZXR1cm4gdmFsdWVcbiAgICogb2YgYWxsIGludm9jYWJsZXMsIGFzIHdlbGwgYXMgYW55IGluaGVyaXRlZCBhbmQgbG9jYWwgdmFsdWVzLlxuICAgKi9cbiAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKGludm9jYWJsZXMsIGxvY2FscywgcGFyZW50LCBzZWxmKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R1ZHkoaW52b2NhYmxlcykobG9jYWxzLCBwYXJlbnQsIHNlbGYpO1xuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnKS5zZXJ2aWNlKCckcmVzb2x2ZScsICRSZXNvbHZlKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAqXG4gKiBAcmVxdWlyZXMgJGh0dHBcbiAqIEByZXF1aXJlcyAkdGVtcGxhdGVDYWNoZVxuICogQHJlcXVpcmVzICRpbmplY3RvclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZS4gTWFuYWdlcyBsb2FkaW5nIG9mIHRlbXBsYXRlcy5cbiAqL1xuJFRlbXBsYXRlRmFjdG9yeS4kaW5qZWN0ID0gWyckaHR0cCcsICckdGVtcGxhdGVDYWNoZScsICckaW5qZWN0b3InXTtcbmZ1bmN0aW9uICRUZW1wbGF0ZUZhY3RvcnkoICAkaHR0cCwgICAkdGVtcGxhdGVDYWNoZSwgICAkaW5qZWN0b3IpIHtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbUNvbmZpZ1xuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIGZyb20gYSBjb25maWd1cmF0aW9uIG9iamVjdC4gXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHdoaWNoIHRvIGxvYWQgYSB0ZW1wbGF0ZS4gXG4gICAqIFRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBhcmUgc2VhcmNoIGluIHRoZSBzcGVjaWZpZWQgb3JkZXIsIGFuZCB0aGUgZmlyc3Qgb25lIFxuICAgKiB0aGF0IGlzIGRlZmluZWQgaXMgdXNlZCB0byBjcmVhdGUgdGhlIHRlbXBsYXRlOlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGNvbmZpZy50ZW1wbGF0ZSBodG1sIHN0cmluZyB0ZW1wbGF0ZSBvciBmdW5jdGlvbiB0byBcbiAgICogbG9hZCB2aWEge0BsaW5rIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVN0cmluZyBmcm9tU3RyaW5nfS5cbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBjb25maWcudGVtcGxhdGVVcmwgdXJsIHRvIGxvYWQgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgXG4gICAqIHRoZSB1cmwgdG8gbG9hZCB2aWEge0BsaW5rIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVVybCBmcm9tVXJsfS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZmlnLnRlbXBsYXRlUHJvdmlkZXIgZnVuY3Rpb24gdG8gaW52b2tlIHZpYSBcbiAgICoge0BsaW5rIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVByb3ZpZGVyIGZyb21Qcm92aWRlcn0uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgIFBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsb2NhbHMgTG9jYWxzIHRvIHBhc3MgdG8gYGludm9rZWAgaWYgdGhlIHRlbXBsYXRlIGlzIGxvYWRlZCBcbiAgICogdmlhIGEgYHRlbXBsYXRlUHJvdmlkZXJgLiBEZWZhdWx0cyB0byBgeyBwYXJhbXM6IHBhcmFtcyB9YC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfG9iamVjdH0gIFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgZm9yIFxuICAgKiB0aGF0IHN0cmluZyxvciBgbnVsbGAgaWYgbm8gdGVtcGxhdGUgaXMgY29uZmlndXJlZC5cbiAgICovXG4gIHRoaXMuZnJvbUNvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcsIHBhcmFtcywgbG9jYWxzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzRGVmaW5lZChjb25maWcudGVtcGxhdGUpID8gdGhpcy5mcm9tU3RyaW5nKGNvbmZpZy50ZW1wbGF0ZSwgcGFyYW1zKSA6XG4gICAgICBpc0RlZmluZWQoY29uZmlnLnRlbXBsYXRlVXJsKSA/IHRoaXMuZnJvbVVybChjb25maWcudGVtcGxhdGVVcmwsIHBhcmFtcykgOlxuICAgICAgaXNEZWZpbmVkKGNvbmZpZy50ZW1wbGF0ZVByb3ZpZGVyKSA/IHRoaXMuZnJvbVByb3ZpZGVyKGNvbmZpZy50ZW1wbGF0ZVByb3ZpZGVyLCBwYXJhbXMsIGxvY2FscykgOlxuICAgICAgbnVsbFxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21TdHJpbmdcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHRlbXBsYXRlIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgZnVuY3Rpb24gdGhhdCBcbiAgICogcmV0dXJucyBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ3xvYmplY3R9IFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgZm9yIHRoYXQgXG4gICAqIHN0cmluZy5cbiAgICovXG4gIHRoaXMuZnJvbVN0cmluZyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGVtcGxhdGUpID8gdGVtcGxhdGUocGFyYW1zKSA6IHRlbXBsYXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tVXJsXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqIFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTG9hZHMgYSB0ZW1wbGF0ZSBmcm9tIHRoZSBhIFVSTCB2aWEgYCRodHRwYCBhbmQgYCR0ZW1wbGF0ZUNhY2hlYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8RnVuY3Rpb259IHVybCB1cmwgb2YgdGhlIHRlbXBsYXRlIHRvIGxvYWQsIG9yIGEgZnVuY3Rpb24gXG4gICAqIHRoYXQgcmV0dXJucyBhIHVybC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBQYXJhbWV0ZXJzIHRvIHBhc3MgdG8gdGhlIHVybCBmdW5jdGlvbi5cbiAgICogQHJldHVybiB7c3RyaW5nfFByb21pc2UuPHN0cmluZz59IFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgXG4gICAqIGZvciB0aGF0IHN0cmluZy5cbiAgICovXG4gIHRoaXMuZnJvbVVybCA9IGZ1bmN0aW9uICh1cmwsIHBhcmFtcykge1xuICAgIGlmIChpc0Z1bmN0aW9uKHVybCkpIHVybCA9IHVybChwYXJhbXMpO1xuICAgIGlmICh1cmwgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgZWxzZSByZXR1cm4gJGh0dHBcbiAgICAgICAgLmdldCh1cmwsIHsgY2FjaGU6ICR0ZW1wbGF0ZUNhY2hlIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5kYXRhOyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVByb3ZpZGVyXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgYnkgaW52b2tpbmcgYW4gaW5qZWN0YWJsZSBwcm92aWRlciBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJvdmlkZXIgRnVuY3Rpb24gdG8gaW52b2tlIHZpYSBgJGluamVjdG9yLmludm9rZWBcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBQYXJhbWV0ZXJzIGZvciB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhbHMgTG9jYWxzIHRvIHBhc3MgdG8gYGludm9rZWAuIERlZmF1bHRzIHRvIFxuICAgKiBgeyBwYXJhbXM6IHBhcmFtcyB9YC5cbiAgICogQHJldHVybiB7c3RyaW5nfFByb21pc2UuPHN0cmluZz59IFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgXG4gICAqIGZvciB0aGF0IHN0cmluZy5cbiAgICovXG4gIHRoaXMuZnJvbVByb3ZpZGVyID0gZnVuY3Rpb24gKHByb3ZpZGVyLCBwYXJhbXMsIGxvY2Fscykge1xuICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHByb3ZpZGVyLCBudWxsLCBsb2NhbHMgfHwgeyBwYXJhbXM6IHBhcmFtcyB9KTtcbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci51dGlsJykuc2VydmljZSgnJHRlbXBsYXRlRmFjdG9yeScsICRUZW1wbGF0ZUZhY3RvcnkpO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTWF0Y2hlcyBVUkxzIGFnYWluc3QgcGF0dGVybnMgYW5kIGV4dHJhY3RzIG5hbWVkIHBhcmFtZXRlcnMgZnJvbSB0aGUgcGF0aCBvciB0aGUgc2VhcmNoXG4gKiBwYXJ0IG9mIHRoZSBVUkwuIEEgVVJMIHBhdHRlcm4gY29uc2lzdHMgb2YgYSBwYXRoIHBhdHRlcm4sIG9wdGlvbmFsbHkgZm9sbG93ZWQgYnkgJz8nIGFuZCBhIGxpc3RcbiAqIG9mIHNlYXJjaCBwYXJhbWV0ZXJzLiBNdWx0aXBsZSBzZWFyY2ggcGFyYW1ldGVyIG5hbWVzIGFyZSBzZXBhcmF0ZWQgYnkgJyYnLiBTZWFyY2ggcGFyYW1ldGVyc1xuICogZG8gbm90IGluZmx1ZW5jZSB3aGV0aGVyIG9yIG5vdCBhIFVSTCBpcyBtYXRjaGVkLCBidXQgdGhlaXIgdmFsdWVzIGFyZSBwYXNzZWQgdGhyb3VnaCBpbnRvXG4gKiB0aGUgbWF0Y2hlZCBwYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjbWV0aG9kc19leGVjIGV4ZWN9LlxuICogXG4gKiBQYXRoIHBhcmFtZXRlciBwbGFjZWhvbGRlcnMgY2FuIGJlIHNwZWNpZmllZCB1c2luZyBzaW1wbGUgY29sb24vY2F0Y2gtYWxsIHN5bnRheCBvciBjdXJseSBicmFjZVxuICogc3ludGF4LCB3aGljaCBvcHRpb25hbGx5IGFsbG93cyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgdGhlIHBhcmFtZXRlciB0byBiZSBzcGVjaWZpZWQ6XG4gKlxuICogKiBgJzonYCBuYW1lIC0gY29sb24gcGxhY2Vob2xkZXJcbiAqICogYCcqJ2AgbmFtZSAtIGNhdGNoLWFsbCBwbGFjZWhvbGRlclxuICogKiBgJ3snIG5hbWUgJ30nYCAtIGN1cmx5IHBsYWNlaG9sZGVyXG4gKiAqIGAneycgbmFtZSAnOicgcmVnZXhwICd9J2AgLSBjdXJseSBwbGFjZWhvbGRlciB3aXRoIHJlZ2V4cC4gU2hvdWxkIHRoZSByZWdleHAgaXRzZWxmIGNvbnRhaW5cbiAqICAgY3VybHkgYnJhY2VzLCB0aGV5IG11c3QgYmUgaW4gbWF0Y2hlZCBwYWlycyBvciBlc2NhcGVkIHdpdGggYSBiYWNrc2xhc2guXG4gKlxuICogUGFyYW1ldGVyIG5hbWVzIG1heSBjb250YWluIG9ubHkgd29yZCBjaGFyYWN0ZXJzIChsYXRpbiBsZXR0ZXJzLCBkaWdpdHMsIGFuZCB1bmRlcnNjb3JlKSBhbmRcbiAqIG11c3QgYmUgdW5pcXVlIHdpdGhpbiB0aGUgcGF0dGVybiAoYWNyb3NzIGJvdGggcGF0aCBhbmQgc2VhcmNoIHBhcmFtZXRlcnMpLiBGb3IgY29sb24gXG4gKiBwbGFjZWhvbGRlcnMgb3IgY3VybHkgcGxhY2Vob2xkZXJzIHdpdGhvdXQgYW4gZXhwbGljaXQgcmVnZXhwLCBhIHBhdGggcGFyYW1ldGVyIG1hdGNoZXMgYW55XG4gKiBudW1iZXIgb2YgY2hhcmFjdGVycyBvdGhlciB0aGFuICcvJy4gRm9yIGNhdGNoLWFsbCBwbGFjZWhvbGRlcnMgdGhlIHBhdGggcGFyYW1ldGVyIG1hdGNoZXNcbiAqIGFueSBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAqIFxuICogRXhhbXBsZXM6XG4gKiBcbiAqICogYCcvaGVsbG8vJ2AgLSBNYXRjaGVzIG9ubHkgaWYgdGhlIHBhdGggaXMgZXhhY3RseSAnL2hlbGxvLycuIFRoZXJlIGlzIG5vIHNwZWNpYWwgdHJlYXRtZW50IGZvclxuICogICB0cmFpbGluZyBzbGFzaGVzLCBhbmQgcGF0dGVybnMgaGF2ZSB0byBtYXRjaCB0aGUgZW50aXJlIHBhdGgsIG5vdCBqdXN0IGEgcHJlZml4LlxuICogKiBgJy91c2VyLzppZCdgIC0gTWF0Y2hlcyAnL3VzZXIvYm9iJyBvciAnL3VzZXIvMTIzNCEhIScgb3IgZXZlbiAnL3VzZXIvJyBidXQgbm90ICcvdXNlcicgb3JcbiAqICAgJy91c2VyL2JvYi9kZXRhaWxzJy4gVGhlIHNlY29uZCBwYXRoIHNlZ21lbnQgd2lsbCBiZSBjYXB0dXJlZCBhcyB0aGUgcGFyYW1ldGVyICdpZCcuXG4gKiAqIGAnL3VzZXIve2lkfSdgIC0gU2FtZSBhcyB0aGUgcHJldmlvdXMgZXhhbXBsZSwgYnV0IHVzaW5nIGN1cmx5IGJyYWNlIHN5bnRheC5cbiAqICogYCcvdXNlci97aWQ6W14vXSp9J2AgLSBTYW1lIGFzIHRoZSBwcmV2aW91cyBleGFtcGxlLlxuICogKiBgJy91c2VyL3tpZDpbMC05YS1mQS1GXXsxLDh9fSdgIC0gU2ltaWxhciB0byB0aGUgcHJldmlvdXMgZXhhbXBsZSwgYnV0IG9ubHkgbWF0Y2hlcyBpZiB0aGUgaWRcbiAqICAgcGFyYW1ldGVyIGNvbnNpc3RzIG9mIDEgdG8gOCBoZXggZGlnaXRzLlxuICogKiBgJy9maWxlcy97cGF0aDouKn0nYCAtIE1hdGNoZXMgYW55IFVSTCBzdGFydGluZyB3aXRoICcvZmlsZXMvJyBhbmQgY2FwdHVyZXMgdGhlIHJlc3Qgb2YgdGhlXG4gKiAgIHBhdGggaW50byB0aGUgcGFyYW1ldGVyICdwYXRoJy5cbiAqICogYCcvZmlsZXMvKnBhdGgnYCAtIGRpdHRvLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuICBUaGUgcGF0dGVybiB0byBjb21waWxlIGludG8gYSBtYXRjaGVyLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAgQSBjb25maWd1cmF0aW9uIG9iamVjdCBoYXNoOlxuICpcbiAqICogYGNhc2VJbnNlbnNpdGl2ZWAgLSBgdHJ1ZWAgaWYgVVJMIG1hdGNoaW5nIHNob3VsZCBiZSBjYXNlIGluc2Vuc2l0aXZlLCBvdGhlcndpc2UgYGZhbHNlYCwgdGhlIGRlZmF1bHQgdmFsdWUgKGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5KSBpcyBgZmFsc2VgLlxuICogKiBgc3RyaWN0YCAtIGBmYWxzZWAgaWYgbWF0Y2hpbmcgYWdhaW5zdCBhIFVSTCB3aXRoIGEgdHJhaWxpbmcgc2xhc2ggc2hvdWxkIGJlIHRyZWF0ZWQgYXMgZXF1aXZhbGVudCB0byBhIFVSTCB3aXRob3V0IGEgdHJhaWxpbmcgc2xhc2gsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYC5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcHJlZml4ICBBIHN0YXRpYyBwcmVmaXggb2YgdGhpcyBwYXR0ZXJuLiBUaGUgbWF0Y2hlciBndWFyYW50ZWVzIHRoYXQgYW55XG4gKiAgIFVSTCBtYXRjaGluZyB0aGlzIG1hdGNoZXIgKGkuZS4gYW55IHN0cmluZyBmb3Igd2hpY2gge0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNtZXRob2RzX2V4ZWMgZXhlYygpfSByZXR1cm5zXG4gKiAgIG5vbi1udWxsKSB3aWxsIHN0YXJ0IHdpdGggdGhpcyBwcmVmaXguXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZSAgVGhlIHBhdHRlcm4gdGhhdCB3YXMgcGFzc2VkIGludG8gdGhlIGNvbnN0cnVjdG9yXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZVBhdGggIFRoZSBwYXRoIHBvcnRpb24gb2YgdGhlIHNvdXJjZSBwcm9wZXJ0eVxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2VTZWFyY2ggIFRoZSBzZWFyY2ggcG9ydGlvbiBvZiB0aGUgc291cmNlIHByb3BlcnR5XG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHJlZ2V4ICBUaGUgY29uc3RydWN0ZWQgcmVnZXggdGhhdCB3aWxsIGJlIHVzZWQgdG8gbWF0Y2ggYWdhaW5zdCB0aGUgdXJsIHdoZW4gXG4gKiAgIGl0IGlzIHRpbWUgdG8gZGV0ZXJtaW5lIHdoaWNoIHVybCB3aWxsIG1hdGNoLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICBOZXcgYFVybE1hdGNoZXJgIG9iamVjdFxuICovXG5mdW5jdGlvbiBVcmxNYXRjaGVyKHBhdHRlcm4sIGNvbmZpZykge1xuICBjb25maWcgPSBhbmd1bGFyLmlzT2JqZWN0KGNvbmZpZykgPyBjb25maWcgOiB7fTtcblxuICAvLyBGaW5kIGFsbCBwbGFjZWhvbGRlcnMgYW5kIGNyZWF0ZSBhIGNvbXBpbGVkIHBhdHRlcm4sIHVzaW5nIGVpdGhlciBjbGFzc2ljIG9yIGN1cmx5IHN5bnRheDpcbiAgLy8gICAnKicgbmFtZVxuICAvLyAgICc6JyBuYW1lXG4gIC8vICAgJ3snIG5hbWUgJ30nXG4gIC8vICAgJ3snIG5hbWUgJzonIHJlZ2V4cCAnfSdcbiAgLy8gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBzb21ld2hhdCBjb21wbGljYXRlZCBkdWUgdG8gdGhlIG5lZWQgdG8gYWxsb3cgY3VybHkgYnJhY2VzXG4gIC8vIGluc2lkZSB0aGUgcmVndWxhciBleHByZXNzaW9uLiBUaGUgcGxhY2Vob2xkZXIgcmVnZXhwIGJyZWFrcyBkb3duIGFzIGZvbGxvd3M6XG4gIC8vICAgIChbOipdKShcXHcrKSAgICAgICAgICAgICAgIGNsYXNzaWMgcGxhY2Vob2xkZXIgKCQxIC8gJDIpXG4gIC8vICAgIFxceyhcXHcrKSg/OlxcOiggLi4uICkpP1xcfSAgIGN1cmx5IGJyYWNlIHBsYWNlaG9sZGVyICgkMykgd2l0aCBvcHRpb25hbCByZWdleHAgLi4uICgkNClcbiAgLy8gICAgKD86IC4uLiB8IC4uLiB8IC4uLiApKyAgICB0aGUgcmVnZXhwIGNvbnNpc3RzIG9mIGFueSBudW1iZXIgb2YgYXRvbXMsIGFuIGF0b20gYmVpbmcgZWl0aGVyXG4gIC8vICAgIFtee31cXFxcXSsgICAgICAgICAgICAgICAgICAtIGFueXRoaW5nIG90aGVyIHRoYW4gY3VybHkgYnJhY2VzIG9yIGJhY2tzbGFzaFxuICAvLyAgICBcXFxcLiAgICAgICAgICAgICAgICAgICAgICAgLSBhIGJhY2tzbGFzaCBlc2NhcGVcbiAgLy8gICAgXFx7KD86W157fVxcXFxdK3xcXFxcLikqXFx9ICAgICAtIGEgbWF0Y2hlZCBzZXQgb2YgY3VybHkgYnJhY2VzIGNvbnRhaW5pbmcgb3RoZXIgYXRvbXNcbiAgdmFyIHBsYWNlaG9sZGVyID0gLyhbOipdKShcXHcrKXxcXHsoXFx3KykoPzpcXDooKD86W157fVxcXFxdK3xcXFxcLnxcXHsoPzpbXnt9XFxcXF0rfFxcXFwuKSpcXH0pKykpP1xcfS9nLFxuICAgICAgY29tcGlsZWQgPSAnXicsIGxhc3QgPSAwLCBtLFxuICAgICAgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzID0gW10sXG4gICAgICBwYXJhbXMgPSB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBbSW50ZXJuYWxdIEdldHMgdGhlIGRlY29kZWQgcmVwcmVzZW50YXRpb24gb2YgYSB2YWx1ZSBpZiB0aGUgdmFsdWUgaXMgZGVmaW5lZCwgb3RoZXJ3aXNlLCByZXR1cm5zIHRoZVxuICAgKiBkZWZhdWx0IHZhbHVlLCB3aGljaCBtYXkgYmUgdGhlIHJlc3VsdCBvZiBhbiBpbmplY3RhYmxlIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gJHZhbHVlKHZhbHVlKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgcmV0dXJuIGlzRGVmaW5lZCh2YWx1ZSkgPyB0aGlzLnR5cGUuZGVjb2RlKHZhbHVlKSA6ICRVcmxNYXRjaGVyRmFjdG9yeS4kJGdldERlZmF1bHRWYWx1ZSh0aGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFBhcmFtZXRlcihpZCwgdHlwZSwgY29uZmlnKSB7XG4gICAgaWYgKCEvXlxcdysoLStcXHcrKSokLy50ZXN0KGlkKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXJhbWV0ZXIgbmFtZSAnXCIgKyBpZCArIFwiJyBpbiBwYXR0ZXJuICdcIiArIHBhdHRlcm4gKyBcIidcIik7XG4gICAgaWYgKHBhcmFtc1tpZF0pIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZSAnXCIgKyBpZCArIFwiJyBpbiBwYXR0ZXJuICdcIiArIHBhdHRlcm4gKyBcIidcIik7XG4gICAgcGFyYW1zW2lkXSA9IGV4dGVuZCh7IHR5cGU6IHR5cGUgfHwgbmV3IFR5cGUoKSwgJHZhbHVlOiAkdmFsdWUgfSwgY29uZmlnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1b3RlUmVnRXhwKHN0cmluZywgcGF0dGVybiwgaXNPcHRpb25hbCkge1xuICAgIHZhciByZXN1bHQgPSBzdHJpbmcucmVwbGFjZSgvW1xcXFxcXFtcXF1cXF4kKis/LigpfHt9XS9nLCBcIlxcXFwkJlwiKTtcbiAgICBpZiAoIXBhdHRlcm4pIHJldHVybiByZXN1bHQ7XG4gICAgdmFyIGZsYWcgPSBpc09wdGlvbmFsID8gJz8nIDogJyc7XG4gICAgcmV0dXJuIHJlc3VsdCArIGZsYWcgKyAnKCcgKyBwYXR0ZXJuICsgJyknICsgZmxhZztcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcmFtQ29uZmlnKHBhcmFtKSB7XG4gICAgaWYgKCFjb25maWcucGFyYW1zIHx8ICFjb25maWcucGFyYW1zW3BhcmFtXSkgcmV0dXJuIHt9O1xuICAgIHZhciBjZmcgPSBjb25maWcucGFyYW1zW3BhcmFtXTtcbiAgICByZXR1cm4gaXNPYmplY3QoY2ZnKSA/IGNmZyA6IHsgdmFsdWU6IGNmZyB9O1xuICB9XG5cbiAgdGhpcy5zb3VyY2UgPSBwYXR0ZXJuO1xuXG4gIC8vIFNwbGl0IGludG8gc3RhdGljIHNlZ21lbnRzIHNlcGFyYXRlZCBieSBwYXRoIHBhcmFtZXRlciBwbGFjZWhvbGRlcnMuXG4gIC8vIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgaXMgYWx3YXlzIDEgbW9yZSB0aGFuIHRoZSBudW1iZXIgb2YgcGFyYW1ldGVycy5cbiAgdmFyIGlkLCByZWdleHAsIHNlZ21lbnQsIHR5cGUsIGNmZztcblxuICB3aGlsZSAoKG0gPSBwbGFjZWhvbGRlci5leGVjKHBhdHRlcm4pKSkge1xuICAgIGlkICAgICAgPSBtWzJdIHx8IG1bM107IC8vIElFWzc4XSByZXR1cm5zICcnIGZvciB1bm1hdGNoZWQgZ3JvdXBzIGluc3RlYWQgb2YgbnVsbFxuICAgIHJlZ2V4cCAgPSBtWzRdIHx8IChtWzFdID09ICcqJyA/ICcuKicgOiAnW14vXSonKTtcbiAgICBzZWdtZW50ID0gcGF0dGVybi5zdWJzdHJpbmcobGFzdCwgbS5pbmRleCk7XG4gICAgdHlwZSAgICA9IHRoaXMuJHR5cGVzW3JlZ2V4cF0gfHwgbmV3IFR5cGUoeyBwYXR0ZXJuOiBuZXcgUmVnRXhwKHJlZ2V4cCkgfSk7XG4gICAgY2ZnICAgICA9IHBhcmFtQ29uZmlnKGlkKTtcblxuICAgIGlmIChzZWdtZW50LmluZGV4T2YoJz8nKSA+PSAwKSBicmVhazsgLy8gd2UncmUgaW50byB0aGUgc2VhcmNoIHBhcnRcblxuICAgIGNvbXBpbGVkICs9IHF1b3RlUmVnRXhwKHNlZ21lbnQsIHR5cGUuJHN1YlBhdHRlcm4oKSwgaXNEZWZpbmVkKGNmZy52YWx1ZSkpO1xuICAgIGFkZFBhcmFtZXRlcihpZCwgdHlwZSwgY2ZnKTtcbiAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgIGxhc3QgPSBwbGFjZWhvbGRlci5sYXN0SW5kZXg7XG4gIH1cbiAgc2VnbWVudCA9IHBhdHRlcm4uc3Vic3RyaW5nKGxhc3QpO1xuXG4gIC8vIEZpbmQgYW55IHNlYXJjaCBwYXJhbWV0ZXIgbmFtZXMgYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGxhc3Qgc2VnbWVudFxuICB2YXIgaSA9IHNlZ21lbnQuaW5kZXhPZignPycpO1xuXG4gIGlmIChpID49IDApIHtcbiAgICB2YXIgc2VhcmNoID0gdGhpcy5zb3VyY2VTZWFyY2ggPSBzZWdtZW50LnN1YnN0cmluZyhpKTtcbiAgICBzZWdtZW50ID0gc2VnbWVudC5zdWJzdHJpbmcoMCwgaSk7XG4gICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0dGVybi5zdWJzdHJpbmcoMCwgbGFzdCArIGkpO1xuXG4gICAgLy8gQWxsb3cgcGFyYW1ldGVycyB0byBiZSBzZXBhcmF0ZWQgYnkgJz8nIGFzIHdlbGwgYXMgJyYnIHRvIG1ha2UgY29uY2F0KCkgZWFzaWVyXG4gICAgZm9yRWFjaChzZWFyY2guc3Vic3RyaW5nKDEpLnNwbGl0KC9bJj9dLyksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgYWRkUGFyYW1ldGVyKGtleSwgbnVsbCwgcGFyYW1Db25maWcoa2V5KSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0dGVybjtcbiAgICB0aGlzLnNvdXJjZVNlYXJjaCA9ICcnO1xuICB9XG5cbiAgY29tcGlsZWQgKz0gcXVvdGVSZWdFeHAoc2VnbWVudCkgKyAoY29uZmlnLnN0cmljdCA9PT0gZmFsc2UgPyAnXFwvPycgOiAnJykgKyAnJCc7XG4gIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG5cbiAgdGhpcy5yZWdleHAgPSBuZXcgUmVnRXhwKGNvbXBpbGVkLCBjb25maWcuY2FzZUluc2Vuc2l0aXZlID8gJ2knIDogdW5kZWZpbmVkKTtcbiAgdGhpcy5wcmVmaXggPSBzZWdtZW50c1swXTtcbn1cblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNjb25jYXRcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFJldHVybnMgYSBuZXcgbWF0Y2hlciBmb3IgYSBwYXR0ZXJuIGNvbnN0cnVjdGVkIGJ5IGFwcGVuZGluZyB0aGUgcGF0aCBwYXJ0IGFuZCBhZGRpbmcgdGhlXG4gKiBzZWFyY2ggcGFyYW1ldGVycyBvZiB0aGUgc3BlY2lmaWVkIHBhdHRlcm4gdG8gdGhpcyBwYXR0ZXJuLiBUaGUgY3VycmVudCBwYXR0ZXJuIGlzIG5vdFxuICogbW9kaWZpZWQuIFRoaXMgY2FuIGJlIHVuZGVyc3Rvb2QgYXMgY3JlYXRpbmcgYSBwYXR0ZXJuIGZvciBVUkxzIHRoYXQgYXJlIHJlbGF0aXZlIHRvIChvclxuICogc3VmZml4ZXMgb2YpIHRoZSBjdXJyZW50IHBhdHRlcm4uXG4gKlxuICogQGV4YW1wbGVcbiAqIFRoZSBmb2xsb3dpbmcgdHdvIG1hdGNoZXJzIGFyZSBlcXVpdmFsZW50OlxuICogPHByZT5cbiAqIG5ldyBVcmxNYXRjaGVyKCcvdXNlci97aWR9P3EnKS5jb25jYXQoJy9kZXRhaWxzP2RhdGUnKTtcbiAqIG5ldyBVcmxNYXRjaGVyKCcvdXNlci97aWR9L2RldGFpbHM/cSZkYXRlJyk7XG4gKiA8L3ByZT5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVybiAgVGhlIHBhdHRlcm4gdG8gYXBwZW5kLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAgQW4gb2JqZWN0IGhhc2ggb2YgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYXRjaGVyLlxuICogQHJldHVybnMge1VybE1hdGNoZXJ9ICBBIG1hdGNoZXIgZm9yIHRoZSBjb25jYXRlbmF0ZWQgcGF0dGVybi5cbiAqL1xuVXJsTWF0Y2hlci5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24gKHBhdHRlcm4sIGNvbmZpZykge1xuICAvLyBCZWNhdXNlIG9yZGVyIG9mIHNlYXJjaCBwYXJhbWV0ZXJzIGlzIGlycmVsZXZhbnQsIHdlIGNhbiBhZGQgb3VyIG93biBzZWFyY2hcbiAgLy8gcGFyYW1ldGVycyB0byB0aGUgZW5kIG9mIHRoZSBuZXcgcGF0dGVybi4gUGFyc2UgdGhlIG5ldyBwYXR0ZXJuIGJ5IGl0c2VsZlxuICAvLyBhbmQgdGhlbiBqb2luIHRoZSBiaXRzIHRvZ2V0aGVyLCBidXQgaXQncyBtdWNoIGVhc2llciB0byBkbyB0aGlzIG9uIGEgc3RyaW5nIGxldmVsLlxuICByZXR1cm4gbmV3IFVybE1hdGNoZXIodGhpcy5zb3VyY2VQYXRoICsgcGF0dGVybiArIHRoaXMuc291cmNlU2VhcmNoLCBjb25maWcpO1xufTtcblxuVXJsTWF0Y2hlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnNvdXJjZTtcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjZXhlY1xuICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGVzdHMgdGhlIHNwZWNpZmllZCBwYXRoIGFnYWluc3QgdGhpcyBtYXRjaGVyLCBhbmQgcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgY2FwdHVyZWRcbiAqIHBhcmFtZXRlciB2YWx1ZXMsIG9yIG51bGwgaWYgdGhlIHBhdGggZG9lcyBub3QgbWF0Y2guIFRoZSByZXR1cm5lZCBvYmplY3QgY29udGFpbnMgdGhlIHZhbHVlc1xuICogb2YgYW55IHNlYXJjaCBwYXJhbWV0ZXJzIHRoYXQgYXJlIG1lbnRpb25lZCBpbiB0aGUgcGF0dGVybiwgYnV0IHRoZWlyIHZhbHVlIG1heSBiZSBudWxsIGlmXG4gKiB0aGV5IGFyZSBub3QgcHJlc2VudCBpbiBgc2VhcmNoUGFyYW1zYC4gVGhpcyBtZWFucyB0aGF0IHNlYXJjaCBwYXJhbWV0ZXJzIGFyZSBhbHdheXMgdHJlYXRlZFxuICogYXMgb3B0aW9uYWwuXG4gKlxuICogQGV4YW1wbGVcbiAqIDxwcmU+XG4gKiBuZXcgVXJsTWF0Y2hlcignL3VzZXIve2lkfT9xJnInKS5leGVjKCcvdXNlci9ib2InLCB7XG4gKiAgIHg6ICcxJywgcTogJ2hlbGxvJ1xuICogfSk7XG4gKiAvLyByZXR1cm5zIHsgaWQ6ICdib2InLCBxOiAnaGVsbG8nLCByOiBudWxsIH1cbiAqIDwvcHJlPlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoICBUaGUgVVJMIHBhdGggdG8gbWF0Y2gsIGUuZy4gYCRsb2NhdGlvbi5wYXRoKClgLlxuICogQHBhcmFtIHtPYmplY3R9IHNlYXJjaFBhcmFtcyAgVVJMIHNlYXJjaCBwYXJhbWV0ZXJzLCBlLmcuIGAkbG9jYXRpb24uc2VhcmNoKClgLlxuICogQHJldHVybnMge09iamVjdH0gIFRoZSBjYXB0dXJlZCBwYXJhbWV0ZXIgdmFsdWVzLlxuICovXG5VcmxNYXRjaGVyLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKHBhdGgsIHNlYXJjaFBhcmFtcykge1xuICB2YXIgbSA9IHRoaXMucmVnZXhwLmV4ZWMocGF0aCk7XG4gIGlmICghbSkgcmV0dXJuIG51bGw7XG4gIHNlYXJjaFBhcmFtcyA9IHNlYXJjaFBhcmFtcyB8fCB7fTtcblxuICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbWV0ZXJzKCksIG5Ub3RhbCA9IHBhcmFtcy5sZW5ndGgsXG4gICAgblBhdGggPSB0aGlzLnNlZ21lbnRzLmxlbmd0aCAtIDEsXG4gICAgdmFsdWVzID0ge30sIGksIGNmZywgcGFyYW07XG5cbiAgaWYgKG5QYXRoICE9PSBtLmxlbmd0aCAtIDEpIHRocm93IG5ldyBFcnJvcihcIlVuYmFsYW5jZWQgY2FwdHVyZSBncm91cCBpbiByb3V0ZSAnXCIgKyB0aGlzLnNvdXJjZSArIFwiJ1wiKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgblBhdGg7IGkrKykge1xuICAgIHBhcmFtID0gcGFyYW1zW2ldO1xuICAgIGNmZyA9IHRoaXMucGFyYW1zW3BhcmFtXTtcbiAgICB2YWx1ZXNbcGFyYW1dID0gY2ZnLiR2YWx1ZShtW2kgKyAxXSk7XG4gIH1cbiAgZm9yICgvKiovOyBpIDwgblRvdGFsOyBpKyspIHtcbiAgICBwYXJhbSA9IHBhcmFtc1tpXTtcbiAgICBjZmcgPSB0aGlzLnBhcmFtc1twYXJhbV07XG4gICAgdmFsdWVzW3BhcmFtXSA9IGNmZy4kdmFsdWUoc2VhcmNoUGFyYW1zW3BhcmFtXSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNwYXJhbWV0ZXJzXG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgcGF0aCBhbmQgc2VhcmNoIHBhcmFtZXRlcnMgb2YgdGhpcyBwYXR0ZXJuIGluIGFuIHVuc3BlY2lmaWVkIG9yZGVyLlxuICogXG4gKiBAcmV0dXJucyB7QXJyYXkuPHN0cmluZz59ICBBbiBhcnJheSBvZiBwYXJhbWV0ZXIgbmFtZXMuIE11c3QgYmUgdHJlYXRlZCBhcyByZWFkLW9ubHkuIElmIHRoZVxuICogICAgcGF0dGVybiBoYXMgbm8gcGFyYW1ldGVycywgYW4gZW1wdHkgYXJyYXkgaXMgcmV0dXJuZWQuXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLnBhcmFtZXRlcnMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgaWYgKCFpc0RlZmluZWQocGFyYW0pKSByZXR1cm4gb2JqZWN0S2V5cyh0aGlzLnBhcmFtcyk7XG4gIHJldHVybiB0aGlzLnBhcmFtc1twYXJhbV0gfHwgbnVsbDtcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjdmFsaWRhdGVcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENoZWNrcyBhbiBvYmplY3QgaGFzaCBvZiBwYXJhbWV0ZXJzIHRvIHZhbGlkYXRlIHRoZWlyIGNvcnJlY3RuZXNzIGFjY29yZGluZyB0byB0aGUgcGFyYW1ldGVyXG4gKiB0eXBlcyBvZiB0aGlzIGBVcmxNYXRjaGVyYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSBvYmplY3QgaGFzaCBvZiBwYXJhbWV0ZXJzIHRvIHZhbGlkYXRlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXJhbXNgIHZhbGlkYXRlcywgb3RoZXJ3aXNlIGBmYWxzZWAuXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLnZhbGlkYXRlcyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIHJlc3VsdCA9IHRydWUsIGlzT3B0aW9uYWwsIGNmZywgc2VsZiA9IHRoaXM7XG5cbiAgZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgaWYgKCFzZWxmLnBhcmFtc1trZXldKSByZXR1cm47XG4gICAgY2ZnID0gc2VsZi5wYXJhbXNba2V5XTtcbiAgICBpc09wdGlvbmFsID0gIXZhbCAmJiBpc0RlZmluZWQoY2ZnLnZhbHVlKTtcbiAgICByZXN1bHQgPSByZXN1bHQgJiYgKGlzT3B0aW9uYWwgfHwgY2ZnLnR5cGUuaXModmFsKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNmb3JtYXRcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBVUkwgdGhhdCBtYXRjaGVzIHRoaXMgcGF0dGVybiBieSBzdWJzdGl0dXRpbmcgdGhlIHNwZWNpZmllZCB2YWx1ZXNcbiAqIGZvciB0aGUgcGF0aCBhbmQgc2VhcmNoIHBhcmFtZXRlcnMuIE51bGwgdmFsdWVzIGZvciBwYXRoIHBhcmFtZXRlcnMgYXJlXG4gKiB0cmVhdGVkIGFzIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQGV4YW1wbGVcbiAqIDxwcmU+XG4gKiBuZXcgVXJsTWF0Y2hlcignL3VzZXIve2lkfT9xJykuZm9ybWF0KHsgaWQ6J2JvYicsIHE6J3llcycgfSk7XG4gKiAvLyByZXR1cm5zICcvdXNlci9ib2I/cT15ZXMnXG4gKiA8L3ByZT5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzICB0aGUgdmFsdWVzIHRvIHN1YnN0aXR1dGUgZm9yIHRoZSBwYXJhbWV0ZXJzIGluIHRoaXMgcGF0dGVybi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9ICB0aGUgZm9ybWF0dGVkIFVSTCAocGF0aCBhbmQgb3B0aW9uYWxseSBzZWFyY2ggcGFydCkuXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgdmFyIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cywgcGFyYW1zID0gdGhpcy5wYXJhbWV0ZXJzKCk7XG5cbiAgaWYgKCF2YWx1ZXMpIHJldHVybiBzZWdtZW50cy5qb2luKCcnKS5yZXBsYWNlKCcvLycsICcvJyk7XG5cbiAgdmFyIG5QYXRoID0gc2VnbWVudHMubGVuZ3RoIC0gMSwgblRvdGFsID0gcGFyYW1zLmxlbmd0aCxcbiAgICByZXN1bHQgPSBzZWdtZW50c1swXSwgaSwgc2VhcmNoLCB2YWx1ZSwgcGFyYW0sIGNmZywgYXJyYXk7XG5cbiAgaWYgKCF0aGlzLnZhbGlkYXRlcyh2YWx1ZXMpKSByZXR1cm4gbnVsbDtcblxuICBmb3IgKGkgPSAwOyBpIDwgblBhdGg7IGkrKykge1xuICAgIHBhcmFtID0gcGFyYW1zW2ldO1xuICAgIHZhbHVlID0gdmFsdWVzW3BhcmFtXTtcbiAgICBjZmcgICA9IHRoaXMucGFyYW1zW3BhcmFtXTtcblxuICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSAmJiAoc2VnbWVudHNbaV0gPT09ICcvJyB8fCBzZWdtZW50c1tpICsgMV0gPT09ICcvJykpIGNvbnRpbnVlO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSByZXN1bHQgKz0gZW5jb2RlVVJJQ29tcG9uZW50KGNmZy50eXBlLmVuY29kZSh2YWx1ZSkpO1xuICAgIHJlc3VsdCArPSBzZWdtZW50c1tpICsgMV07XG4gIH1cblxuICBmb3IgKC8qKi87IGkgPCBuVG90YWw7IGkrKykge1xuICAgIHBhcmFtID0gcGFyYW1zW2ldO1xuICAgIHZhbHVlID0gdmFsdWVzW3BhcmFtXTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgY29udGludWU7XG4gICAgYXJyYXkgPSBpc0FycmF5KHZhbHVlKTtcblxuICAgIGlmIChhcnJheSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoZW5jb2RlVVJJQ29tcG9uZW50KS5qb2luKCcmJyArIHBhcmFtICsgJz0nKTtcbiAgICB9XG4gICAgcmVzdWx0ICs9IChzZWFyY2ggPyAnJicgOiAnPycpICsgcGFyYW0gKyAnPScgKyAoYXJyYXkgPyB2YWx1ZSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgIHNlYXJjaCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblVybE1hdGNoZXIucHJvdG90eXBlLiR0eXBlcyA9IHt9O1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VHlwZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogSW1wbGVtZW50cyBhbiBpbnRlcmZhY2UgdG8gZGVmaW5lIGN1c3RvbSBwYXJhbWV0ZXIgdHlwZXMgdGhhdCBjYW4gYmUgZGVjb2RlZCBmcm9tIGFuZCBlbmNvZGVkIHRvXG4gKiBzdHJpbmcgcGFyYW1ldGVycyBtYXRjaGVkIGluIGEgVVJMLiBVc2VkIGJ5IHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIgYFVybE1hdGNoZXJgfVxuICogb2JqZWN0cyB3aGVuIG1hdGNoaW5nIG9yIGZvcm1hdHRpbmcgVVJMcywgb3IgY29tcGFyaW5nIG9yIHZhbGlkYXRpbmcgcGFyYW1ldGVyIHZhbHVlcy5cbiAqXG4gKiBTZWUge0BsaW5rIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeSNtZXRob2RzX3R5cGUgYCR1cmxNYXRjaGVyRmFjdG9yeSN0eXBlKClgfSBmb3IgbW9yZVxuICogaW5mb3JtYXRpb24gb24gcmVnaXN0ZXJpbmcgY3VzdG9tIHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgIEEgY29uZmlndXJhdGlvbiBvYmplY3QgaGFzaCB0aGF0IGluY2x1ZGVzIGFueSBtZXRob2QgaW4gYFR5cGVgJ3MgcHVibGljXG4gKiAgICAgICAgaW50ZXJmYWNlLCBhbmQvb3IgYHBhdHRlcm5gLCB3aGljaCBzaG91bGQgY29udGFpbiBhIGN1c3RvbSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBtYXRjaFxuICogICAgICAgIHN0cmluZyBwYXJhbWV0ZXJzIG9yaWdpbmF0aW5nIGZyb20gYSBVUkwuXG4gKlxuICogQHByb3BlcnR5IHtSZWdFeHB9IHBhdHRlcm4gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuIHVzZWQgdG8gbWF0Y2ggdmFsdWVzIG9mIHRoaXMgdHlwZSB3aGVuXG4gKiAgICAgICAgICAgY29taW5nIGZyb20gYSBzdWJzdHJpbmcgb2YgYSBVUkwuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gIFJldHVybnMgYSBuZXcgYFR5cGVgIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gVHlwZShjb25maWcpIHtcbiAgZXh0ZW5kKHRoaXMsIGNvbmZpZyk7XG59XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlR5cGUjaXNcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlR5cGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERldGVjdHMgd2hldGhlciBhIHZhbHVlIGlzIG9mIGEgcGFydGljdWxhciB0eXBlLiBBY2NlcHRzIGEgbmF0aXZlIChkZWNvZGVkKSB2YWx1ZVxuICogYW5kIGRldGVybWluZXMgd2hldGhlciBpdCBtYXRjaGVzIHRoZSBjdXJyZW50IGBUeXBlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgIE9wdGlvbmFsLiBJZiB0aGUgdHlwZSBjaGVjayBpcyBoYXBwZW5pbmcgaW4gdGhlIGNvbnRleHQgb2YgYSBzcGVjaWZpY1xuICogICAgICAgIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIgYFVybE1hdGNoZXJgfSBvYmplY3QsIHRoaXMgaXMgdGhlIG5hbWUgb2YgdGhlXG4gKiAgICAgICAgcGFyYW1ldGVyIGluIHdoaWNoIGB2YWxgIGlzIHN0b3JlZC4gQ2FuIGJlIHVzZWQgZm9yIG1ldGEtcHJvZ3JhbW1pbmcgb2YgYFR5cGVgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gIFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSB0eXBlLCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqL1xuVHlwZS5wcm90b3R5cGUuaXMgPSBmdW5jdGlvbih2YWwsIGtleSkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlR5cGUjZW5jb2RlXG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpUeXBlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBFbmNvZGVzIGEgY3VzdG9tL25hdGl2ZSB0eXBlIHZhbHVlIHRvIGEgc3RyaW5nIHRoYXQgY2FuIGJlIGVtYmVkZGVkIGluIGEgVVJMLiBOb3RlIHRoYXQgdGhlXG4gKiByZXR1cm4gdmFsdWUgZG9lcyAqbm90KiBuZWVkIHRvIGJlIFVSTC1zYWZlIChpLmUuIHBhc3NlZCB0aHJvdWdoIGBlbmNvZGVVUklDb21wb25lbnQoKWApLCBpdFxuICogb25seSBuZWVkcyB0byBiZSBhIHJlcHJlc2VudGF0aW9uIG9mIGB2YWxgIHRoYXQgaGFzIGJlZW4gY29lcmNlZCB0byBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCAgVGhlIHZhbHVlIHRvIGVuY29kZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgaW4gd2hpY2ggYHZhbGAgaXMgc3RvcmVkLiBDYW4gYmUgdXNlZCBmb3JcbiAqICAgICAgICBtZXRhLXByb2dyYW1taW5nIG9mIGBUeXBlYCBvYmplY3RzLlxuICogQHJldHVybnMge3N0cmluZ30gIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYHZhbGAgdGhhdCBjYW4gYmUgZW5jb2RlZCBpbiBhIFVSTC5cbiAqL1xuVHlwZS5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgcmV0dXJuIHZhbDtcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlR5cGUjZGVjb2RlXG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpUeXBlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb252ZXJ0cyBhIHN0cmluZyBVUkwgcGFyYW1ldGVyIHZhbHVlIHRvIGEgY3VzdG9tL25hdGl2ZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsICBUaGUgVVJMIHBhcmFtZXRlciB2YWx1ZSB0byBkZWNvZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5ICBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIGluIHdoaWNoIGB2YWxgIGlzIHN0b3JlZC4gQ2FuIGJlIHVzZWQgZm9yXG4gKiAgICAgICAgbWV0YS1wcm9ncmFtbWluZyBvZiBgVHlwZWAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHsqfSAgUmV0dXJucyBhIGN1c3RvbSByZXByZXNlbnRhdGlvbiBvZiB0aGUgVVJMIHBhcmFtZXRlciB2YWx1ZS5cbiAqL1xuVHlwZS5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgcmV0dXJuIHZhbDtcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlR5cGUjZXF1YWxzXG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpUeXBlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIGRlY29kZWQgdmFsdWVzIGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gYSAgQSB2YWx1ZSB0byBjb21wYXJlIGFnYWluc3QuXG4gKiBAcGFyYW0geyp9IGIgIEEgdmFsdWUgdG8gY29tcGFyZSBhZ2FpbnN0LlxuICogQHJldHVybnMge0Jvb2xlYW59ICBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50L2VxdWFsLCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqL1xuVHlwZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA9PSBiO1xufTtcblxuVHlwZS5wcm90b3R5cGUuJHN1YlBhdHRlcm4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN1YiA9IHRoaXMucGF0dGVybi50b1N0cmluZygpO1xuICByZXR1cm4gc3ViLnN1YnN0cigxLCBzdWIubGVuZ3RoIC0gMik7XG59O1xuXG5UeXBlLnByb3RvdHlwZS5wYXR0ZXJuID0gLy4qLztcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEZhY3RvcnkgZm9yIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIgYFVybE1hdGNoZXJgfSBpbnN0YW5jZXMuIFRoZSBmYWN0b3J5XG4gKiBpcyBhbHNvIGF2YWlsYWJsZSB0byBwcm92aWRlcnMgdW5kZXIgdGhlIG5hbWUgYCR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyYC5cbiAqL1xuZnVuY3Rpb24gJFVybE1hdGNoZXJGYWN0b3J5KCkge1xuXG4gIHZhciBpc0Nhc2VJbnNlbnNpdGl2ZSA9IGZhbHNlLCBpc1N0cmljdE1vZGUgPSB0cnVlO1xuXG4gIHZhciBlbnF1ZXVlID0gdHJ1ZSwgdHlwZVF1ZXVlID0gW10sIGluamVjdG9yLCBkZWZhdWx0VHlwZXMgPSB7XG4gICAgaW50OiB7XG4gICAgICBkZWNvZGU6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICB9LFxuICAgICAgaXM6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWwpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZSh2YWwudG9TdHJpbmcoKSkgPT09IHZhbDtcbiAgICAgIH0sXG4gICAgICBwYXR0ZXJuOiAvXFxkKy9cbiAgICB9LFxuICAgIGJvb2w6IHtcbiAgICAgIGVuY29kZTogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIHJldHVybiB2YWwgPyAxIDogMDtcbiAgICAgIH0sXG4gICAgICBkZWNvZGU6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMCkgPT09IDAgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9LFxuICAgICAgaXM6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlIHx8IHZhbCA9PT0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgcGF0dGVybjogLzB8MS9cbiAgICB9LFxuICAgIHN0cmluZzoge1xuICAgICAgcGF0dGVybjogL1teXFwvXSovXG4gICAgfSxcbiAgICBkYXRlOiB7XG4gICAgICBlcXVhbHM6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnRvSVNPU3RyaW5nKCkgPT09IGIudG9JU09TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgICBkZWNvZGU6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbCk7XG4gICAgICB9LFxuICAgICAgZW5jb2RlOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgdmFsLmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgKCcwJyArICh2YWwuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMiksXG4gICAgICAgICAgKCcwJyArIHZhbC5nZXREYXRlKCkpLnNsaWNlKC0yKVxuICAgICAgICBdLmpvaW4oXCItXCIpO1xuICAgICAgfSxcbiAgICAgIHBhdHRlcm46IC9bMC05XXs0fS0oPzowWzEtOV18MVswLTJdKS0oPzowWzEtOV18WzEtMl1bMC05XXwzWzAtMV0pL1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZXREZWZhdWx0Q29uZmlnKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdHJpY3Q6IGlzU3RyaWN0TW9kZSxcbiAgICAgIGNhc2VJbnNlbnNpdGl2ZTogaXNDYXNlSW5zZW5zaXRpdmVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJbmplY3RhYmxlKHZhbHVlKSB7XG4gICAgcmV0dXJuIChpc0Z1bmN0aW9uKHZhbHVlKSB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBbSW50ZXJuYWxdIEdldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhIHBhcmFtZXRlciwgd2hpY2ggbWF5IGJlIGFuIGluamVjdGFibGUgZnVuY3Rpb24uXG4gICAqL1xuICAkVXJsTWF0Y2hlckZhY3RvcnkuJCRnZXREZWZhdWx0VmFsdWUgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgICBpZiAoIWlzSW5qZWN0YWJsZShjb25maWcudmFsdWUpKSByZXR1cm4gY29uZmlnLnZhbHVlO1xuICAgIGlmICghaW5qZWN0b3IpIHRocm93IG5ldyBFcnJvcihcIkluamVjdGFibGUgZnVuY3Rpb25zIGNhbm5vdCBiZSBjYWxsZWQgYXQgY29uZmlndXJhdGlvbiB0aW1lXCIpO1xuICAgIHJldHVybiBpbmplY3Rvci5pbnZva2UoY29uZmlnLnZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeSNjYXNlSW5zZW5zaXRpdmVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRGVmaW5lcyB3aGV0aGVyIFVSTCBtYXRjaGluZyBzaG91bGQgYmUgY2FzZSBzZW5zaXRpdmUgKHRoZSBkZWZhdWx0IGJlaGF2aW9yKSwgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlIGBmYWxzZWAgdG8gbWF0Y2ggVVJMIGluIGEgY2FzZSBzZW5zaXRpdmUgbWFubmVyOyBvdGhlcndpc2UgYHRydWVgO1xuICAgKi9cbiAgdGhpcy5jYXNlSW5zZW5zaXRpdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlzQ2FzZUluc2Vuc2l0aXZlID0gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3Rvcnkjc3RyaWN0TW9kZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBEZWZpbmVzIHdoZXRoZXIgVVJMcyBzaG91bGQgbWF0Y2ggdHJhaWxpbmcgc2xhc2hlcywgb3Igbm90ICh0aGUgZGVmYXVsdCBiZWhhdmlvcikuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWUgYGZhbHNlYCB0byBtYXRjaCB0cmFpbGluZyBzbGFzaGVzIGluIFVSTHMsIG90aGVyd2lzZSBgdHJ1ZWAuXG4gICAqL1xuICB0aGlzLnN0cmljdE1vZGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlzU3RyaWN0TW9kZSA9IHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5I2NvbXBpbGVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIgYFVybE1hdGNoZXJgfSBmb3IgdGhlIHNwZWNpZmllZCBwYXR0ZXJuLlxuICAgKiAgIFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVybiAgVGhlIFVSTCBwYXR0ZXJuLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnICBUaGUgY29uZmlnIG9iamVjdCBoYXNoLlxuICAgKiBAcmV0dXJucyB7VXJsTWF0Y2hlcn0gIFRoZSBVcmxNYXRjaGVyLlxuICAgKi9cbiAgdGhpcy5jb21waWxlID0gZnVuY3Rpb24gKHBhdHRlcm4sIGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgVXJsTWF0Y2hlcihwYXR0ZXJuLCBleHRlbmQoZ2V0RGVmYXVsdENvbmZpZygpLCBjb25maWcpKTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeSNpc01hdGNoZXJcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGlzIGEgYFVybE1hdGNoZXJgLCBvciBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgIFRoZSBvYmplY3QgdG8gcGVyZm9ybSB0aGUgdHlwZSBjaGVjayBhZ2FpbnN0LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gIFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3QgbWF0Y2hlcyB0aGUgYFVybE1hdGNoZXJgIGludGVyZmFjZSwgYnlcbiAgICogICAgICAgICAgaW1wbGVtZW50aW5nIGFsbCB0aGUgc2FtZSBtZXRob2RzLlxuICAgKi9cbiAgdGhpcy5pc01hdGNoZXIgPSBmdW5jdGlvbiAobykge1xuICAgIGlmICghaXNPYmplY3QobykpIHJldHVybiBmYWxzZTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIGZvckVhY2goVXJsTWF0Y2hlci5wcm90b3R5cGUsIGZ1bmN0aW9uKHZhbCwgbmFtZSkge1xuICAgICAgaWYgKGlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgJiYgKGlzRGVmaW5lZChvW25hbWVdKSAmJiBpc0Z1bmN0aW9uKG9bbmFtZV0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5I3R5cGVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY3VzdG9tIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlR5cGUgYFR5cGVgfSBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0b1xuICAgKiBnZW5lcmF0ZSBVUkxzIHdpdGggdHlwZWQgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIFRoZSB0eXBlIG5hbWUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBkZWYgIFRoZSB0eXBlIGRlZmluaXRpb24uIFNlZVxuICAgKiAgICAgICAge0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VHlwZSBgVHlwZWB9IGZvciBpbmZvcm1hdGlvbiBvbiB0aGUgdmFsdWVzIGFjY2VwdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAgUmV0dXJucyBgJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXJgLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBUaGlzIGlzIGEgc2ltcGxlIGV4YW1wbGUgb2YgYSBjdXN0b20gdHlwZSB0aGF0IGVuY29kZXMgYW5kIGRlY29kZXMgaXRlbXMgZnJvbSBhblxuICAgKiBhcnJheSwgdXNpbmcgdGhlIGFycmF5IGluZGV4IGFzIHRoZSBVUkwtZW5jb2RlZCB2YWx1ZTpcbiAgICpcbiAgICogPHByZT5cbiAgICogdmFyIGxpc3QgPSBbJ0pvaG4nLCAnUGF1bCcsICdHZW9yZ2UnLCAnUmluZ28nXTtcbiAgICpcbiAgICogJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXIudHlwZSgnbGlzdEl0ZW0nLCB7XG4gICAqICAgZW5jb2RlOiBmdW5jdGlvbihpdGVtKSB7XG4gICAqICAgICAvLyBSZXByZXNlbnQgdGhlIGxpc3QgaXRlbSBpbiB0aGUgVVJMIHVzaW5nIGl0cyBjb3JyZXNwb25kaW5nIGluZGV4XG4gICAqICAgICByZXR1cm4gbGlzdC5pbmRleE9mKGl0ZW0pO1xuICAgKiAgIH0sXG4gICAqICAgZGVjb2RlOiBmdW5jdGlvbihpdGVtKSB7XG4gICAqICAgICAvLyBMb29rIHVwIHRoZSBsaXN0IGl0ZW0gYnkgaW5kZXhcbiAgICogICAgIHJldHVybiBsaXN0W3BhcnNlSW50KGl0ZW0sIDEwKV07XG4gICAqICAgfSxcbiAgICogICBpczogZnVuY3Rpb24oaXRlbSkge1xuICAgKiAgICAgLy8gRW5zdXJlIHRoZSBpdGVtIGlzIHZhbGlkIGJ5IGNoZWNraW5nIHRvIHNlZSB0aGF0IGl0IGFwcGVhcnNcbiAgICogICAgIC8vIGluIHRoZSBsaXN0XG4gICAqICAgICByZXR1cm4gbGlzdC5pbmRleE9mKGl0ZW0pID4gLTE7XG4gICAqICAgfVxuICAgKiB9KTtcbiAgICpcbiAgICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xpc3QnLCB7XG4gICAqICAgdXJsOiBcIi9saXN0L3tpdGVtOmxpc3RJdGVtfVwiLFxuICAgKiAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygkc3RhdGVQYXJhbXMuaXRlbSk7XG4gICAqICAgfVxuICAgKiB9KTtcbiAgICpcbiAgICogLy8gLi4uXG4gICAqXG4gICAqIC8vIENoYW5nZXMgVVJMIHRvICcvbGlzdC8zJywgbG9ncyBcIlJpbmdvXCIgdG8gdGhlIGNvbnNvbGVcbiAgICogJHN0YXRlLmdvKCdsaXN0JywgeyBpdGVtOiBcIlJpbmdvXCIgfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBUaGlzIGlzIGEgbW9yZSBjb21wbGV4IGV4YW1wbGUgb2YgYSB0eXBlIHRoYXQgcmVsaWVzIG9uIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvXG4gICAqIGludGVyYWN0IHdpdGggc2VydmljZXMsIGFuZCB1c2VzIHRoZSBwYXJhbWV0ZXIgbmFtZSBmcm9tIHRoZSBVUkwgdG8gaW5mZXIgaG93IHRvXG4gICAqIGhhbmRsZSBlbmNvZGluZyBhbmQgZGVjb2RpbmcgcGFyYW1ldGVyIHZhbHVlczpcbiAgICpcbiAgICogPHByZT5cbiAgICogLy8gRGVmaW5lcyBhIGN1c3RvbSB0eXBlIHRoYXQgZ2V0cyBhIHZhbHVlIGZyb20gYSBzZXJ2aWNlLFxuICAgKiAvLyB3aGVyZSBlYWNoIHNlcnZpY2UgZ2V0cyBkaWZmZXJlbnQgdHlwZXMgb2YgdmFsdWVzIGZyb21cbiAgICogLy8gYSBiYWNrZW5kIEFQSTpcbiAgICogJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXIudHlwZSgnZGJPYmplY3QnLCBmdW5jdGlvbihVc2VycywgUG9zdHMpIHtcbiAgICpcbiAgICogICAvLyBNYXRjaGVzIHVwIHNlcnZpY2VzIHRvIFVSTCBwYXJhbWV0ZXIgbmFtZXNcbiAgICogICB2YXIgc2VydmljZXMgPSB7XG4gICAqICAgICB1c2VyOiBVc2VycyxcbiAgICogICAgIHBvc3Q6IFBvc3RzXG4gICAqICAgfTtcbiAgICpcbiAgICogICByZXR1cm4ge1xuICAgKiAgICAgZW5jb2RlOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICogICAgICAgLy8gUmVwcmVzZW50IHRoZSBvYmplY3QgaW4gdGhlIFVSTCB1c2luZyBpdHMgdW5pcXVlIElEXG4gICAqICAgICAgIHJldHVybiBvYmplY3QuaWQ7XG4gICAqICAgICB9LFxuICAgKiAgICAgZGVjb2RlOiBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAqICAgICAgIC8vIExvb2sgdXAgdGhlIG9iamVjdCBieSBJRCwgdXNpbmcgdGhlIHBhcmFtZXRlclxuICAgKiAgICAgICAvLyBuYW1lIChrZXkpIHRvIGNhbGwgdGhlIGNvcnJlY3Qgc2VydmljZVxuICAgKiAgICAgICByZXR1cm4gc2VydmljZXNba2V5XS5maW5kQnlJZCh2YWx1ZSk7XG4gICAqICAgICB9LFxuICAgKiAgICAgaXM6IGZ1bmN0aW9uKG9iamVjdCwga2V5KSB7XG4gICAqICAgICAgIC8vIENoZWNrIHRoYXQgb2JqZWN0IGlzIGEgdmFsaWQgZGJPYmplY3RcbiAgICogICAgICAgcmV0dXJuIGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSAmJiBvYmplY3QuaWQgJiYgc2VydmljZXNba2V5XTtcbiAgICogICAgIH1cbiAgICogICAgIGVxdWFsczogZnVuY3Rpb24oYSwgYikge1xuICAgKiAgICAgICAvLyBDaGVjayB0aGUgZXF1YWxpdHkgb2YgZGVjb2RlZCBvYmplY3RzIGJ5IGNvbXBhcmluZ1xuICAgKiAgICAgICAvLyB0aGVpciB1bmlxdWUgSURzXG4gICAqICAgICAgIHJldHVybiBhLmlkID09PSBiLmlkO1xuICAgKiAgICAgfVxuICAgKiAgIH07XG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyBJbiBhIGNvbmZpZygpIGJsb2NrLCB5b3UgY2FuIHRoZW4gYXR0YWNoIFVSTHMgd2l0aFxuICAgKiAvLyB0eXBlLWFubm90YXRlZCBwYXJhbWV0ZXJzOlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlcnMnLCB7XG4gICAqICAgdXJsOiBcIi91c2Vyc1wiLFxuICAgKiAgIC8vIC4uLlxuICAgKiB9KS5zdGF0ZSgndXNlcnMuaXRlbScsIHtcbiAgICogICB1cmw6IFwiL3t1c2VyOmRiT2JqZWN0fVwiLFxuICAgKiAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAqICAgICAvLyAkc3RhdGVQYXJhbXMudXNlciB3aWxsIG5vdyBiZSBhbiBvYmplY3QgcmV0dXJuZWQgZnJvbVxuICAgKiAgICAgLy8gdGhlIFVzZXJzIHNlcnZpY2VcbiAgICogICB9LFxuICAgKiAgIC8vIC4uLlxuICAgKiB9KTtcbiAgICogPC9wcmU+XG4gICAqL1xuICB0aGlzLnR5cGUgPSBmdW5jdGlvbiAobmFtZSwgZGVmKSB7XG4gICAgaWYgKCFpc0RlZmluZWQoZGVmKSkgcmV0dXJuIFVybE1hdGNoZXIucHJvdG90eXBlLiR0eXBlc1tuYW1lXTtcbiAgICB0eXBlUXVldWUucHVzaCh7IG5hbWU6IG5hbWUsIGRlZjogZGVmIH0pO1xuICAgIGlmICghZW5xdWV1ZSkgZmx1c2hUeXBlUXVldWUoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKiBObyBuZWVkIHRvIGRvY3VtZW50ICRnZXQsIHNpbmNlIGl0IHJldHVybnMgdGhpcyAqL1xuICB0aGlzLiRnZXQgPSBbJyRpbmplY3RvcicsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICBpbmplY3RvciA9ICRpbmplY3RvcjtcbiAgICBlbnF1ZXVlID0gZmFsc2U7XG4gICAgVXJsTWF0Y2hlci5wcm90b3R5cGUuJHR5cGVzID0ge307XG4gICAgZmx1c2hUeXBlUXVldWUoKTtcblxuICAgIGZvckVhY2goZGVmYXVsdFR5cGVzLCBmdW5jdGlvbih0eXBlLCBuYW1lKSB7XG4gICAgICBpZiAoIVVybE1hdGNoZXIucHJvdG90eXBlLiR0eXBlc1tuYW1lXSkgVXJsTWF0Y2hlci5wcm90b3R5cGUuJHR5cGVzW25hbWVdID0gbmV3IFR5cGUodHlwZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1dO1xuXG4gIC8vIFRvIGVuc3VyZSBwcm9wZXIgb3JkZXIgb2Ygb3BlcmF0aW9ucyBpbiBvYmplY3QgY29uZmlndXJhdGlvbiwgYW5kIHRvIGFsbG93IGludGVybmFsXG4gIC8vIHR5cGVzIHRvIGJlIG92ZXJyaWRkZW4sIGBmbHVzaFR5cGVRdWV1ZSgpYCB3YWl0cyB1bnRpbCBgJHVybE1hdGNoZXJGYWN0b3J5YCBpcyBpbmplY3RlZFxuICAvLyBiZWZvcmUgYWN0dWFsbHkgd2lyaW5nIHVwIGFuZCBhc3NpZ25pbmcgdHlwZSBkZWZpbml0aW9uc1xuICBmdW5jdGlvbiBmbHVzaFR5cGVRdWV1ZSgpIHtcbiAgICBmb3JFYWNoKHR5cGVRdWV1ZSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgaWYgKFVybE1hdGNoZXIucHJvdG90eXBlLiR0eXBlc1t0eXBlLm5hbWVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgdHlwZSBuYW1lZCAnXCIgKyB0eXBlLm5hbWUgKyBcIicgaGFzIGFscmVhZHkgYmVlbiBkZWZpbmVkLlwiKTtcbiAgICAgIH1cbiAgICAgIHZhciBkZWYgPSBuZXcgVHlwZShpc0luamVjdGFibGUodHlwZS5kZWYpID8gaW5qZWN0b3IuaW52b2tlKHR5cGUuZGVmKSA6IHR5cGUuZGVmKTtcbiAgICAgIFVybE1hdGNoZXIucHJvdG90eXBlLiR0eXBlc1t0eXBlLm5hbWVdID0gZGVmO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIFJlZ2lzdGVyIGFzIGEgcHJvdmlkZXIgc28gaXQncyBhdmFpbGFibGUgdG8gb3RoZXIgcHJvdmlkZXJzXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnKS5wcm92aWRlcignJHVybE1hdGNoZXJGYWN0b3J5JywgJFVybE1hdGNoZXJGYWN0b3J5KTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlclxuICogQHJlcXVpcmVzICRsb2NhdGlvblByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgJHVybFJvdXRlclByb3ZpZGVyYCBoYXMgdGhlIHJlc3BvbnNpYmlsaXR5IG9mIHdhdGNoaW5nIGAkbG9jYXRpb25gLiBcbiAqIFdoZW4gYCRsb2NhdGlvbmAgY2hhbmdlcyBpdCBydW5zIHRocm91Z2ggYSBsaXN0IG9mIHJ1bGVzIG9uZSBieSBvbmUgdW50aWwgYSBcbiAqIG1hdGNoIGlzIGZvdW5kLiBgJHVybFJvdXRlclByb3ZpZGVyYCBpcyB1c2VkIGJlaGluZCB0aGUgc2NlbmVzIGFueXRpbWUgeW91IHNwZWNpZnkgXG4gKiBhIHVybCBpbiBhIHN0YXRlIGNvbmZpZ3VyYXRpb24uIEFsbCB1cmxzIGFyZSBjb21waWxlZCBpbnRvIGEgVXJsTWF0Y2hlciBvYmplY3QuXG4gKlxuICogVGhlcmUgYXJlIHNldmVyYWwgbWV0aG9kcyBvbiBgJHVybFJvdXRlclByb3ZpZGVyYCB0aGF0IG1ha2UgaXQgdXNlZnVsIHRvIHVzZSBkaXJlY3RseVxuICogaW4geW91ciBtb2R1bGUgY29uZmlnLlxuICovXG4kVXJsUm91dGVyUHJvdmlkZXIuJGluamVjdCA9IFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXInXTtcbmZ1bmN0aW9uICRVcmxSb3V0ZXJQcm92aWRlciggICAkbG9jYXRpb25Qcm92aWRlciwgICAkdXJsTWF0Y2hlckZhY3RvcnkpIHtcbiAgdmFyIHJ1bGVzID0gW10sIG90aGVyd2lzZSA9IG51bGwsIGludGVyY2VwdERlZmVycmVkID0gZmFsc2UsIGxpc3RlbmVyO1xuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBhIHByZWZpeCBvZiBhbGwgc3RyaW5ncyBtYXRjaGluZyB0aGUgUmVnRXhwXG4gIGZ1bmN0aW9uIHJlZ0V4cFByZWZpeChyZSkge1xuICAgIHZhciBwcmVmaXggPSAvXlxcXigoPzpcXFxcW15hLXpBLVowLTldfFteXFxcXFxcW1xcXVxcXiQqKz8uKCl8e31dKykqKS8uZXhlYyhyZS5zb3VyY2UpO1xuICAgIHJldHVybiAocHJlZml4ICE9IG51bGwpID8gcHJlZml4WzFdLnJlcGxhY2UoL1xcXFwoLikvZywgXCIkMVwiKSA6ICcnO1xuICB9XG5cbiAgLy8gSW50ZXJwb2xhdGVzIG1hdGNoZWQgdmFsdWVzIGludG8gYSBTdHJpbmcucmVwbGFjZSgpLXN0eWxlIHBhdHRlcm5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUocGF0dGVybiwgbWF0Y2gpIHtcbiAgICByZXR1cm4gcGF0dGVybi5yZXBsYWNlKC9cXCQoXFwkfFxcZHsxLDJ9KS8sIGZ1bmN0aW9uIChtLCB3aGF0KSB7XG4gICAgICByZXR1cm4gbWF0Y2hbd2hhdCA9PT0gJyQnID8gMCA6IE51bWJlcih3aGF0KV07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyI3J1bGVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBEZWZpbmVzIHJ1bGVzIHRoYXQgYXJlIHVzZWQgYnkgYCR1cmxSb3V0ZXJQcm92aWRlcmAgdG8gZmluZCBtYXRjaGVzIGZvclxuICAgKiBzcGVjaWZpYyBVUkxzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLnJvdXRlciddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAqICAgLy8gSGVyZSdzIGFuIGV4YW1wbGUgb2YgaG93IHlvdSBtaWdodCBhbGxvdyBjYXNlIGluc2Vuc2l0aXZlIHVybHNcbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIucnVsZShmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICogICAgIHZhciBwYXRoID0gJGxvY2F0aW9uLnBhdGgoKSxcbiAgICogICAgICAgICBub3JtYWxpemVkID0gcGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgKlxuICAgKiAgICAgaWYgKHBhdGggIT09IG5vcm1hbGl6ZWQpIHtcbiAgICogICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAqICAgICB9XG4gICAqICAgfSk7XG4gICAqIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHJ1bGUgSGFuZGxlciBmdW5jdGlvbiB0aGF0IHRha2VzIGAkaW5qZWN0b3JgIGFuZCBgJGxvY2F0aW9uYFxuICAgKiBzZXJ2aWNlcyBhcyBhcmd1bWVudHMuIFlvdSBjYW4gdXNlIHRoZW0gdG8gcmV0dXJuIGEgdmFsaWQgcGF0aCBhcyBhIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSBgJHVybFJvdXRlclByb3ZpZGVyYCAtIGAkdXJsUm91dGVyUHJvdmlkZXJgIGluc3RhbmNlXG4gICAqL1xuICB0aGlzLnJ1bGUgPSBmdW5jdGlvbiAocnVsZSkge1xuICAgIGlmICghaXNGdW5jdGlvbihydWxlKSkgdGhyb3cgbmV3IEVycm9yKFwiJ3J1bGUnIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICBydWxlcy5wdXNoKHJ1bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyI290aGVyd2lzZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERlZmluZXMgYSBwYXRoIHRoYXQgaXMgdXNlZCB3aGVuIGFuIGludmFsaWQgcm91dGUgaXMgcmVxdWVzdGVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLnJvdXRlciddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAqICAgLy8gaWYgdGhlIHBhdGggZG9lc24ndCBtYXRjaCBhbnkgb2YgdGhlIHVybHMgeW91IGNvbmZpZ3VyZWRcbiAgICogICAvLyBvdGhlcndpc2Ugd2lsbCB0YWtlIGNhcmUgb2Ygcm91dGluZyB0aGUgdXNlciB0byB0aGVcbiAgICogICAvLyBzcGVjaWZpZWQgdXJsXG4gICAqICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2luZGV4Jyk7XG4gICAqXG4gICAqICAgLy8gRXhhbXBsZSBvZiB1c2luZyBmdW5jdGlvbiBydWxlIGFzIHBhcmFtXG4gICAqICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICogICAgIHJldHVybiAnL2EvdmFsaWQvdXJsJztcbiAgICogICB9KTtcbiAgICogfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJ1bGUgVGhlIHVybCBwYXRoIHlvdSB3YW50IHRvIHJlZGlyZWN0IHRvIG9yIGEgZnVuY3Rpb24gXG4gICAqIHJ1bGUgdGhhdCByZXR1cm5zIHRoZSB1cmwgcGF0aC4gVGhlIGZ1bmN0aW9uIHZlcnNpb24gaXMgcGFzc2VkIHR3byBwYXJhbXM6IFxuICAgKiBgJGluamVjdG9yYCBhbmQgYCRsb2NhdGlvbmAgc2VydmljZXMsIGFuZCBtdXN0IHJldHVybiBhIHVybCBzdHJpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gYCR1cmxSb3V0ZXJQcm92aWRlcmAgLSBgJHVybFJvdXRlclByb3ZpZGVyYCBpbnN0YW5jZVxuICAgKi9cbiAgdGhpcy5vdGhlcndpc2UgPSBmdW5jdGlvbiAocnVsZSkge1xuICAgIGlmIChpc1N0cmluZyhydWxlKSkge1xuICAgICAgdmFyIHJlZGlyZWN0ID0gcnVsZTtcbiAgICAgIHJ1bGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiByZWRpcmVjdDsgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWlzRnVuY3Rpb24ocnVsZSkpIHRocm93IG5ldyBFcnJvcihcIidydWxlJyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgb3RoZXJ3aXNlID0gcnVsZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIGZ1bmN0aW9uIGhhbmRsZUlmTWF0Y2goJGluamVjdG9yLCBoYW5kbGVyLCBtYXRjaCkge1xuICAgIGlmICghbWF0Y2gpIHJldHVybiBmYWxzZTtcbiAgICB2YXIgcmVzdWx0ID0gJGluamVjdG9yLmludm9rZShoYW5kbGVyLCBoYW5kbGVyLCB7ICRtYXRjaDogbWF0Y2ggfSk7XG4gICAgcmV0dXJuIGlzRGVmaW5lZChyZXN1bHQpID8gcmVzdWx0IDogdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXIjd2hlblxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGhhbmRsZXIgZm9yIGEgZ2l2ZW4gdXJsIG1hdGNoaW5nLiBpZiBoYW5kbGUgaXMgYSBzdHJpbmcsIGl0IGlzXG4gICAqIHRyZWF0ZWQgYXMgYSByZWRpcmVjdCwgYW5kIGlzIGludGVycG9sYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHN5bnRheCBvZiBtYXRjaFxuICAgKiAoaS5lLiBsaWtlIGBTdHJpbmcucmVwbGFjZSgpYCBmb3IgYFJlZ0V4cGAsIG9yIGxpa2UgYSBgVXJsTWF0Y2hlcmAgcGF0dGVybiBvdGhlcndpc2UpLlxuICAgKlxuICAgKiBJZiB0aGUgaGFuZGxlciBpcyBhIGZ1bmN0aW9uLCBpdCBpcyBpbmplY3RhYmxlLiBJdCBnZXRzIGludm9rZWQgaWYgYCRsb2NhdGlvbmBcbiAgICogbWF0Y2hlcy4gWW91IGhhdmUgdGhlIG9wdGlvbiBvZiBpbmplY3QgdGhlIG1hdGNoIG9iamVjdCBhcyBgJG1hdGNoYC5cbiAgICpcbiAgICogVGhlIGhhbmRsZXIgY2FuIHJldHVyblxuICAgKlxuICAgKiAtICoqZmFsc3kqKiB0byBpbmRpY2F0ZSB0aGF0IHRoZSBydWxlIGRpZG4ndCBtYXRjaCBhZnRlciBhbGwsIHRoZW4gYCR1cmxSb3V0ZXJgXG4gICAqICAgd2lsbCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhbm90aGVyIG9uZSB0aGF0IG1hdGNoZXMuXG4gICAqIC0gKipzdHJpbmcqKiB3aGljaCBpcyB0cmVhdGVkIGFzIGEgcmVkaXJlY3QgYW5kIHBhc3NlZCB0byBgJGxvY2F0aW9uLnVybCgpYFxuICAgKiAtICoqdm9pZCoqIG9yIGFueSAqKnRydXRoeSoqIHZhbHVlIHRlbGxzIGAkdXJsUm91dGVyYCB0aGF0IHRoZSB1cmwgd2FzIGhhbmRsZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXIucm91dGVyJ10pO1xuICAgKlxuICAgKiBhcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbigkc3RhdGUudXJsLCBmdW5jdGlvbiAoJG1hdGNoLCAkc3RhdGVQYXJhbXMpIHtcbiAgICogICAgIGlmICgkc3RhdGUuJGN1cnJlbnQubmF2aWdhYmxlICE9PSBzdGF0ZSB8fFxuICAgKiAgICAgICAgICFlcXVhbEZvcktleXMoJG1hdGNoLCAkc3RhdGVQYXJhbXMpIHtcbiAgICogICAgICAkc3RhdGUudHJhbnNpdGlvblRvKHN0YXRlLCAkbWF0Y2gsIGZhbHNlKTtcbiAgICogICAgIH1cbiAgICogICB9KTtcbiAgICogfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHdoYXQgVGhlIGluY29taW5nIHBhdGggdGhhdCB5b3Ugd2FudCB0byByZWRpcmVjdC5cbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBoYW5kbGVyIFRoZSBwYXRoIHlvdSB3YW50IHRvIHJlZGlyZWN0IHlvdXIgdXNlciB0by5cbiAgICovXG4gIHRoaXMud2hlbiA9IGZ1bmN0aW9uICh3aGF0LCBoYW5kbGVyKSB7XG4gICAgdmFyIHJlZGlyZWN0LCBoYW5kbGVySXNTdHJpbmcgPSBpc1N0cmluZyhoYW5kbGVyKTtcbiAgICBpZiAoaXNTdHJpbmcod2hhdCkpIHdoYXQgPSAkdXJsTWF0Y2hlckZhY3RvcnkuY29tcGlsZSh3aGF0KTtcblxuICAgIGlmICghaGFuZGxlcklzU3RyaW5nICYmICFpc0Z1bmN0aW9uKGhhbmRsZXIpICYmICFpc0FycmF5KGhhbmRsZXIpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCAnaGFuZGxlcicgaW4gd2hlbigpXCIpO1xuXG4gICAgdmFyIHN0cmF0ZWdpZXMgPSB7XG4gICAgICBtYXRjaGVyOiBmdW5jdGlvbiAod2hhdCwgaGFuZGxlcikge1xuICAgICAgICBpZiAoaGFuZGxlcklzU3RyaW5nKSB7XG4gICAgICAgICAgcmVkaXJlY3QgPSAkdXJsTWF0Y2hlckZhY3RvcnkuY29tcGlsZShoYW5kbGVyKTtcbiAgICAgICAgICBoYW5kbGVyID0gWyckbWF0Y2gnLCBmdW5jdGlvbiAoJG1hdGNoKSB7IHJldHVybiByZWRpcmVjdC5mb3JtYXQoJG1hdGNoKTsgfV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlSWZNYXRjaCgkaW5qZWN0b3IsIGhhbmRsZXIsIHdoYXQuZXhlYygkbG9jYXRpb24ucGF0aCgpLCAkbG9jYXRpb24uc2VhcmNoKCkpKTtcbiAgICAgICAgfSwge1xuICAgICAgICAgIHByZWZpeDogaXNTdHJpbmcod2hhdC5wcmVmaXgpID8gd2hhdC5wcmVmaXggOiAnJ1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICByZWdleDogZnVuY3Rpb24gKHdoYXQsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKHdoYXQuZ2xvYmFsIHx8IHdoYXQuc3RpY2t5KSB0aHJvdyBuZXcgRXJyb3IoXCJ3aGVuKCkgUmVnRXhwIG11c3Qgbm90IGJlIGdsb2JhbCBvciBzdGlja3lcIik7XG5cbiAgICAgICAgaWYgKGhhbmRsZXJJc1N0cmluZykge1xuICAgICAgICAgIHJlZGlyZWN0ID0gaGFuZGxlcjtcbiAgICAgICAgICBoYW5kbGVyID0gWyckbWF0Y2gnLCBmdW5jdGlvbiAoJG1hdGNoKSB7IHJldHVybiBpbnRlcnBvbGF0ZShyZWRpcmVjdCwgJG1hdGNoKTsgfV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlSWZNYXRjaCgkaW5qZWN0b3IsIGhhbmRsZXIsIHdoYXQuZXhlYygkbG9jYXRpb24ucGF0aCgpKSk7XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBwcmVmaXg6IHJlZ0V4cFByZWZpeCh3aGF0KVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNoZWNrID0geyBtYXRjaGVyOiAkdXJsTWF0Y2hlckZhY3RvcnkuaXNNYXRjaGVyKHdoYXQpLCByZWdleDogd2hhdCBpbnN0YW5jZW9mIFJlZ0V4cCB9O1xuXG4gICAgZm9yICh2YXIgbiBpbiBjaGVjaykge1xuICAgICAgaWYgKGNoZWNrW25dKSByZXR1cm4gdGhpcy5ydWxlKHN0cmF0ZWdpZXNbbl0od2hhdCwgaGFuZGxlcikpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgJ3doYXQnIGluIHdoZW4oKVwiKTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyI2RlZmVySW50ZXJjZXB0XG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRGlzYWJsZXMgKG9yIGVuYWJsZXMpIGRlZmVycmluZyBsb2NhdGlvbiBjaGFuZ2UgaW50ZXJjZXB0aW9uLlxuICAgKlxuICAgKiBJZiB5b3Ugd2lzaCB0byBjdXN0b21pemUgdGhlIGJlaGF2aW9yIG9mIHN5bmNpbmcgdGhlIFVSTCAoZm9yIGV4YW1wbGUsIGlmIHlvdSB3aXNoIHRvXG4gICAqIGRlZmVyIGEgdHJhbnNpdGlvbiBidXQgbWFpbnRhaW4gdGhlIGN1cnJlbnQgVVJMKSwgY2FsbCB0aGlzIG1ldGhvZCBhdCBjb25maWd1cmF0aW9uIHRpbWUuXG4gICAqIFRoZW4sIGF0IHJ1biB0aW1lLCBjYWxsIGAkdXJsUm91dGVyLmxpc3RlbigpYCBhZnRlciB5b3UgaGF2ZSBjb25maWd1cmVkIHlvdXIgb3duXG4gICAqIGAkbG9jYXRpb25DaGFuZ2VTdWNjZXNzYCBldmVudCBoYW5kbGVyLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLnJvdXRlciddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAqXG4gICAqICAgLy8gUHJldmVudCAkdXJsUm91dGVyIGZyb20gYXV0b21hdGljYWxseSBpbnRlcmNlcHRpbmcgVVJMIGNoYW5nZXM7XG4gICAqICAgLy8gdGhpcyBhbGxvd3MgeW91IHRvIGNvbmZpZ3VyZSBjdXN0b20gYmVoYXZpb3IgaW4gYmV0d2VlblxuICAgKiAgIC8vIGxvY2F0aW9uIGNoYW5nZXMgYW5kIHJvdXRlIHN5bmNocm9uaXphdGlvbjpcbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIuZGVmZXJJbnRlcmNlcHQoKTtcbiAgICpcbiAgICogfSkucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkdXJsUm91dGVyLCBVc2VyU2VydmljZSkge1xuICAgKlxuICAgKiAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZSkge1xuICAgKiAgICAgLy8gVXNlclNlcnZpY2UgaXMgYW4gZXhhbXBsZSBzZXJ2aWNlIGZvciBtYW5hZ2luZyB1c2VyIHN0YXRlXG4gICAqICAgICBpZiAoVXNlclNlcnZpY2UuaXNMb2dnZWRJbigpKSByZXR1cm47XG4gICAqXG4gICAqICAgICAvLyBQcmV2ZW50ICR1cmxSb3V0ZXIncyBkZWZhdWx0IGhhbmRsZXIgZnJvbSBmaXJpbmdcbiAgICogICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICpcbiAgICogICAgIFVzZXJTZXJ2aWNlLmhhbmRsZUxvZ2luKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICogICAgICAgLy8gT25jZSB0aGUgdXNlciBoYXMgbG9nZ2VkIGluLCBzeW5jIHRoZSBjdXJyZW50IFVSTFxuICAgKiAgICAgICAvLyB0byB0aGUgcm91dGVyOlxuICAgKiAgICAgICAkdXJsUm91dGVyLnN5bmMoKTtcbiAgICogICAgIH0pO1xuICAgKiAgIH0pO1xuICAgKlxuICAgKiAgIC8vIENvbmZpZ3VyZXMgJHVybFJvdXRlcidzIGxpc3RlbmVyICphZnRlciogeW91ciBjdXN0b20gbGlzdGVuZXJcbiAgICogICAkdXJsUm91dGVyLmxpc3RlbigpO1xuICAgKiB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVmZXIgSW5kaWNhdGVzIHdoZXRoZXIgdG8gZGVmZXIgbG9jYXRpb24gY2hhbmdlIGludGVyY2VwdGlvbi4gUGFzc2luZ1xuICAgICAgICAgICAgbm8gcGFyYW1ldGVyIGlzIGVxdWl2YWxlbnQgdG8gYHRydWVgLlxuICAgKi9cbiAgdGhpcy5kZWZlckludGVyY2VwdCA9IGZ1bmN0aW9uIChkZWZlcikge1xuICAgIGlmIChkZWZlciA9PT0gdW5kZWZpbmVkKSBkZWZlciA9IHRydWU7XG4gICAgaW50ZXJjZXB0RGVmZXJyZWQgPSBkZWZlcjtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJcbiAgICpcbiAgICogQHJlcXVpcmVzICRsb2NhdGlvblxuICAgKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICAgKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gICAqIEByZXF1aXJlcyAkYnJvd3NlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICovXG4gIHRoaXMuJGdldCA9ICRnZXQ7XG4gICRnZXQuJGluamVjdCA9IFsnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJGluamVjdG9yJywgJyRicm93c2VyJ107XG4gIGZ1bmN0aW9uICRnZXQoICAgJGxvY2F0aW9uLCAgICRyb290U2NvcGUsICAgJGluamVjdG9yLCAgICRicm93c2VyKSB7XG5cbiAgICB2YXIgYmFzZUhyZWYgPSAkYnJvd3Nlci5iYXNlSHJlZigpLCBsb2NhdGlvbiA9ICRsb2NhdGlvbi51cmwoKTtcblxuICAgIGZ1bmN0aW9uIGFwcGVuZEJhc2VQYXRoKHVybCwgaXNIdG1sNSwgYWJzb2x1dGUpIHtcbiAgICAgIGlmIChiYXNlSHJlZiA9PT0gJy8nKSByZXR1cm4gdXJsO1xuICAgICAgaWYgKGlzSHRtbDUpIHJldHVybiBiYXNlSHJlZi5zbGljZSgwLCAtMSkgKyB1cmw7XG4gICAgICBpZiAoYWJzb2x1dGUpIHJldHVybiBiYXNlSHJlZi5zbGljZSgxKSArIHVybDtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogT3B0aW1pemUgZ3JvdXBzIG9mIHJ1bGVzIHdpdGggbm9uLWVtcHR5IHByZWZpeCBpbnRvIHNvbWUgc29ydCBvZiBkZWNpc2lvbiB0cmVlXG4gICAgZnVuY3Rpb24gdXBkYXRlKGV2dCkge1xuICAgICAgaWYgKGV2dCAmJiBldnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgICBmdW5jdGlvbiBjaGVjayhydWxlKSB7XG4gICAgICAgIHZhciBoYW5kbGVkID0gcnVsZSgkaW5qZWN0b3IsICRsb2NhdGlvbik7XG5cbiAgICAgICAgaWYgKCFoYW5kbGVkKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpc1N0cmluZyhoYW5kbGVkKSkgJGxvY2F0aW9uLnJlcGxhY2UoKS51cmwoaGFuZGxlZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgdmFyIG4gPSBydWxlcy5sZW5ndGgsIGk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgaWYgKGNoZWNrKHJ1bGVzW2ldKSkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gYWx3YXlzIGNoZWNrIG90aGVyd2lzZSBsYXN0IHRvIGFsbG93IGR5bmFtaWMgdXBkYXRlcyB0byB0aGUgc2V0IG9mIHJ1bGVzXG4gICAgICBpZiAob3RoZXJ3aXNlKSBjaGVjayhvdGhlcndpc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RlbigpIHtcbiAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXIgfHwgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCB1cGRhdGUpO1xuICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgIH1cblxuICAgIGlmICghaW50ZXJjZXB0RGVmZXJyZWQpIGxpc3RlbigpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXIjc3luY1xuICAgICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclxuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogVHJpZ2dlcnMgYW4gdXBkYXRlOyB0aGUgc2FtZSB1cGRhdGUgdGhhdCBoYXBwZW5zIHdoZW4gdGhlIGFkZHJlc3MgYmFyIHVybCBjaGFuZ2VzLCBha2EgYCRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NgLlxuICAgICAgICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIHdoZW4geW91IG5lZWQgdG8gdXNlIGBwcmV2ZW50RGVmYXVsdCgpYCBvbiB0aGUgYCRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NgIGV2ZW50LFxuICAgICAgICogcGVyZm9ybSBzb21lIGN1c3RvbSBsb2dpYyAocm91dGUgcHJvdGVjdGlvbiwgYXV0aCwgY29uZmlnLCByZWRpcmVjdGlvbiwgZXRjKSBhbmQgdGhlbiBmaW5hbGx5IHByb2NlZWRcbiAgICAgICAqIHdpdGggdGhlIHRyYW5zaXRpb24gYnkgY2FsbGluZyBgJHVybFJvdXRlci5zeW5jKClgLlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiA8cHJlPlxuICAgICAgICogYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJ10pXG4gICAgICAgKiAgIC5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJHVybFJvdXRlcikge1xuICAgICAgICogICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgKiAgICAgICAvLyBIYWx0IHN0YXRlIGNoYW5nZSBmcm9tIGV2ZW4gc3RhcnRpbmdcbiAgICAgICAqICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICogICAgICAgLy8gUGVyZm9ybSBjdXN0b20gbG9naWNcbiAgICAgICAqICAgICAgIHZhciBtZWV0c1JlcXVpcmVtZW50ID0gLi4uXG4gICAgICAgKiAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSB1cGRhdGUgYW5kIHN0YXRlIHRyYW5zaXRpb24gaWYgbG9naWMgYWxsb3dzXG4gICAgICAgKiAgICAgICBpZiAobWVldHNSZXF1aXJlbWVudCkgJHVybFJvdXRlci5zeW5jKCk7XG4gICAgICAgKiAgICAgfSk7XG4gICAgICAgKiB9KTtcbiAgICAgICAqIDwvcHJlPlxuICAgICAgICovXG4gICAgICBzeW5jOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICB9LFxuXG4gICAgICBsaXN0ZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbGlzdGVuKCk7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uKHJlYWQpIHtcbiAgICAgICAgaWYgKHJlYWQpIHtcbiAgICAgICAgICBsb2NhdGlvbiA9ICRsb2NhdGlvbi51cmwoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRsb2NhdGlvbi51cmwoKSA9PT0gbG9jYXRpb24pIHJldHVybjtcblxuICAgICAgICAkbG9jYXRpb24udXJsKGxvY2F0aW9uKTtcbiAgICAgICAgJGxvY2F0aW9uLnJlcGxhY2UoKTtcbiAgICAgIH0sXG5cbiAgICAgIHB1c2g6IGZ1bmN0aW9uKHVybE1hdGNoZXIsIHBhcmFtcywgb3B0aW9ucykge1xuICAgICAgICAkbG9jYXRpb24udXJsKHVybE1hdGNoZXIuZm9ybWF0KHBhcmFtcyB8fCB7fSkpO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlcGxhY2UpICRsb2NhdGlvbi5yZXBsYWNlKCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyI2hyZWZcbiAgICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEEgVVJMIGdlbmVyYXRpb24gbWV0aG9kIHRoYXQgcmV0dXJucyB0aGUgY29tcGlsZWQgVVJMIGZvciBhIGdpdmVuXG4gICAgICAgKiB7QGxpbmsgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyIGBVcmxNYXRjaGVyYH0sIHBvcHVsYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzLlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiA8cHJlPlxuICAgICAgICogJGJvYiA9ICR1cmxSb3V0ZXIuaHJlZihuZXcgVXJsTWF0Y2hlcihcIi9hYm91dC86cGVyc29uXCIpLCB7XG4gICAgICAgKiAgIHBlcnNvbjogXCJib2JcIlxuICAgICAgICogfSk7XG4gICAgICAgKiAvLyAkYm9iID09IFwiL2Fib3V0L2JvYlwiO1xuICAgICAgICogPC9wcmU+XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtVcmxNYXRjaGVyfSB1cmxNYXRjaGVyIFRoZSBgVXJsTWF0Y2hlcmAgb2JqZWN0IHdoaWNoIGlzIHVzZWQgYXMgdGhlIHRlbXBsYXRlIG9mIHRoZSBVUkwgdG8gZ2VuZXJhdGUuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBbiBvYmplY3Qgb2YgcGFyYW1ldGVyIHZhbHVlcyB0byBmaWxsIHRoZSBtYXRjaGVyJ3MgcmVxdWlyZWQgcGFyYW1ldGVycy5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gb3B0aW9ucyBPcHRpb25zIG9iamVjdC4gVGhlIG9wdGlvbnMgYXJlOlxuICAgICAgICpcbiAgICAgICAqIC0gKipgYWJzb2x1dGVgKiogLSB7Ym9vbGVhbj1mYWxzZX0sICBJZiB0cnVlIHdpbGwgZ2VuZXJhdGUgYW4gYWJzb2x1dGUgdXJsLCBlLmcuIFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mdWxsdXJsXCIuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZnVsbHkgY29tcGlsZWQgVVJMLCBvciBgbnVsbGAgaWYgYHBhcmFtc2AgZmFpbCB2YWxpZGF0aW9uIGFnYWluc3QgYHVybE1hdGNoZXJgXG4gICAgICAgKi9cbiAgICAgIGhyZWY6IGZ1bmN0aW9uKHVybE1hdGNoZXIsIHBhcmFtcywgb3B0aW9ucykge1xuICAgICAgICBpZiAoIXVybE1hdGNoZXIudmFsaWRhdGVzKHBhcmFtcykpIHJldHVybiBudWxsO1xuXG4gICAgICAgIHZhciBpc0h0bWw1ID0gJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKCk7XG4gICAgICAgIHZhciB1cmwgPSB1cmxNYXRjaGVyLmZvcm1hdChwYXJhbXMpO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBpZiAoIWlzSHRtbDUgJiYgdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgdXJsID0gXCIjXCIgKyAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCkgKyB1cmw7XG4gICAgICAgIH1cbiAgICAgICAgdXJsID0gYXBwZW5kQmFzZVBhdGgodXJsLCBpc0h0bWw1LCBvcHRpb25zLmFic29sdXRlKTtcblxuICAgICAgICBpZiAoIW9wdGlvbnMuYWJzb2x1dGUgfHwgIXVybCkge1xuICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2xhc2ggPSAoIWlzSHRtbDUgJiYgdXJsID8gJy8nIDogJycpLCBwb3J0ID0gJGxvY2F0aW9uLnBvcnQoKTtcbiAgICAgICAgcG9ydCA9IChwb3J0ID09PSA4MCB8fCBwb3J0ID09PSA0NDMgPyAnJyA6ICc6JyArIHBvcnQpO1xuXG4gICAgICAgIHJldHVybiBbJGxvY2F0aW9uLnByb3RvY29sKCksICc6Ly8nLCAkbG9jYXRpb24uaG9zdCgpLCBwb3J0LCBzbGFzaCwgdXJsXS5qb2luKCcnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIucm91dGVyJykucHJvdmlkZXIoJyR1cmxSb3V0ZXInLCAkVXJsUm91dGVyUHJvdmlkZXIpO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlclxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgbmV3IGAkc3RhdGVQcm92aWRlcmAgd29ya3Mgc2ltaWxhciB0byBBbmd1bGFyJ3MgdjEgcm91dGVyLCBidXQgaXQgZm9jdXNlcyBwdXJlbHlcbiAqIG9uIHN0YXRlLlxuICpcbiAqIEEgc3RhdGUgY29ycmVzcG9uZHMgdG8gYSBcInBsYWNlXCIgaW4gdGhlIGFwcGxpY2F0aW9uIGluIHRlcm1zIG9mIHRoZSBvdmVyYWxsIFVJIGFuZFxuICogbmF2aWdhdGlvbi4gQSBzdGF0ZSBkZXNjcmliZXMgKHZpYSB0aGUgY29udHJvbGxlciAvIHRlbXBsYXRlIC8gdmlldyBwcm9wZXJ0aWVzKSB3aGF0XG4gKiB0aGUgVUkgbG9va3MgbGlrZSBhbmQgZG9lcyBhdCB0aGF0IHBsYWNlLlxuICpcbiAqIFN0YXRlcyBvZnRlbiBoYXZlIHRoaW5ncyBpbiBjb21tb24sIGFuZCB0aGUgcHJpbWFyeSB3YXkgb2YgZmFjdG9yaW5nIG91dCB0aGVzZVxuICogY29tbW9uYWxpdGllcyBpbiB0aGlzIG1vZGVsIGlzIHZpYSB0aGUgc3RhdGUgaGllcmFyY2h5LCBpLmUuIHBhcmVudC9jaGlsZCBzdGF0ZXMgYWthXG4gKiBuZXN0ZWQgc3RhdGVzLlxuICpcbiAqIFRoZSBgJHN0YXRlUHJvdmlkZXJgIHByb3ZpZGVzIGludGVyZmFjZXMgdG8gZGVjbGFyZSB0aGVzZSBzdGF0ZXMgZm9yIHlvdXIgYXBwLlxuICovXG4kU3RhdGVQcm92aWRlci4kaW5qZWN0ID0gWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXInXTtcbmZ1bmN0aW9uICRTdGF0ZVByb3ZpZGVyKCAgICR1cmxSb3V0ZXJQcm92aWRlciwgICAkdXJsTWF0Y2hlckZhY3RvcnkpIHtcblxuICB2YXIgcm9vdCwgc3RhdGVzID0ge30sICRzdGF0ZSwgcXVldWUgPSB7fSwgYWJzdHJhY3RLZXkgPSAnYWJzdHJhY3QnO1xuXG4gIC8vIEJ1aWxkcyBzdGF0ZSBwcm9wZXJ0aWVzIGZyb20gZGVmaW5pdGlvbiBwYXNzZWQgdG8gcmVnaXN0ZXJTdGF0ZSgpXG4gIHZhciBzdGF0ZUJ1aWxkZXIgPSB7XG5cbiAgICAvLyBEZXJpdmUgcGFyZW50IHN0YXRlIGZyb20gYSBoaWVyYXJjaGljYWwgbmFtZSBvbmx5IGlmICdwYXJlbnQnIGlzIG5vdCBleHBsaWNpdGx5IGRlZmluZWQuXG4gICAgLy8gc3RhdGUuY2hpbGRyZW4gPSBbXTtcbiAgICAvLyBpZiAocGFyZW50KSBwYXJlbnQuY2hpbGRyZW4ucHVzaChzdGF0ZSk7XG4gICAgcGFyZW50OiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgaWYgKGlzRGVmaW5lZChzdGF0ZS5wYXJlbnQpICYmIHN0YXRlLnBhcmVudCkgcmV0dXJuIGZpbmRTdGF0ZShzdGF0ZS5wYXJlbnQpO1xuICAgICAgLy8gcmVnZXggbWF0Y2hlcyBhbnkgdmFsaWQgY29tcG9zaXRlIHN0YXRlIG5hbWVcbiAgICAgIC8vIHdvdWxkIG1hdGNoIFwiY29udGFjdC5saXN0XCIgYnV0IG5vdCBcImNvbnRhY3RzXCJcbiAgICAgIHZhciBjb21wb3NpdGVOYW1lID0gL14oLispXFwuW14uXSskLy5leGVjKHN0YXRlLm5hbWUpO1xuICAgICAgcmV0dXJuIGNvbXBvc2l0ZU5hbWUgPyBmaW5kU3RhdGUoY29tcG9zaXRlTmFtZVsxXSkgOiByb290O1xuICAgIH0sXG5cbiAgICAvLyBpbmhlcml0ICdkYXRhJyBmcm9tIHBhcmVudCBhbmQgb3ZlcnJpZGUgYnkgb3duIHZhbHVlcyAoaWYgYW55KVxuICAgIGRhdGE6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGUucGFyZW50ICYmIHN0YXRlLnBhcmVudC5kYXRhKSB7XG4gICAgICAgIHN0YXRlLmRhdGEgPSBzdGF0ZS5zZWxmLmRhdGEgPSBleHRlbmQoe30sIHN0YXRlLnBhcmVudC5kYXRhLCBzdGF0ZS5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0ZS5kYXRhO1xuICAgIH0sXG5cbiAgICAvLyBCdWlsZCBhIFVSTE1hdGNoZXIgaWYgbmVjZXNzYXJ5LCBlaXRoZXIgdmlhIGEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgVVJMXG4gICAgdXJsOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdmFyIHVybCA9IHN0YXRlLnVybCwgY29uZmlnID0geyBwYXJhbXM6IHN0YXRlLnBhcmFtcyB8fCB7fSB9O1xuXG4gICAgICBpZiAoaXNTdHJpbmcodXJsKSkge1xuICAgICAgICBpZiAodXJsLmNoYXJBdCgwKSA9PSAnXicpIHJldHVybiAkdXJsTWF0Y2hlckZhY3RvcnkuY29tcGlsZSh1cmwuc3Vic3RyaW5nKDEpLCBjb25maWcpO1xuICAgICAgICByZXR1cm4gKHN0YXRlLnBhcmVudC5uYXZpZ2FibGUgfHwgcm9vdCkudXJsLmNvbmNhdCh1cmwsIGNvbmZpZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXJsIHx8ICR1cmxNYXRjaGVyRmFjdG9yeS5pc01hdGNoZXIodXJsKSkgcmV0dXJuIHVybDtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdXJsICdcIiArIHVybCArIFwiJyBpbiBzdGF0ZSAnXCIgKyBzdGF0ZSArIFwiJ1wiKTtcbiAgICB9LFxuXG4gICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgY2xvc2VzdCBhbmNlc3RvciBzdGF0ZSB0aGF0IGhhcyBhIFVSTCAoaS5lLiBpcyBuYXZpZ2FibGUpXG4gICAgbmF2aWdhYmxlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlLnVybCA/IHN0YXRlIDogKHN0YXRlLnBhcmVudCA/IHN0YXRlLnBhcmVudC5uYXZpZ2FibGUgOiBudWxsKTtcbiAgICB9LFxuXG4gICAgLy8gRGVyaXZlIHBhcmFtZXRlcnMgZm9yIHRoaXMgc3RhdGUgYW5kIGVuc3VyZSB0aGV5J3JlIGEgc3VwZXItc2V0IG9mIHBhcmVudCdzIHBhcmFtZXRlcnNcbiAgICBwYXJhbXM6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlLnBhcmFtcykge1xuICAgICAgICByZXR1cm4gc3RhdGUudXJsID8gc3RhdGUudXJsLnBhcmFtcyA6IHN0YXRlLnBhcmVudC5wYXJhbXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdGUucGFyYW1zO1xuICAgIH0sXG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyBleHBsaWNpdCBtdWx0aS12aWV3IGNvbmZpZ3VyYXRpb24sIG1ha2Ugb25lIHVwIHNvIHdlIGRvbid0IGhhdmVcbiAgICAvLyB0byBoYW5kbGUgYm90aCBjYXNlcyBpbiB0aGUgdmlldyBkaXJlY3RpdmUgbGF0ZXIuIE5vdGUgdGhhdCBoYXZpbmcgYW4gZXhwbGljaXRcbiAgICAvLyAndmlld3MnIHByb3BlcnR5IHdpbGwgbWVhbiB0aGUgZGVmYXVsdCB1bm5hbWVkIHZpZXcgcHJvcGVydGllcyBhcmUgaWdub3JlZC4gVGhpc1xuICAgIC8vIGlzIGFsc28gYSBnb29kIHRpbWUgdG8gcmVzb2x2ZSB2aWV3IG5hbWVzIHRvIGFic29sdXRlIG5hbWVzLCBzbyBldmVyeXRoaW5nIGlzIGFcbiAgICAvLyBzdHJhaWdodCBsb29rdXAgYXQgbGluayB0aW1lLlxuICAgIHZpZXdzOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdmFyIHZpZXdzID0ge307XG5cbiAgICAgIGZvckVhY2goaXNEZWZpbmVkKHN0YXRlLnZpZXdzKSA/IHN0YXRlLnZpZXdzIDogeyAnJzogc3RhdGUgfSwgZnVuY3Rpb24gKHZpZXcsIG5hbWUpIHtcbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignQCcpIDwgMCkgbmFtZSArPSAnQCcgKyBzdGF0ZS5wYXJlbnQubmFtZTtcbiAgICAgICAgdmlld3NbbmFtZV0gPSB2aWV3O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmlld3M7XG4gICAgfSxcblxuICAgIG93blBhcmFtczogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHN0YXRlLnBhcmFtcyA9IHN0YXRlLnBhcmFtcyB8fCB7fTtcblxuICAgICAgaWYgKCFzdGF0ZS5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0S2V5cyhzdGF0ZS5wYXJhbXMpO1xuICAgICAgfVxuICAgICAgdmFyIHBhcmFtTmFtZXMgPSB7fTsgZm9yRWFjaChzdGF0ZS5wYXJhbXMsIGZ1bmN0aW9uICh2LCBrKSB7IHBhcmFtTmFtZXNba10gPSB0cnVlOyB9KTtcblxuICAgICAgZm9yRWFjaChzdGF0ZS5wYXJlbnQucGFyYW1zLCBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICBpZiAoIXBhcmFtTmFtZXNba10pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlciAnXCIgKyBrICsgXCInIGluIHN0YXRlICdcIiArIHN0YXRlLm5hbWUgKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1OYW1lc1trXSA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICB2YXIgb3duUGFyYW1zID0gW107XG5cbiAgICAgIGZvckVhY2gocGFyYW1OYW1lcywgZnVuY3Rpb24gKG93biwgcCkge1xuICAgICAgICBpZiAob3duKSBvd25QYXJhbXMucHVzaChwKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG93blBhcmFtcztcbiAgICB9LFxuXG4gICAgLy8gS2VlcCBhIGZ1bGwgcGF0aCBmcm9tIHRoZSByb290IGRvd24gdG8gdGhpcyBzdGF0ZSBhcyB0aGlzIGlzIG5lZWRlZCBmb3Igc3RhdGUgYWN0aXZhdGlvbi5cbiAgICBwYXRoOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlLnBhcmVudCA/IHN0YXRlLnBhcmVudC5wYXRoLmNvbmNhdChzdGF0ZSkgOiBbXTsgLy8gZXhjbHVkZSByb290IGZyb20gcGF0aFxuICAgIH0sXG5cbiAgICAvLyBTcGVlZCB1cCAkc3RhdGUuY29udGFpbnMoKSBhcyBpdCdzIHVzZWQgYSBsb3RcbiAgICBpbmNsdWRlczogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHZhciBpbmNsdWRlcyA9IHN0YXRlLnBhcmVudCA/IGV4dGVuZCh7fSwgc3RhdGUucGFyZW50LmluY2x1ZGVzKSA6IHt9O1xuICAgICAgaW5jbHVkZXNbc3RhdGUubmFtZV0gPSB0cnVlO1xuICAgICAgcmV0dXJuIGluY2x1ZGVzO1xuICAgIH0sXG5cbiAgICAkZGVsZWdhdGVzOiB7fVxuICB9O1xuXG4gIGZ1bmN0aW9uIGlzUmVsYXRpdmUoc3RhdGVOYW1lKSB7XG4gICAgcmV0dXJuIHN0YXRlTmFtZS5pbmRleE9mKFwiLlwiKSA9PT0gMCB8fCBzdGF0ZU5hbWUuaW5kZXhPZihcIl5cIikgPT09IDA7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5kU3RhdGUoc3RhdGVPck5hbWUsIGJhc2UpIHtcbiAgICBpZiAoIXN0YXRlT3JOYW1lKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgdmFyIGlzU3RyID0gaXNTdHJpbmcoc3RhdGVPck5hbWUpLFxuICAgICAgICBuYW1lICA9IGlzU3RyID8gc3RhdGVPck5hbWUgOiBzdGF0ZU9yTmFtZS5uYW1lLFxuICAgICAgICBwYXRoICA9IGlzUmVsYXRpdmUobmFtZSk7XG5cbiAgICBpZiAocGF0aCkge1xuICAgICAgaWYgKCFiYXNlKSB0aHJvdyBuZXcgRXJyb3IoXCJObyByZWZlcmVuY2UgcG9pbnQgZ2l2ZW4gZm9yIHBhdGggJ1wiICArIG5hbWUgKyBcIidcIik7XG4gICAgICB2YXIgcmVsID0gbmFtZS5zcGxpdChcIi5cIiksIGkgPSAwLCBwYXRoTGVuZ3RoID0gcmVsLmxlbmd0aCwgY3VycmVudCA9IGJhc2U7XG5cbiAgICAgIGZvciAoOyBpIDwgcGF0aExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChyZWxbaV0gPT09IFwiXCIgJiYgaSA9PT0gMCkge1xuICAgICAgICAgIGN1cnJlbnQgPSBiYXNlO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxbaV0gPT09IFwiXlwiKSB7XG4gICAgICAgICAgaWYgKCFjdXJyZW50LnBhcmVudCkgdGhyb3cgbmV3IEVycm9yKFwiUGF0aCAnXCIgKyBuYW1lICsgXCInIG5vdCB2YWxpZCBmb3Igc3RhdGUgJ1wiICsgYmFzZS5uYW1lICsgXCInXCIpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJlbCA9IHJlbC5zbGljZShpKS5qb2luKFwiLlwiKTtcbiAgICAgIG5hbWUgPSBjdXJyZW50Lm5hbWUgKyAoY3VycmVudC5uYW1lICYmIHJlbCA/IFwiLlwiIDogXCJcIikgKyByZWw7XG4gICAgfVxuICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tuYW1lXTtcblxuICAgIGlmIChzdGF0ZSAmJiAoaXNTdHIgfHwgKCFpc1N0ciAmJiAoc3RhdGUgPT09IHN0YXRlT3JOYW1lIHx8IHN0YXRlLnNlbGYgPT09IHN0YXRlT3JOYW1lKSkpKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBxdWV1ZVN0YXRlKHBhcmVudE5hbWUsIHN0YXRlKSB7XG4gICAgaWYgKCFxdWV1ZVtwYXJlbnROYW1lXSkge1xuICAgICAgcXVldWVbcGFyZW50TmFtZV0gPSBbXTtcbiAgICB9XG4gICAgcXVldWVbcGFyZW50TmFtZV0ucHVzaChzdGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlclN0YXRlKHN0YXRlKSB7XG4gICAgLy8gV3JhcCBhIG5ldyBvYmplY3QgYXJvdW5kIHRoZSBzdGF0ZSBzbyB3ZSBjYW4gc3RvcmUgb3VyIHByaXZhdGUgZGV0YWlscyBlYXNpbHkuXG4gICAgc3RhdGUgPSBpbmhlcml0KHN0YXRlLCB7XG4gICAgICBzZWxmOiBzdGF0ZSxcbiAgICAgIHJlc29sdmU6IHN0YXRlLnJlc29sdmUgfHwge30sXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm5hbWU7IH1cbiAgICB9KTtcblxuICAgIHZhciBuYW1lID0gc3RhdGUubmFtZTtcbiAgICBpZiAoIWlzU3RyaW5nKG5hbWUpIHx8IG5hbWUuaW5kZXhPZignQCcpID49IDApIHRocm93IG5ldyBFcnJvcihcIlN0YXRlIG11c3QgaGF2ZSBhIHZhbGlkIG5hbWVcIik7XG4gICAgaWYgKHN0YXRlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKFwiU3RhdGUgJ1wiICsgbmFtZSArIFwiJycgaXMgYWxyZWFkeSBkZWZpbmVkXCIpO1xuXG4gICAgLy8gR2V0IHBhcmVudCBuYW1lXG4gICAgdmFyIHBhcmVudE5hbWUgPSAobmFtZS5pbmRleE9mKCcuJykgIT09IC0xKSA/IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGFzdEluZGV4T2YoJy4nKSlcbiAgICAgICAgOiAoaXNTdHJpbmcoc3RhdGUucGFyZW50KSkgPyBzdGF0ZS5wYXJlbnRcbiAgICAgICAgOiAnJztcblxuICAgIC8vIElmIHBhcmVudCBpcyBub3QgcmVnaXN0ZXJlZCB5ZXQsIGFkZCBzdGF0ZSB0byBxdWV1ZSBhbmQgcmVnaXN0ZXIgbGF0ZXJcbiAgICBpZiAocGFyZW50TmFtZSAmJiAhc3RhdGVzW3BhcmVudE5hbWVdKSB7XG4gICAgICByZXR1cm4gcXVldWVTdGF0ZShwYXJlbnROYW1lLCBzdGF0ZS5zZWxmKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc3RhdGVCdWlsZGVyKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbihzdGF0ZUJ1aWxkZXJba2V5XSkpIHN0YXRlW2tleV0gPSBzdGF0ZUJ1aWxkZXJba2V5XShzdGF0ZSwgc3RhdGVCdWlsZGVyLiRkZWxlZ2F0ZXNba2V5XSk7XG4gICAgfVxuICAgIHN0YXRlc1tuYW1lXSA9IHN0YXRlO1xuXG4gICAgLy8gUmVnaXN0ZXIgdGhlIHN0YXRlIGluIHRoZSBnbG9iYWwgc3RhdGUgbGlzdCBhbmQgd2l0aCAkdXJsUm91dGVyIGlmIG5lY2Vzc2FyeS5cbiAgICBpZiAoIXN0YXRlW2Fic3RyYWN0S2V5XSAmJiBzdGF0ZS51cmwpIHtcbiAgICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKHN0YXRlLnVybCwgWyckbWF0Y2gnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRtYXRjaCwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIGlmICgkc3RhdGUuJGN1cnJlbnQubmF2aWdhYmxlICE9IHN0YXRlIHx8ICFlcXVhbEZvcktleXMoJG1hdGNoLCAkc3RhdGVQYXJhbXMpKSB7XG4gICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhzdGF0ZSwgJG1hdGNoLCB7IGxvY2F0aW9uOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuICAgIH1cblxuICAgIC8vIFJlZ2lzdGVyIGFueSBxdWV1ZWQgY2hpbGRyZW5cbiAgICBpZiAocXVldWVbbmFtZV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWVbbmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVnaXN0ZXJTdGF0ZShxdWV1ZVtuYW1lXVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gQ2hlY2tzIHRleHQgdG8gc2VlIGlmIGl0IGxvb2tzIGxpa2UgYSBnbG9iLlxuICBmdW5jdGlvbiBpc0dsb2IgKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5pbmRleE9mKCcqJykgPiAtMTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBnbG9iIG1hdGNoZXMgY3VycmVudCAkc3RhdGUgbmFtZS5cbiAgZnVuY3Rpb24gZG9lc1N0YXRlTWF0Y2hHbG9iIChnbG9iKSB7XG4gICAgdmFyIGdsb2JTZWdtZW50cyA9IGdsb2Iuc3BsaXQoJy4nKSxcbiAgICAgICAgc2VnbWVudHMgPSAkc3RhdGUuJGN1cnJlbnQubmFtZS5zcGxpdCgnLicpO1xuXG4gICAgLy9tYXRjaCBncmVlZHkgc3RhcnRzXG4gICAgaWYgKGdsb2JTZWdtZW50c1swXSA9PT0gJyoqJykge1xuICAgICAgIHNlZ21lbnRzID0gc2VnbWVudHMuc2xpY2Uoc2VnbWVudHMuaW5kZXhPZihnbG9iU2VnbWVudHNbMV0pKTtcbiAgICAgICBzZWdtZW50cy51bnNoaWZ0KCcqKicpO1xuICAgIH1cbiAgICAvL21hdGNoIGdyZWVkeSBlbmRzXG4gICAgaWYgKGdsb2JTZWdtZW50c1tnbG9iU2VnbWVudHMubGVuZ3RoIC0gMV0gPT09ICcqKicpIHtcbiAgICAgICBzZWdtZW50cy5zcGxpY2Uoc2VnbWVudHMuaW5kZXhPZihnbG9iU2VnbWVudHNbZ2xvYlNlZ21lbnRzLmxlbmd0aCAtIDJdKSArIDEsIE51bWJlci5NQVhfVkFMVUUpO1xuICAgICAgIHNlZ21lbnRzLnB1c2goJyoqJyk7XG4gICAgfVxuXG4gICAgaWYgKGdsb2JTZWdtZW50cy5sZW5ndGggIT0gc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9tYXRjaCBzaW5nbGUgc3RhcnNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGdsb2JTZWdtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChnbG9iU2VnbWVudHNbaV0gPT09ICcqJykge1xuICAgICAgICBzZWdtZW50c1tpXSA9ICcqJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudHMuam9pbignJykgPT09IGdsb2JTZWdtZW50cy5qb2luKCcnKTtcbiAgfVxuXG5cbiAgLy8gSW1wbGljaXQgcm9vdCBzdGF0ZSB0aGF0IGlzIGFsd2F5cyBhY3RpdmVcbiAgcm9vdCA9IHJlZ2lzdGVyU3RhdGUoe1xuICAgIG5hbWU6ICcnLFxuICAgIHVybDogJ14nLFxuICAgIHZpZXdzOiBudWxsLFxuICAgICdhYnN0cmFjdCc6IHRydWVcbiAgfSk7XG4gIHJvb3QubmF2aWdhYmxlID0gbnVsbDtcblxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyI2RlY29yYXRvclxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBbGxvd3MgeW91IHRvIGV4dGVuZCAoY2FyZWZ1bGx5KSBvciBvdmVycmlkZSAoYXQgeW91ciBvd24gcGVyaWwpIHRoZSBcbiAgICogYHN0YXRlQnVpbGRlcmAgb2JqZWN0IHVzZWQgaW50ZXJuYWxseSBieSBgJHN0YXRlUHJvdmlkZXJgLiBUaGlzIGNhbiBiZSB1c2VkIFxuICAgKiB0byBhZGQgY3VzdG9tIGZ1bmN0aW9uYWxpdHkgdG8gdWktcm91dGVyLCBmb3IgZXhhbXBsZSBpbmZlcnJpbmcgdGVtcGxhdGVVcmwgXG4gICAqIGJhc2VkIG9uIHRoZSBzdGF0ZSBuYW1lLlxuICAgKlxuICAgKiBXaGVuIHBhc3Npbmcgb25seSBhIG5hbWUsIGl0IHJldHVybnMgdGhlIGN1cnJlbnQgKG9yaWdpbmFsIG9yIGRlY29yYXRlZCkgYnVpbGRlclxuICAgKiBmdW5jdGlvbiB0aGF0IG1hdGNoZXMgYG5hbWVgLlxuICAgKlxuICAgKiBUaGUgYnVpbGRlciBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgZGVjb3JhdGVkIGFyZSBsaXN0ZWQgYmVsb3cuIFRob3VnaCBub3QgYWxsXG4gICAqIG5lY2Vzc2FyaWx5IGhhdmUgYSBnb29kIHVzZSBjYXNlIGZvciBkZWNvcmF0aW9uLCB0aGF0IGlzIHVwIHRvIHlvdSB0byBkZWNpZGUuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uLCB1c2VycyBjYW4gYXR0YWNoIGN1c3RvbSBkZWNvcmF0b3JzLCB3aGljaCB3aWxsIGdlbmVyYXRlIG5ldyBcbiAgICogcHJvcGVydGllcyB3aXRoaW4gdGhlIHN0YXRlJ3MgaW50ZXJuYWwgZGVmaW5pdGlvbi4gVGhlcmUgaXMgY3VycmVudGx5IG5vIGNsZWFyIFxuICAgKiB1c2UtY2FzZSBmb3IgdGhpcyBiZXlvbmQgYWNjZXNzaW5nIGludGVybmFsIHN0YXRlcyAoaS5lLiAkc3RhdGUuJGN1cnJlbnQpLCBcbiAgICogaG93ZXZlciwgZXhwZWN0IHRoaXMgdG8gYmVjb21lIGluY3JlYXNpbmdseSByZWxldmFudCBhcyB3ZSBpbnRyb2R1Y2UgYWRkaXRpb25hbCBcbiAgICogbWV0YS1wcm9ncmFtbWluZyBmZWF0dXJlcy5cbiAgICpcbiAgICogKipXYXJuaW5nKio6IERlY29yYXRvcnMgc2hvdWxkIG5vdCBiZSBpbnRlcmRlcGVuZGVudCBiZWNhdXNlIHRoZSBvcmRlciBvZiBcbiAgICogZXhlY3V0aW9uIG9mIHRoZSBidWlsZGVyIGZ1bmN0aW9ucyBpbiBub24tZGV0ZXJtaW5pc3RpYy4gQnVpbGRlciBmdW5jdGlvbnMgXG4gICAqIHNob3VsZCBvbmx5IGJlIGRlcGVuZGVudCBvbiB0aGUgc3RhdGUgZGVmaW5pdGlvbiBvYmplY3QgYW5kIHN1cGVyIGZ1bmN0aW9uLlxuICAgKlxuICAgKlxuICAgKiBFeGlzdGluZyBidWlsZGVyIGZ1bmN0aW9ucyBhbmQgY3VycmVudCByZXR1cm4gdmFsdWVzOlxuICAgKlxuICAgKiAtICoqcGFyZW50KiogYHtvYmplY3R9YCAtIHJldHVybnMgdGhlIHBhcmVudCBzdGF0ZSBvYmplY3QuXG4gICAqIC0gKipkYXRhKiogYHtvYmplY3R9YCAtIHJldHVybnMgc3RhdGUgZGF0YSwgaW5jbHVkaW5nIGFueSBpbmhlcml0ZWQgZGF0YSB0aGF0IGlzIG5vdFxuICAgKiAgIG92ZXJyaWRkZW4gYnkgb3duIHZhbHVlcyAoaWYgYW55KS5cbiAgICogLSAqKnVybCoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGEge0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciBVcmxNYXRjaGVyfVxuICAgKiAgIG9yIGBudWxsYC5cbiAgICogLSAqKm5hdmlnYWJsZSoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGNsb3Nlc3QgYW5jZXN0b3Igc3RhdGUgdGhhdCBoYXMgYSBVUkwgKGFrYSBpcyBcbiAgICogICBuYXZpZ2FibGUpLlxuICAgKiAtICoqcGFyYW1zKiogYHtvYmplY3R9YCAtIHJldHVybnMgYW4gYXJyYXkgb2Ygc3RhdGUgcGFyYW1zIHRoYXQgYXJlIGVuc3VyZWQgdG8gXG4gICAqICAgYmUgYSBzdXBlci1zZXQgb2YgcGFyZW50J3MgcGFyYW1zLlxuICAgKiAtICoqdmlld3MqKiBge29iamVjdH1gIC0gcmV0dXJucyBhIHZpZXdzIG9iamVjdCB3aGVyZSBlYWNoIGtleSBpcyBhbiBhYnNvbHV0ZSB2aWV3IFxuICAgKiAgIG5hbWUgKGkuZS4gXCJ2aWV3TmFtZUBzdGF0ZU5hbWVcIikgYW5kIGVhY2ggdmFsdWUgaXMgdGhlIGNvbmZpZyBvYmplY3QgXG4gICAqICAgKHRlbXBsYXRlLCBjb250cm9sbGVyKSBmb3IgdGhlIHZpZXcuIEV2ZW4gd2hlbiB5b3UgZG9uJ3QgdXNlIHRoZSB2aWV3cyBvYmplY3QgXG4gICAqICAgZXhwbGljaXRseSBvbiBhIHN0YXRlIGNvbmZpZywgb25lIGlzIHN0aWxsIGNyZWF0ZWQgZm9yIHlvdSBpbnRlcm5hbGx5LlxuICAgKiAgIFNvIGJ5IGRlY29yYXRpbmcgdGhpcyBidWlsZGVyIGZ1bmN0aW9uIHlvdSBoYXZlIGFjY2VzcyB0byBkZWNvcmF0aW5nIHRlbXBsYXRlIFxuICAgKiAgIGFuZCBjb250cm9sbGVyIHByb3BlcnRpZXMuXG4gICAqIC0gKipvd25QYXJhbXMqKiBge29iamVjdH1gIC0gcmV0dXJucyBhbiBhcnJheSBvZiBwYXJhbXMgdGhhdCBiZWxvbmcgdG8gdGhlIHN0YXRlLCBcbiAgICogICBub3QgaW5jbHVkaW5nIGFueSBwYXJhbXMgZGVmaW5lZCBieSBhbmNlc3RvciBzdGF0ZXMuXG4gICAqIC0gKipwYXRoKiogYHtzdHJpbmd9YCAtIHJldHVybnMgdGhlIGZ1bGwgcGF0aCBmcm9tIHRoZSByb290IGRvd24gdG8gdGhpcyBzdGF0ZS4gXG4gICAqICAgTmVlZGVkIGZvciBzdGF0ZSBhY3RpdmF0aW9uLlxuICAgKiAtICoqaW5jbHVkZXMqKiBge29iamVjdH1gIC0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBpbmNsdWRlcyBldmVyeSBzdGF0ZSB0aGF0IFxuICAgKiAgIHdvdWxkIHBhc3MgYSBgJHN0YXRlLmluY2x1ZGVzKClgIHRlc3QuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIC8vIE92ZXJyaWRlIHRoZSBpbnRlcm5hbCAndmlld3MnIGJ1aWxkZXIgd2l0aCBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIHN0YXRlXG4gICAqIC8vIGRlZmluaXRpb24sIGFuZCBhIHJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgZnVuY3Rpb24gYmVpbmcgb3ZlcnJpZGRlbjpcbiAgICogJHN0YXRlUHJvdmlkZXIuZGVjb3JhdG9yKCd2aWV3cycsIGZ1bmN0aW9uIChzdGF0ZSwgcGFyZW50KSB7XG4gICAqICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgKiAgICAgICB2aWV3cyA9IHBhcmVudChzdGF0ZSk7XG4gICAqXG4gICAqICAgYW5ndWxhci5mb3JFYWNoKHZpZXdzLCBmdW5jdGlvbiAoY29uZmlnLCBuYW1lKSB7XG4gICAqICAgICB2YXIgYXV0b05hbWUgPSAoc3RhdGUubmFtZSArICcuJyArIG5hbWUpLnJlcGxhY2UoJy4nLCAnLycpO1xuICAgKiAgICAgY29uZmlnLnRlbXBsYXRlVXJsID0gY29uZmlnLnRlbXBsYXRlVXJsIHx8ICcvcGFydGlhbHMvJyArIGF1dG9OYW1lICsgJy5odG1sJztcbiAgICogICAgIHJlc3VsdFtuYW1lXSA9IGNvbmZpZztcbiAgICogICB9KTtcbiAgICogICByZXR1cm4gcmVzdWx0O1xuICAgKiB9KTtcbiAgICpcbiAgICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAqICAgdmlld3M6IHtcbiAgICogICAgICdjb250YWN0Lmxpc3QnOiB7IGNvbnRyb2xsZXI6ICdMaXN0Q29udHJvbGxlcicgfSxcbiAgICogICAgICdjb250YWN0Lml0ZW0nOiB7IGNvbnRyb2xsZXI6ICdJdGVtQ29udHJvbGxlcicgfVxuICAgKiAgIH1cbiAgICogfSk7XG4gICAqXG4gICAqIC8vIC4uLlxuICAgKlxuICAgKiAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICogLy8gQXV0by1wb3B1bGF0ZXMgbGlzdCBhbmQgaXRlbSB2aWV3cyB3aXRoIC9wYXJ0aWFscy9ob21lL2NvbnRhY3QvbGlzdC5odG1sLFxuICAgKiAvLyBhbmQgL3BhcnRpYWxzL2hvbWUvY29udGFjdC9pdGVtLmh0bWwsIHJlc3BlY3RpdmVseS5cbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBidWlsZGVyIGZ1bmN0aW9uIHRvIGRlY29yYXRlLiBcbiAgICogQHBhcmFtIHtvYmplY3R9IGZ1bmMgQSBmdW5jdGlvbiB0aGF0IGlzIHJlc3BvbnNpYmxlIGZvciBkZWNvcmF0aW5nIHRoZSBvcmlnaW5hbCBcbiAgICogYnVpbGRlciBmdW5jdGlvbi4gVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgIC0gYHtvYmplY3R9YCAtIHN0YXRlIC0gVGhlIHN0YXRlIGNvbmZpZyBvYmplY3QuXG4gICAqICAgLSBge29iamVjdH1gIC0gc3VwZXIgLSBUaGUgb3JpZ2luYWwgYnVpbGRlciBmdW5jdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAkc3RhdGVQcm92aWRlciAtICRzdGF0ZVByb3ZpZGVyIGluc3RhbmNlXG4gICAqL1xuICB0aGlzLmRlY29yYXRvciA9IGRlY29yYXRvcjtcbiAgZnVuY3Rpb24gZGVjb3JhdG9yKG5hbWUsIGZ1bmMpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICBpZiAoaXNTdHJpbmcobmFtZSkgJiYgIWlzRGVmaW5lZChmdW5jKSkge1xuICAgICAgcmV0dXJuIHN0YXRlQnVpbGRlcltuYW1lXTtcbiAgICB9XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpIHx8ICFpc1N0cmluZyhuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmIChzdGF0ZUJ1aWxkZXJbbmFtZV0gJiYgIXN0YXRlQnVpbGRlci4kZGVsZWdhdGVzW25hbWVdKSB7XG4gICAgICBzdGF0ZUJ1aWxkZXIuJGRlbGVnYXRlc1tuYW1lXSA9IHN0YXRlQnVpbGRlcltuYW1lXTtcbiAgICB9XG4gICAgc3RhdGVCdWlsZGVyW25hbWVdID0gZnVuYztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyI3N0YXRlXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIHN0YXRlIGNvbmZpZ3VyYXRpb24gdW5kZXIgYSBnaXZlbiBzdGF0ZSBuYW1lLiBUaGUgc3RhdGVDb25maWcgb2JqZWN0XG4gICAqIGhhcyB0aGUgZm9sbG93aW5nIGFjY2VwdGFibGUgcHJvcGVydGllcy5cbiAgICpcbiAgICogPGEgaWQ9J3RlbXBsYXRlJz48L2E+XG4gICAqXG4gICAqIC0gKipgdGVtcGxhdGVgKiogLSB7c3RyaW5nfGZ1bmN0aW9uPX0gLSBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zXG4gICAqICAgYW4gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyB3aGljaCBzaG91bGQgYmUgdXNlZCBieSB0aGUgdWlWaWV3IGRpcmVjdGl2ZXMuIFRoaXMgcHJvcGVydHkgXG4gICAqICAgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRlbXBsYXRlVXJsLlxuICAgKiAgIFxuICAgKiAgIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgLSB7YXJyYXkuJmx0O29iamVjdCZndDt9IC0gc3RhdGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudCAkbG9jYXRpb24ucGF0aCgpIGJ5XG4gICAqICAgICBhcHBseWluZyB0aGUgY3VycmVudCBzdGF0ZVxuICAgKlxuICAgKiA8YSBpZD0ndGVtcGxhdGVVcmwnPjwvYT5cbiAgICpcbiAgICogLSAqKmB0ZW1wbGF0ZVVybGAqKiAtIHtzdHJpbmd8ZnVuY3Rpb249fSAtIHBhdGggb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGF0aCB0byBhbiBodG1sIFxuICAgKiAgIHRlbXBsYXRlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYnkgdWlWaWV3LlxuICAgKiAgIFxuICAgKiAgIElmIGB0ZW1wbGF0ZVVybGAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgLSB7YXJyYXkuJmx0O29iamVjdCZndDt9IC0gc3RhdGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudCAkbG9jYXRpb24ucGF0aCgpIGJ5IFxuICAgKiAgICAgYXBwbHlpbmcgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICpcbiAgICogPGEgaWQ9J3RlbXBsYXRlUHJvdmlkZXInPjwvYT5cbiAgICpcbiAgICogLSAqKmB0ZW1wbGF0ZVByb3ZpZGVyYCoqIC0ge2Z1bmN0aW9uPX0gLSBQcm92aWRlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgSFRNTCBjb250ZW50XG4gICAqICAgc3RyaW5nLlxuICAgKlxuICAgKiA8YSBpZD0nY29udHJvbGxlcic+PC9hPlxuICAgKlxuICAgKiAtICoqYGNvbnRyb2xsZXJgKiogLSB7c3RyaW5nfGZ1bmN0aW9uPX0gLSAgQ29udHJvbGxlciBmbiB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggbmV3bHkgXG4gICAqICAgcmVsYXRlZCBzY29wZSBvciB0aGUgbmFtZSBvZiBhIHJlZ2lzdGVyZWQgY29udHJvbGxlciBpZiBwYXNzZWQgYXMgYSBzdHJpbmcuXG4gICAqXG4gICAqIDxhIGlkPSdjb250cm9sbGVyUHJvdmlkZXInPjwvYT5cbiAgICpcbiAgICogLSAqKmBjb250cm9sbGVyUHJvdmlkZXJgKiogLSB7ZnVuY3Rpb249fSAtIEluamVjdGFibGUgcHJvdmlkZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zXG4gICAqICAgdGhlIGFjdHVhbCBjb250cm9sbGVyIG9yIHN0cmluZy5cbiAgICpcbiAgICogPGEgaWQ9J2NvbnRyb2xsZXJBcyc+PC9hPlxuICAgKiBcbiAgICogLSAqKmBjb250cm9sbGVyQXNgKiog4oCTIHtzdHJpbmc9fSDigJMgQSBjb250cm9sbGVyIGFsaWFzIG5hbWUuIElmIHByZXNlbnQgdGhlIGNvbnRyb2xsZXIgd2lsbCBiZSBcbiAgICogICBwdWJsaXNoZWQgdG8gc2NvcGUgdW5kZXIgdGhlIGNvbnRyb2xsZXJBcyBuYW1lLlxuICAgKlxuICAgKiA8YSBpZD0ncmVzb2x2ZSc+PC9hPlxuICAgKlxuICAgKiAtICoqYHJlc29sdmVgKiogLSB7b2JqZWN0LiZsdDtzdHJpbmcsIGZ1bmN0aW9uJmd0Oz19IC0gQW4gb3B0aW9uYWwgbWFwIG9mIGRlcGVuZGVuY2llcyB3aGljaCBcbiAgICogICBzaG91bGQgYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci4gSWYgYW55IG9mIHRoZXNlIGRlcGVuZGVuY2llcyBhcmUgcHJvbWlzZXMsIFxuICAgKiAgIHRoZSByb3V0ZXIgd2lsbCB3YWl0IGZvciB0aGVtIGFsbCB0byBiZSByZXNvbHZlZCBvciBvbmUgdG8gYmUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBcbiAgICogICBjb250cm9sbGVyIGlzIGluc3RhbnRpYXRlZC4gSWYgYWxsIHRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LCB0aGUgdmFsdWVzIFxuICAgKiAgIG9mIHRoZSByZXNvbHZlZCBwcm9taXNlcyBhcmUgaW5qZWN0ZWQgYW5kICRzdGF0ZUNoYW5nZVN1Y2Nlc3MgZXZlbnQgaXMgZmlyZWQuIElmIGFueSBcbiAgICogICBvZiB0aGUgcHJvbWlzZXMgYXJlIHJlamVjdGVkIHRoZSAkc3RhdGVDaGFuZ2VFcnJvciBldmVudCBpcyBmaXJlZC4gVGhlIG1hcCBvYmplY3QgaXM6XG4gICAqICAgXG4gICAqICAgLSBrZXkgLSB7c3RyaW5nfTogbmFtZSBvZiBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gY29udHJvbGxlclxuICAgKiAgIC0gZmFjdG9yeSAtIHtzdHJpbmd8ZnVuY3Rpb259OiBJZiBzdHJpbmcgdGhlbiBpdCBpcyBhbGlhcyBmb3Igc2VydmljZS4gT3RoZXJ3aXNlIGlmIGZ1bmN0aW9uLCBcbiAgICogICAgIGl0IGlzIGluamVjdGVkIGFuZCByZXR1cm4gdmFsdWUgaXQgdHJlYXRlZCBhcyBkZXBlbmRlbmN5LiBJZiByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpcyBcbiAgICogICAgIHJlc29sdmVkIGJlZm9yZSBpdHMgdmFsdWUgaXMgaW5qZWN0ZWQgaW50byBjb250cm9sbGVyLlxuICAgKlxuICAgKiA8YSBpZD0ndXJsJz48L2E+XG4gICAqXG4gICAqIC0gKipgdXJsYCoqIC0ge3N0cmluZz19IC0gQSB1cmwgd2l0aCBvcHRpb25hbCBwYXJhbWV0ZXJzLiBXaGVuIGEgc3RhdGUgaXMgbmF2aWdhdGVkIG9yXG4gICAqICAgdHJhbnNpdGlvbmVkIHRvLCB0aGUgYCRzdGF0ZVBhcmFtc2Agc2VydmljZSB3aWxsIGJlIHBvcHVsYXRlZCB3aXRoIGFueSBcbiAgICogICBwYXJhbWV0ZXJzIHRoYXQgd2VyZSBwYXNzZWQuXG4gICAqXG4gICAqIDxhIGlkPSdwYXJhbXMnPjwvYT5cbiAgICpcbiAgICogLSAqKmBwYXJhbXNgKiogLSB7b2JqZWN0PX0gLSBBbiBhcnJheSBvZiBwYXJhbWV0ZXIgbmFtZXMgb3IgcmVndWxhciBleHByZXNzaW9ucy4gT25seSBcbiAgICogICB1c2UgdGhpcyB3aXRoaW4gYSBzdGF0ZSBpZiB5b3UgYXJlIG5vdCB1c2luZyB1cmwuIE90aGVyd2lzZSB5b3UgY2FuIHNwZWNpZnkgeW91clxuICAgKiAgIHBhcmFtZXRlcnMgd2l0aGluIHRoZSB1cmwuIFdoZW4gYSBzdGF0ZSBpcyBuYXZpZ2F0ZWQgb3IgdHJhbnNpdGlvbmVkIHRvLCB0aGUgXG4gICAqICAgJHN0YXRlUGFyYW1zIHNlcnZpY2Ugd2lsbCBiZSBwb3B1bGF0ZWQgd2l0aCBhbnkgcGFyYW1ldGVycyB0aGF0IHdlcmUgcGFzc2VkLlxuICAgKlxuICAgKiA8YSBpZD0ndmlld3MnPjwvYT5cbiAgICpcbiAgICogLSAqKmB2aWV3c2AqKiAtIHtvYmplY3Q9fSAtIFVzZSB0aGUgdmlld3MgcHJvcGVydHkgdG8gc2V0IHVwIG11bHRpcGxlIHZpZXdzIG9yIHRvIHRhcmdldCB2aWV3c1xuICAgKiAgIG1hbnVhbGx5L2V4cGxpY2l0bHkuXG4gICAqXG4gICAqIDxhIGlkPSdhYnN0cmFjdCc+PC9hPlxuICAgKlxuICAgKiAtICoqYGFic3RyYWN0YCoqIC0ge2Jvb2xlYW49fSAtIEFuIGFic3RyYWN0IHN0YXRlIHdpbGwgbmV2ZXIgYmUgZGlyZWN0bHkgYWN0aXZhdGVkLCBcbiAgICogICBidXQgY2FuIHByb3ZpZGUgaW5oZXJpdGVkIHByb3BlcnRpZXMgdG8gaXRzIGNvbW1vbiBjaGlsZHJlbiBzdGF0ZXMuXG4gICAqXG4gICAqIDxhIGlkPSdvbkVudGVyJz48L2E+XG4gICAqXG4gICAqIC0gKipgb25FbnRlcmAqKiAtIHtvYmplY3Q9fSAtIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB3aGVuIGEgc3RhdGUgaXMgZW50ZXJlZC4gR29vZCB3YXlcbiAgICogICB0byB0cmlnZ2VyIGFuIGFjdGlvbiBvciBkaXNwYXRjaCBhbiBldmVudCwgc3VjaCBhcyBvcGVuaW5nIGEgZGlhbG9nLlxuICAgKiBJZiBtaW5pZnlpbmcgeW91ciBzY3JpcHRzLCBtYWtlIHN1cmUgdG8gdXNlIHRoZSBgWydpbmplY3Rpb24xJywgJ2luamVjdGlvbjInLCBmdW5jdGlvbihpbmplY3Rpb24xLCBpbmplY3Rpb24yKXt9XWAgc3ludGF4LlxuICAgKlxuICAgKiA8YSBpZD0nb25FeGl0Jz48L2E+XG4gICAqXG4gICAqIC0gKipgb25FeGl0YCoqIC0ge29iamVjdD19IC0gQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHdoZW4gYSBzdGF0ZSBpcyBleGl0ZWQuIEdvb2Qgd2F5IHRvXG4gICAqICAgdHJpZ2dlciBhbiBhY3Rpb24gb3IgZGlzcGF0Y2ggYW4gZXZlbnQsIHN1Y2ggYXMgb3BlbmluZyBhIGRpYWxvZy5cbiAgICogSWYgbWluaWZ5aW5nIHlvdXIgc2NyaXB0cywgbWFrZSBzdXJlIHRvIHVzZSB0aGUgYFsnaW5qZWN0aW9uMScsICdpbmplY3Rpb24yJywgZnVuY3Rpb24oaW5qZWN0aW9uMSwgaW5qZWN0aW9uMil7fV1gIHN5bnRheC5cbiAgICpcbiAgICogPGEgaWQ9J3JlbG9hZE9uU2VhcmNoJz48L2E+XG4gICAqXG4gICAqIC0gKipgcmVsb2FkT25TZWFyY2ggPSB0cnVlYCoqIC0ge2Jvb2xlYW49fSAtIElmIGBmYWxzZWAsIHdpbGwgbm90IHJldHJpZ2dlciB0aGUgc2FtZSBzdGF0ZSBcbiAgICogICBqdXN0IGJlY2F1c2UgYSBzZWFyY2gvcXVlcnkgcGFyYW1ldGVyIGhhcyBjaGFuZ2VkICh2aWEgJGxvY2F0aW9uLnNlYXJjaCgpIG9yICRsb2NhdGlvbi5oYXNoKCkpLiBcbiAgICogICBVc2VmdWwgZm9yIHdoZW4geW91J2QgbGlrZSB0byBtb2RpZnkgJGxvY2F0aW9uLnNlYXJjaCgpIHdpdGhvdXQgdHJpZ2dlcmluZyBhIHJlbG9hZC5cbiAgICpcbiAgICogPGEgaWQ9J2RhdGEnPjwvYT5cbiAgICpcbiAgICogLSAqKmBkYXRhYCoqIC0ge29iamVjdD19IC0gQXJiaXRyYXJ5IGRhdGEgb2JqZWN0LCB1c2VmdWwgZm9yIGN1c3RvbSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiAvLyBTb21lIHN0YXRlIG5hbWUgZXhhbXBsZXNcbiAgICpcbiAgICogLy8gc3RhdGVOYW1lIGNhbiBiZSBhIHNpbmdsZSB0b3AtbGV2ZWwgbmFtZSAobXVzdCBiZSB1bmlxdWUpLlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWVcIiwge30pO1xuICAgKlxuICAgKiAvLyBPciBpdCBjYW4gYmUgYSBuZXN0ZWQgc3RhdGUgbmFtZS4gVGhpcyBzdGF0ZSBpcyBhIGNoaWxkIG9mIHRoZSBcbiAgICogLy8gYWJvdmUgXCJob21lXCIgc3RhdGUuXG4gICAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZS5uZXdlc3RcIiwge30pO1xuICAgKlxuICAgKiAvLyBOZXN0IHN0YXRlcyBhcyBkZWVwbHkgYXMgbmVlZGVkLlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWUubmV3ZXN0LmFiYy54eXouaW5jZXB0aW9uXCIsIHt9KTtcbiAgICpcbiAgICogLy8gc3RhdGUoKSByZXR1cm5zICRzdGF0ZVByb3ZpZGVyLCBzbyB5b3UgY2FuIGNoYWluIHN0YXRlIGRlY2xhcmF0aW9ucy5cbiAgICogJHN0YXRlUHJvdmlkZXJcbiAgICogICAuc3RhdGUoXCJob21lXCIsIHt9KVxuICAgKiAgIC5zdGF0ZShcImFib3V0XCIsIHt9KVxuICAgKiAgIC5zdGF0ZShcImNvbnRhY3RzXCIsIHt9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgdW5pcXVlIHN0YXRlIG5hbWUsIGUuZy4gXCJob21lXCIsIFwiYWJvdXRcIiwgXCJjb250YWN0c1wiLiBcbiAgICogVG8gY3JlYXRlIGEgcGFyZW50L2NoaWxkIHN0YXRlIHVzZSBhIGRvdCwgZS5nLiBcImFib3V0LnNhbGVzXCIsIFwiaG9tZS5uZXdlc3RcIi5cbiAgICogQHBhcmFtIHtvYmplY3R9IGRlZmluaXRpb24gU3RhdGUgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqL1xuICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIGZ1bmN0aW9uIHN0YXRlKG5hbWUsIGRlZmluaXRpb24pIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICBpZiAoaXNPYmplY3QobmFtZSkpIGRlZmluaXRpb24gPSBuYW1lO1xuICAgIGVsc2UgZGVmaW5pdGlvbi5uYW1lID0gbmFtZTtcbiAgICByZWdpc3RlclN0YXRlKGRlZmluaXRpb24pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgKlxuICAgKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICAgKiBAcmVxdWlyZXMgJHFcbiAgICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kdmlld1xuICAgKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZVxuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVBhcmFtc1xuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBwYXJhbXMgQSBwYXJhbSBvYmplY3QsIGUuZy4ge3NlY3Rpb25JZDogc2VjdGlvbi5pZCl9LCB0aGF0IFxuICAgKiB5b3UnZCBsaWtlIHRvIHRlc3QgYWdhaW5zdCB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUuXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjdXJyZW50IEEgcmVmZXJlbmNlIHRvIHRoZSBzdGF0ZSdzIGNvbmZpZyBvYmplY3QuIEhvd2V2ZXIgXG4gICAqIHlvdSBwYXNzZWQgaXQgaW4uIFVzZWZ1bCBmb3IgYWNjZXNzaW5nIGN1c3RvbSBkYXRhLlxuICAgKiBAcHJvcGVydHkge29iamVjdH0gdHJhbnNpdGlvbiBDdXJyZW50bHkgcGVuZGluZyB0cmFuc2l0aW9uLiBBIHByb21pc2UgdGhhdCdsbCBcbiAgICogcmVzb2x2ZSBvciByZWplY3QuXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgJHN0YXRlYCBzZXJ2aWNlIGlzIHJlc3BvbnNpYmxlIGZvciByZXByZXNlbnRpbmcgc3RhdGVzIGFzIHdlbGwgYXMgdHJhbnNpdGlvbmluZ1xuICAgKiBiZXR3ZWVuIHRoZW0uIEl0IGFsc28gcHJvdmlkZXMgaW50ZXJmYWNlcyB0byBhc2sgZm9yIGN1cnJlbnQgc3RhdGUgb3IgZXZlbiBzdGF0ZXNcbiAgICogeW91J3JlIGNvbWluZyBmcm9tLlxuICAgKi9cbiAgdGhpcy4kZ2V0ID0gJGdldDtcbiAgJGdldC4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRxJywgJyR2aWV3JywgJyRpbmplY3RvcicsICckcmVzb2x2ZScsICckc3RhdGVQYXJhbXMnLCAnJHVybFJvdXRlciddO1xuICBmdW5jdGlvbiAkZ2V0KCAgICRyb290U2NvcGUsICAgJHEsICAgJHZpZXcsICAgJGluamVjdG9yLCAgICRyZXNvbHZlLCAgICRzdGF0ZVBhcmFtcywgICAkdXJsUm91dGVyKSB7XG5cbiAgICB2YXIgVHJhbnNpdGlvblN1cGVyc2VkZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIHN1cGVyc2VkZWQnKSk7XG4gICAgdmFyIFRyYW5zaXRpb25QcmV2ZW50ZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIHByZXZlbnRlZCcpKTtcbiAgICB2YXIgVHJhbnNpdGlvbkFib3J0ZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIGFib3J0ZWQnKSk7XG4gICAgdmFyIFRyYW5zaXRpb25GYWlsZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIGZhaWxlZCcpKTtcblxuICAgIC8vIEhhbmRsZXMgdGhlIGNhc2Ugd2hlcmUgYSBzdGF0ZSB3aGljaCBpcyB0aGUgdGFyZ2V0IG9mIGEgdHJhbnNpdGlvbiBpcyBub3QgZm91bmQsIGFuZCB0aGUgdXNlclxuICAgIC8vIGNhbiBvcHRpb25hbGx5IHJldHJ5IG9yIGRlZmVyIHRoZSB0cmFuc2l0aW9uXG4gICAgZnVuY3Rpb24gaGFuZGxlUmVkaXJlY3QocmVkaXJlY3QsIHN0YXRlLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyRzdGF0ZU5vdEZvdW5kXG4gICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEZpcmVkIHdoZW4gYSByZXF1ZXN0ZWQgc3RhdGUgKipjYW5ub3QgYmUgZm91bmQqKiB1c2luZyB0aGUgcHJvdmlkZWQgc3RhdGUgbmFtZSBkdXJpbmcgdHJhbnNpdGlvbi5cbiAgICAgICAqIFRoZSBldmVudCBpcyBicm9hZGNhc3QgYWxsb3dpbmcgYW55IGhhbmRsZXJzIGEgc2luZ2xlIGNoYW5jZSB0byBkZWFsIHdpdGggdGhlIGVycm9yICh1c3VhbGx5IGJ5XG4gICAgICAgKiBsYXp5LWxvYWRpbmcgdGhlIHVuZm91bmQgc3RhdGUpLiBBIHNwZWNpYWwgYHVuZm91bmRTdGF0ZWAgb2JqZWN0IGlzIHBhc3NlZCB0byB0aGUgbGlzdGVuZXIgaGFuZGxlcixcbiAgICAgICAqIHlvdSBjYW4gc2VlIGl0cyB0aHJlZSBwcm9wZXJ0aWVzIGluIHRoZSBleGFtcGxlLiBZb3UgY2FuIHVzZSBgZXZlbnQucHJldmVudERlZmF1bHQoKWAgdG8gYWJvcnQgdGhlXG4gICAgICAgKiB0cmFuc2l0aW9uIGFuZCB0aGUgcHJvbWlzZSByZXR1cm5lZCBmcm9tIGBnb2Agd2lsbCBiZSByZWplY3RlZCB3aXRoIGEgYCd0cmFuc2l0aW9uIGFib3J0ZWQnYCB2YWx1ZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHVuZm91bmRTdGF0ZSBVbmZvdW5kIFN0YXRlIGluZm9ybWF0aW9uLiBDb250YWluczogYHRvLCB0b1BhcmFtcywgb3B0aW9uc2AgcHJvcGVydGllcy5cbiAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBDdXJyZW50IHN0YXRlIG9iamVjdC5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIEN1cnJlbnQgc3RhdGUgcGFyYW1zLlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKlxuICAgICAgICogPHByZT5cbiAgICAgICAqIC8vIHNvbWV3aGVyZSwgYXNzdW1lIGxhenkuc3RhdGUgaGFzIG5vdCBiZWVuIGRlZmluZWRcbiAgICAgICAqICRzdGF0ZS5nbyhcImxhenkuc3RhdGVcIiwge2E6MSwgYjoyfSwge2luaGVyaXQ6ZmFsc2V9KTtcbiAgICAgICAqXG4gICAgICAgKiAvLyBzb21ld2hlcmUgZWxzZVxuICAgICAgICogJHNjb3BlLiRvbignJHN0YXRlTm90Rm91bmQnLFxuICAgICAgICogZnVuY3Rpb24oZXZlbnQsIHVuZm91bmRTdGF0ZSwgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKXtcbiAgICAgICAqICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUudG8pOyAvLyBcImxhenkuc3RhdGVcIlxuICAgICAgICogICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS50b1BhcmFtcyk7IC8vIHthOjEsIGI6Mn1cbiAgICAgICAqICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUub3B0aW9ucyk7IC8vIHtpbmhlcml0OmZhbHNlfSArIGRlZmF1bHQgb3B0aW9uc1xuICAgICAgICogfSlcbiAgICAgICAqIDwvcHJlPlxuICAgICAgICovXG4gICAgICB2YXIgZXZ0ID0gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckc3RhdGVOb3RGb3VuZCcsIHJlZGlyZWN0LCBzdGF0ZSwgcGFyYW1zKTtcblxuICAgICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICR1cmxSb3V0ZXIudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiBUcmFuc2l0aW9uQWJvcnRlZDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFldnQucmV0cnkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIEFsbG93IHRoZSBoYW5kbGVyIHRvIHJldHVybiBhIHByb21pc2UgdG8gZGVmZXIgc3RhdGUgbG9va3VwIHJldHJ5XG4gICAgICBpZiAob3B0aW9ucy4kcmV0cnkpIHtcbiAgICAgICAgJHVybFJvdXRlci51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25GYWlsZWQ7XG4gICAgICB9XG4gICAgICB2YXIgcmV0cnlUcmFuc2l0aW9uID0gJHN0YXRlLnRyYW5zaXRpb24gPSAkcS53aGVuKGV2dC5yZXRyeSk7XG5cbiAgICAgIHJldHJ5VHJhbnNpdGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocmV0cnlUcmFuc2l0aW9uICE9PSAkc3RhdGUudHJhbnNpdGlvbikgcmV0dXJuIFRyYW5zaXRpb25TdXBlcnNlZGVkO1xuICAgICAgICByZWRpcmVjdC5vcHRpb25zLiRyZXRyeSA9IHRydWU7XG4gICAgICAgIHJldHVybiAkc3RhdGUudHJhbnNpdGlvblRvKHJlZGlyZWN0LnRvLCByZWRpcmVjdC50b1BhcmFtcywgcmVkaXJlY3Qub3B0aW9ucyk7XG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25BYm9ydGVkO1xuICAgICAgfSk7XG4gICAgICAkdXJsUm91dGVyLnVwZGF0ZSgpO1xuXG4gICAgICByZXR1cm4gcmV0cnlUcmFuc2l0aW9uO1xuICAgIH1cblxuICAgIHJvb3QubG9jYWxzID0geyByZXNvbHZlOiBudWxsLCBnbG9iYWxzOiB7ICRzdGF0ZVBhcmFtczoge30gfSB9O1xuXG4gICAgJHN0YXRlID0ge1xuICAgICAgcGFyYW1zOiB7fSxcbiAgICAgIGN1cnJlbnQ6IHJvb3Quc2VsZixcbiAgICAgICRjdXJyZW50OiByb290LFxuICAgICAgdHJhbnNpdGlvbjogbnVsbFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI3JlbG9hZFxuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBIG1ldGhvZCB0aGF0IGZvcmNlIHJlbG9hZHMgdGhlIGN1cnJlbnQgc3RhdGUuIEFsbCByZXNvbHZlcyBhcmUgcmUtcmVzb2x2ZWQsIGV2ZW50cyBhcmUgbm90IHJlLWZpcmVkLCBcbiAgICAgKiBhbmQgY29udHJvbGxlcnMgcmVpbnN0YW50aWF0ZWQgKGJ1ZyB3aXRoIGNvbnRyb2xsZXJzIHJlaW5zdGFudGlhdGluZyByaWdodCBub3csIGZpeGluZyBzb29uKS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiB2YXIgYXBwIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAgICAgKlxuICAgICAqIGFwcC5jb250cm9sbGVyKCdjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlKSB7XG4gICAgICogICAkc2NvcGUucmVsb2FkID0gZnVuY3Rpb24oKXtcbiAgICAgKiAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogYHJlbG9hZCgpYCBpcyBqdXN0IGFuIGFsaWFzIGZvcjpcbiAgICAgKiA8cHJlPlxuICAgICAqICRzdGF0ZS50cmFuc2l0aW9uVG8oJHN0YXRlLmN1cnJlbnQsICRzdGF0ZVBhcmFtcywgeyBcbiAgICAgKiAgIHJlbG9hZDogdHJ1ZSwgaW5oZXJpdDogZmFsc2UsIG5vdGlmeTogZmFsc2UgXG4gICAgICogfSk7XG4gICAgICogPC9wcmU+XG4gICAgICovXG4gICAgJHN0YXRlLnJlbG9hZCA9IGZ1bmN0aW9uIHJlbG9hZCgpIHtcbiAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oJHN0YXRlLmN1cnJlbnQsICRzdGF0ZVBhcmFtcywgeyByZWxvYWQ6IHRydWUsIGluaGVyaXQ6IGZhbHNlLCBub3RpZnk6IGZhbHNlIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2dvXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgdHJhbnNpdGlvbmluZyB0byBhIG5ldyBzdGF0ZS4gYCRzdGF0ZS5nb2AgY2FsbHMgXG4gICAgICogYCRzdGF0ZS50cmFuc2l0aW9uVG9gIGludGVybmFsbHkgYnV0IGF1dG9tYXRpY2FsbHkgc2V0cyBvcHRpb25zIHRvIFxuICAgICAqIGB7IGxvY2F0aW9uOiB0cnVlLCBpbmhlcml0OiB0cnVlLCByZWxhdGl2ZTogJHN0YXRlLiRjdXJyZW50LCBub3RpZnk6IHRydWUgfWAuIFxuICAgICAqIFRoaXMgYWxsb3dzIHlvdSB0byBlYXNpbHkgdXNlIGFuIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHBhdGggYW5kIHNwZWNpZnkgXG4gICAgICogb25seSB0aGUgcGFyYW1ldGVycyB5b3UnZCBsaWtlIHRvIHVwZGF0ZSAod2hpbGUgbGV0dGluZyB1bnNwZWNpZmllZCBwYXJhbWV0ZXJzIFxuICAgICAqIGluaGVyaXQgZnJvbSB0aGUgY3VycmVudGx5IGFjdGl2ZSBhbmNlc3RvciBzdGF0ZXMpLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInXSk7XG4gICAgICpcbiAgICAgKiBhcHAuY29udHJvbGxlcignY3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuICAgICAqICAgJHNjb3BlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAqICAgICAkc3RhdGUuZ28oJ2NvbnRhY3QuZGV0YWlsJyk7XG4gICAgICogICB9O1xuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqIDxpbWcgc3JjPScuLi9uZ2RvY19hc3NldHMvU3RhdGVHb0V4YW1wbGVzLnBuZycvPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRvIEFic29sdXRlIHN0YXRlIG5hbWUgb3IgcmVsYXRpdmUgc3RhdGUgcGF0aC4gU29tZSBleGFtcGxlczpcbiAgICAgKlxuICAgICAqIC0gYCRzdGF0ZS5nbygnY29udGFjdC5kZXRhaWwnKWAgLSB3aWxsIGdvIHRvIHRoZSBgY29udGFjdC5kZXRhaWxgIHN0YXRlXG4gICAgICogLSBgJHN0YXRlLmdvKCdeJylgIC0gd2lsbCBnbyB0byBhIHBhcmVudCBzdGF0ZVxuICAgICAqIC0gYCRzdGF0ZS5nbygnXi5zaWJsaW5nJylgIC0gd2lsbCBnbyB0byBhIHNpYmxpbmcgc3RhdGVcbiAgICAgKiAtIGAkc3RhdGUuZ28oJy5jaGlsZC5ncmFuZGNoaWxkJylgIC0gd2lsbCBnbyB0byBncmFuZGNoaWxkIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBIG1hcCBvZiB0aGUgcGFyYW1ldGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc3RhdGUsIFxuICAgICAqIHdpbGwgcG9wdWxhdGUgJHN0YXRlUGFyYW1zLiBBbnkgcGFyYW1ldGVycyB0aGF0IGFyZSBub3Qgc3BlY2lmaWVkIHdpbGwgYmUgaW5oZXJpdGVkIGZyb20gY3VycmVudGx5IFxuICAgICAqIGRlZmluZWQgcGFyYW1ldGVycy4gVGhpcyBhbGxvd3MsIGZvciBleGFtcGxlLCBnb2luZyB0byBhIHNpYmxpbmcgc3RhdGUgdGhhdCBzaGFyZXMgcGFyYW1ldGVyc1xuICAgICAqIHNwZWNpZmllZCBpbiBhIHBhcmVudCBzdGF0ZS4gUGFyYW1ldGVyIGluaGVyaXRhbmNlIG9ubHkgd29ya3MgYmV0d2VlbiBjb21tb24gYW5jZXN0b3Igc3RhdGVzLCBJLmUuXG4gICAgICogdHJhbnNpdGlvbmluZyB0byBhIHNpYmxpbmcgd2lsbCBnZXQgeW91IHRoZSBwYXJhbWV0ZXJzIGZvciBhbGwgcGFyZW50cywgdHJhbnNpdGlvbmluZyB0byBhIGNoaWxkXG4gICAgICogd2lsbCBnZXQgeW91IGFsbCBjdXJyZW50IHBhcmFtZXRlcnMsIGV0Yy5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QuIFRoZSBvcHRpb25zIGFyZTpcbiAgICAgKlxuICAgICAqIC0gKipgbG9jYXRpb25gKiogLSB7Ym9vbGVhbj10cnVlfHN0cmluZz19IC0gSWYgYHRydWVgIHdpbGwgdXBkYXRlIHRoZSB1cmwgaW4gdGhlIGxvY2F0aW9uIGJhciwgaWYgYGZhbHNlYFxuICAgICAqICAgIHdpbGwgbm90LiBJZiBzdHJpbmcsIG11c3QgYmUgYFwicmVwbGFjZVwiYCwgd2hpY2ggd2lsbCB1cGRhdGUgdXJsIGFuZCBhbHNvIHJlcGxhY2UgbGFzdCBoaXN0b3J5IHJlY29yZC5cbiAgICAgKiAtICoqYGluaGVyaXRgKiogLSB7Ym9vbGVhbj10cnVlfSwgSWYgYHRydWVgIHdpbGwgaW5oZXJpdCB1cmwgcGFyYW1ldGVycyBmcm9tIGN1cnJlbnQgdXJsLlxuICAgICAqIC0gKipgcmVsYXRpdmVgKiogLSB7b2JqZWN0PSRzdGF0ZS4kY3VycmVudH0sIFdoZW4gdHJhbnNpdGlvbmluZyB3aXRoIHJlbGF0aXZlIHBhdGggKGUuZyAnXicpLCBcbiAgICAgKiAgICBkZWZpbmVzIHdoaWNoIHN0YXRlIHRvIGJlIHJlbGF0aXZlIGZyb20uXG4gICAgICogLSAqKmBub3RpZnlgKiogLSB7Ym9vbGVhbj10cnVlfSwgSWYgYHRydWVgIHdpbGwgYnJvYWRjYXN0ICRzdGF0ZUNoYW5nZVN0YXJ0IGFuZCAkc3RhdGVDaGFuZ2VTdWNjZXNzIGV2ZW50cy5cbiAgICAgKiAtICoqYHJlbG9hZGAqKiAodjAuMi41KSAtIHtib29sZWFuPWZhbHNlfSwgSWYgYHRydWVgIHdpbGwgZm9yY2UgdHJhbnNpdGlvbiBldmVuIGlmIHRoZSBzdGF0ZSBvciBwYXJhbXMgXG4gICAgICogICAgaGF2ZSBub3QgY2hhbmdlZCwgYWthIGEgcmVsb2FkIG9mIHRoZSBzYW1lIHN0YXRlLiBJdCBkaWZmZXJzIGZyb20gcmVsb2FkT25TZWFyY2ggYmVjYXVzZSB5b3UnZFxuICAgICAqICAgIHVzZSB0aGlzIHdoZW4geW91IHdhbnQgdG8gZm9yY2UgYSByZWxvYWQgd2hlbiAqZXZlcnl0aGluZyogaXMgdGhlIHNhbWUsIGluY2x1ZGluZyBzZWFyY2ggcGFyYW1zLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3Byb21pc2V9IEEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN0YXRlIG9mIHRoZSBuZXcgdHJhbnNpdGlvbi5cbiAgICAgKlxuICAgICAqIFBvc3NpYmxlIHN1Y2Nlc3MgdmFsdWVzOlxuICAgICAqXG4gICAgICogLSAkc3RhdGUuY3VycmVudFxuICAgICAqXG4gICAgICogPGJyLz5Qb3NzaWJsZSByZWplY3Rpb24gdmFsdWVzOlxuICAgICAqXG4gICAgICogLSAndHJhbnNpdGlvbiBzdXBlcnNlZGVkJyAtIHdoZW4gYSBuZXdlciB0cmFuc2l0aW9uIGhhcyBiZWVuIHN0YXJ0ZWQgYWZ0ZXIgdGhpcyBvbmVcbiAgICAgKiAtICd0cmFuc2l0aW9uIHByZXZlbnRlZCcgLSB3aGVuIGBldmVudC5wcmV2ZW50RGVmYXVsdCgpYCBoYXMgYmVlbiBjYWxsZWQgaW4gYSBgJHN0YXRlQ2hhbmdlU3RhcnRgIGxpc3RlbmVyXG4gICAgICogLSAndHJhbnNpdGlvbiBhYm9ydGVkJyAtIHdoZW4gYGV2ZW50LnByZXZlbnREZWZhdWx0KClgIGhhcyBiZWVuIGNhbGxlZCBpbiBhIGAkc3RhdGVOb3RGb3VuZGAgbGlzdGVuZXIgb3JcbiAgICAgKiAgIHdoZW4gYSBgJHN0YXRlTm90Rm91bmRgIGBldmVudC5yZXRyeWAgcHJvbWlzZSBlcnJvcnMuXG4gICAgICogLSAndHJhbnNpdGlvbiBmYWlsZWQnIC0gd2hlbiBhIHN0YXRlIGhhcyBiZWVuIHVuc3VjY2Vzc2Z1bGx5IGZvdW5kIGFmdGVyIDIgdHJpZXMuXG4gICAgICogLSAqcmVzb2x2ZSBlcnJvciogLSB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCB3aXRoIGEgYHJlc29sdmVgXG4gICAgICpcbiAgICAgKi9cbiAgICAkc3RhdGUuZ28gPSBmdW5jdGlvbiBnbyh0bywgcGFyYW1zLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gJHN0YXRlLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBleHRlbmQoeyBpbmhlcml0OiB0cnVlLCByZWxhdGl2ZTogJHN0YXRlLiRjdXJyZW50IH0sIG9wdGlvbnMpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSN0cmFuc2l0aW9uVG9cbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTG93LWxldmVsIG1ldGhvZCBmb3IgdHJhbnNpdGlvbmluZyB0byBhIG5ldyBzdGF0ZS4ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19nbyAkc3RhdGUuZ299XG4gICAgICogdXNlcyBgdHJhbnNpdGlvblRvYCBpbnRlcm5hbGx5LiBgJHN0YXRlLmdvYCBpcyByZWNvbW1lbmRlZCBpbiBtb3N0IHNpdHVhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAgICAgKlxuICAgICAqIGFwcC5jb250cm9sbGVyKCdjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlKSB7XG4gICAgICogICAkc2NvcGUuY2hhbmdlU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICogICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oJ2NvbnRhY3QuZGV0YWlsJyk7XG4gICAgICogICB9O1xuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRvIFN0YXRlIG5hbWUuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSB0b1BhcmFtcyBBIG1hcCBvZiB0aGUgcGFyYW1ldGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc3RhdGUsXG4gICAgICogd2lsbCBwb3B1bGF0ZSAkc3RhdGVQYXJhbXMuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0LiBUaGUgb3B0aW9ucyBhcmU6XG4gICAgICpcbiAgICAgKiAtICoqYGxvY2F0aW9uYCoqIC0ge2Jvb2xlYW49dHJ1ZXxzdHJpbmc9fSAtIElmIGB0cnVlYCB3aWxsIHVwZGF0ZSB0aGUgdXJsIGluIHRoZSBsb2NhdGlvbiBiYXIsIGlmIGBmYWxzZWBcbiAgICAgKiAgICB3aWxsIG5vdC4gSWYgc3RyaW5nLCBtdXN0IGJlIGBcInJlcGxhY2VcImAsIHdoaWNoIHdpbGwgdXBkYXRlIHVybCBhbmQgYWxzbyByZXBsYWNlIGxhc3QgaGlzdG9yeSByZWNvcmQuXG4gICAgICogLSAqKmBpbmhlcml0YCoqIC0ge2Jvb2xlYW49ZmFsc2V9LCBJZiBgdHJ1ZWAgd2lsbCBpbmhlcml0IHVybCBwYXJhbWV0ZXJzIGZyb20gY3VycmVudCB1cmwuXG4gICAgICogLSAqKmByZWxhdGl2ZWAqKiAtIHtvYmplY3Q9fSwgV2hlbiB0cmFuc2l0aW9uaW5nIHdpdGggcmVsYXRpdmUgcGF0aCAoZS5nICdeJyksIFxuICAgICAqICAgIGRlZmluZXMgd2hpY2ggc3RhdGUgdG8gYmUgcmVsYXRpdmUgZnJvbS5cbiAgICAgKiAtICoqYG5vdGlmeWAqKiAtIHtib29sZWFuPXRydWV9LCBJZiBgdHJ1ZWAgd2lsbCBicm9hZGNhc3QgJHN0YXRlQ2hhbmdlU3RhcnQgYW5kICRzdGF0ZUNoYW5nZVN1Y2Nlc3MgZXZlbnRzLlxuICAgICAqIC0gKipgcmVsb2FkYCoqICh2MC4yLjUpIC0ge2Jvb2xlYW49ZmFsc2V9LCBJZiBgdHJ1ZWAgd2lsbCBmb3JjZSB0cmFuc2l0aW9uIGV2ZW4gaWYgdGhlIHN0YXRlIG9yIHBhcmFtcyBcbiAgICAgKiAgICBoYXZlIG5vdCBjaGFuZ2VkLCBha2EgYSByZWxvYWQgb2YgdGhlIHNhbWUgc3RhdGUuIEl0IGRpZmZlcnMgZnJvbSByZWxvYWRPblNlYXJjaCBiZWNhdXNlIHlvdSdkXG4gICAgICogICAgdXNlIHRoaXMgd2hlbiB5b3Ugd2FudCB0byBmb3JjZSBhIHJlbG9hZCB3aGVuICpldmVyeXRoaW5nKiBpcyB0aGUgc2FtZSwgaW5jbHVkaW5nIHNlYXJjaCBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gQSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3RhdGUgb2YgdGhlIG5ldyB0cmFuc2l0aW9uLiBTZWVcbiAgICAgKiB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2dvICRzdGF0ZS5nb30uXG4gICAgICovXG4gICAgJHN0YXRlLnRyYW5zaXRpb25UbyA9IGZ1bmN0aW9uIHRyYW5zaXRpb25Ubyh0bywgdG9QYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgIHRvUGFyYW1zID0gdG9QYXJhbXMgfHwge307XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKHtcbiAgICAgICAgbG9jYXRpb246IHRydWUsIGluaGVyaXQ6IGZhbHNlLCByZWxhdGl2ZTogbnVsbCwgbm90aWZ5OiB0cnVlLCByZWxvYWQ6IGZhbHNlLCAkcmV0cnk6IGZhbHNlXG4gICAgICB9LCBvcHRpb25zIHx8IHt9KTtcblxuICAgICAgdmFyIGZyb20gPSAkc3RhdGUuJGN1cnJlbnQsIGZyb21QYXJhbXMgPSAkc3RhdGUucGFyYW1zLCBmcm9tUGF0aCA9IGZyb20ucGF0aDtcbiAgICAgIHZhciBldnQsIHRvU3RhdGUgPSBmaW5kU3RhdGUodG8sIG9wdGlvbnMucmVsYXRpdmUpO1xuXG4gICAgICBpZiAoIWlzRGVmaW5lZCh0b1N0YXRlKSkge1xuICAgICAgICB2YXIgcmVkaXJlY3QgPSB7IHRvOiB0bywgdG9QYXJhbXM6IHRvUGFyYW1zLCBvcHRpb25zOiBvcHRpb25zIH07XG4gICAgICAgIHZhciByZWRpcmVjdFJlc3VsdCA9IGhhbmRsZVJlZGlyZWN0KHJlZGlyZWN0LCBmcm9tLnNlbGYsIGZyb21QYXJhbXMsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChyZWRpcmVjdFJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZWRpcmVjdFJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyByZXRyeSBvbmNlIGlmIHRoZSAkc3RhdGVOb3RGb3VuZCB3YXMgbm90IHByZXZlbnRlZFxuICAgICAgICAvLyAoaGFuZGxlcyBlaXRoZXIgcmVkaXJlY3QgY2hhbmdlZCBvciBzdGF0ZSBsYXp5LWRlZmluaXRpb24pXG4gICAgICAgIHRvID0gcmVkaXJlY3QudG87XG4gICAgICAgIHRvUGFyYW1zID0gcmVkaXJlY3QudG9QYXJhbXM7XG4gICAgICAgIG9wdGlvbnMgPSByZWRpcmVjdC5vcHRpb25zO1xuICAgICAgICB0b1N0YXRlID0gZmluZFN0YXRlKHRvLCBvcHRpb25zLnJlbGF0aXZlKTtcblxuICAgICAgICBpZiAoIWlzRGVmaW5lZCh0b1N0YXRlKSkge1xuICAgICAgICAgIGlmICghb3B0aW9ucy5yZWxhdGl2ZSkgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCBzdGF0ZSAnXCIgKyB0byArIFwiJ1wiKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcmVzb2x2ZSAnXCIgKyB0byArIFwiJyBmcm9tIHN0YXRlICdcIiArIG9wdGlvbnMucmVsYXRpdmUgKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0b1N0YXRlW2Fic3RyYWN0S2V5XSkgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHRyYW5zaXRpb24gdG8gYWJzdHJhY3Qgc3RhdGUgJ1wiICsgdG8gKyBcIidcIik7XG4gICAgICBpZiAob3B0aW9ucy5pbmhlcml0KSB0b1BhcmFtcyA9IGluaGVyaXRQYXJhbXMoJHN0YXRlUGFyYW1zLCB0b1BhcmFtcyB8fCB7fSwgJHN0YXRlLiRjdXJyZW50LCB0b1N0YXRlKTtcbiAgICAgIHRvID0gdG9TdGF0ZTtcblxuICAgICAgdmFyIHRvUGF0aCA9IHRvLnBhdGg7XG5cbiAgICAgIC8vIFN0YXJ0aW5nIGZyb20gdGhlIHJvb3Qgb2YgdGhlIHBhdGgsIGtlZXAgYWxsIGxldmVscyB0aGF0IGhhdmVuJ3QgY2hhbmdlZFxuICAgICAgdmFyIGtlZXAgPSAwLCBzdGF0ZSA9IHRvUGF0aFtrZWVwXSwgbG9jYWxzID0gcm9vdC5sb2NhbHMsIHRvTG9jYWxzID0gW107XG5cbiAgICAgIGlmICghb3B0aW9ucy5yZWxvYWQpIHtcbiAgICAgICAgd2hpbGUgKHN0YXRlICYmIHN0YXRlID09PSBmcm9tUGF0aFtrZWVwXSAmJiBlcXVhbEZvcktleXModG9QYXJhbXMsIGZyb21QYXJhbXMsIHN0YXRlLm93blBhcmFtcykpIHtcbiAgICAgICAgICBsb2NhbHMgPSB0b0xvY2Fsc1trZWVwXSA9IHN0YXRlLmxvY2FscztcbiAgICAgICAgICBrZWVwKys7XG4gICAgICAgICAgc3RhdGUgPSB0b1BhdGhba2VlcF07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UncmUgZ29pbmcgdG8gdGhlIHNhbWUgc3RhdGUgYW5kIGFsbCBsb2NhbHMgYXJlIGtlcHQsIHdlJ3ZlIGdvdCBub3RoaW5nIHRvIGRvLlxuICAgICAgLy8gQnV0IGNsZWFyICd0cmFuc2l0aW9uJywgYXMgd2Ugc3RpbGwgd2FudCB0byBjYW5jZWwgYW55IG90aGVyIHBlbmRpbmcgdHJhbnNpdGlvbnMuXG4gICAgICAvLyBUT0RPOiBXZSBtYXkgbm90IHdhbnQgdG8gYnVtcCAndHJhbnNpdGlvbicgaWYgd2UncmUgY2FsbGVkIGZyb20gYSBsb2NhdGlvbiBjaGFuZ2VcbiAgICAgIC8vIHRoYXQgd2UndmUgaW5pdGlhdGVkIG91cnNlbHZlcywgYmVjYXVzZSB3ZSBtaWdodCBhY2NpZGVudGFsbHkgYWJvcnQgYSBsZWdpdGltYXRlXG4gICAgICAvLyB0cmFuc2l0aW9uIGluaXRpYXRlZCBmcm9tIGNvZGU/XG4gICAgICBpZiAoc2hvdWxkVHJpZ2dlclJlbG9hZCh0bywgZnJvbSwgbG9jYWxzLCBvcHRpb25zKSkge1xuICAgICAgICBpZiAodG8uc2VsZi5yZWxvYWRPblNlYXJjaCAhPT0gZmFsc2UpICR1cmxSb3V0ZXIudXBkYXRlKCk7XG4gICAgICAgICRzdGF0ZS50cmFuc2l0aW9uID0gbnVsbDtcbiAgICAgICAgcmV0dXJuICRxLndoZW4oJHN0YXRlLmN1cnJlbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBGaWx0ZXIgcGFyYW1ldGVycyBiZWZvcmUgd2UgcGFzcyB0aGVtIHRvIGV2ZW50IGhhbmRsZXJzIGV0Yy5cbiAgICAgIHRvUGFyYW1zID0gZmlsdGVyQnlLZXlzKG9iamVjdEtleXModG8ucGFyYW1zKSwgdG9QYXJhbXMgfHwge30pO1xuXG4gICAgICAvLyBCcm9hZGNhc3Qgc3RhcnQgZXZlbnQgYW5kIGNhbmNlbCB0aGUgdHJhbnNpdGlvbiBpZiByZXF1ZXN0ZWRcbiAgICAgIGlmIChvcHRpb25zLm5vdGlmeSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlQ2hhbmdlU3RhcnRcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBGaXJlZCB3aGVuIHRoZSBzdGF0ZSB0cmFuc2l0aW9uICoqYmVnaW5zKiouIFlvdSBjYW4gdXNlIGBldmVudC5wcmV2ZW50RGVmYXVsdCgpYFxuICAgICAgICAgKiB0byBwcmV2ZW50IHRoZSB0cmFuc2l0aW9uIGZyb20gaGFwcGVuaW5nIGFuZCB0aGVuIHRoZSB0cmFuc2l0aW9uIHByb21pc2Ugd2lsbCBiZVxuICAgICAgICAgKiByZWplY3RlZCB3aXRoIGEgYCd0cmFuc2l0aW9uIHByZXZlbnRlZCdgIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSB0b1N0YXRlIFRoZSBzdGF0ZSBiZWluZyB0cmFuc2l0aW9uZWQgdG8uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b1BhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgdG9TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSwgcHJlLXRyYW5zaXRpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGBmcm9tU3RhdGVgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLFxuICAgICAgICAgKiBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG4gICAgICAgICAqICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgKiAgICAgLy8gdHJhbnNpdGlvblRvKCkgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGhcbiAgICAgICAgICogICAgIC8vIGEgJ3RyYW5zaXRpb24gcHJldmVudGVkJyBlcnJvclxuICAgICAgICAgKiB9KVxuICAgICAgICAgKiA8L3ByZT5cbiAgICAgICAgICovXG4gICAgICAgIGlmICgkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRzdGF0ZUNoYW5nZVN0YXJ0JywgdG8uc2VsZiwgdG9QYXJhbXMsIGZyb20uc2VsZiwgZnJvbVBhcmFtcykuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICR1cmxSb3V0ZXIudXBkYXRlKCk7XG4gICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25QcmV2ZW50ZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVzb2x2ZSBsb2NhbHMgZm9yIHRoZSByZW1haW5pbmcgc3RhdGVzLCBidXQgZG9uJ3QgdXBkYXRlIGFueSBnbG9iYWwgc3RhdGUganVzdFxuICAgICAgLy8geWV0IC0tIGlmIGFueXRoaW5nIGZhaWxzIHRvIHJlc29sdmUgdGhlIGN1cnJlbnQgc3RhdGUgbmVlZHMgdG8gcmVtYWluIHVudG91Y2hlZC5cbiAgICAgIC8vIFdlIGFsc28gc2V0IHVwIGFuIGluaGVyaXRhbmNlIGNoYWluIGZvciB0aGUgbG9jYWxzIGhlcmUuIFRoaXMgYWxsb3dzIHRoZSB2aWV3IGRpcmVjdGl2ZVxuICAgICAgLy8gdG8gcXVpY2tseSBsb29rIHVwIHRoZSBjb3JyZWN0IGRlZmluaXRpb24gZm9yIGVhY2ggdmlldyBpbiB0aGUgY3VycmVudCBzdGF0ZS4gRXZlblxuICAgICAgLy8gdGhvdWdoIHdlIGNyZWF0ZSB0aGUgbG9jYWxzIG9iamVjdCBpdHNlbGYgb3V0c2lkZSByZXNvbHZlU3RhdGUoKSwgaXQgaXMgaW5pdGlhbGx5XG4gICAgICAvLyBlbXB0eSBhbmQgZ2V0cyBmaWxsZWQgYXN5bmNocm9ub3VzbHkuIFdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgcHJvbWlzZSBmb3IgdGhlXG4gICAgICAvLyAoZnVsbHkgcmVzb2x2ZWQpIGN1cnJlbnQgbG9jYWxzLCBhbmQgcGFzcyB0aGlzIGRvd24gdGhlIGNoYWluLlxuICAgICAgdmFyIHJlc29sdmVkID0gJHEud2hlbihsb2NhbHMpO1xuXG4gICAgICBmb3IgKHZhciBsID0ga2VlcDsgbCA8IHRvUGF0aC5sZW5ndGg7IGwrKywgc3RhdGUgPSB0b1BhdGhbbF0pIHtcbiAgICAgICAgbG9jYWxzID0gdG9Mb2NhbHNbbF0gPSBpbmhlcml0KGxvY2Fscyk7XG4gICAgICAgIHJlc29sdmVkID0gcmVzb2x2ZVN0YXRlKHN0YXRlLCB0b1BhcmFtcywgc3RhdGUgPT09IHRvLCByZXNvbHZlZCwgbG9jYWxzKTtcbiAgICAgIH1cblxuICAgICAgLy8gT25jZSBldmVyeXRoaW5nIGlzIHJlc29sdmVkLCB3ZSBhcmUgcmVhZHkgdG8gcGVyZm9ybSB0aGUgYWN0dWFsIHRyYW5zaXRpb25cbiAgICAgIC8vIGFuZCByZXR1cm4gYSBwcm9taXNlIGZvciB0aGUgbmV3IHN0YXRlLiBXZSBhbHNvIGtlZXAgdHJhY2sgb2Ygd2hhdCB0aGVcbiAgICAgIC8vIGN1cnJlbnQgcHJvbWlzZSBpcywgc28gdGhhdCB3ZSBjYW4gZGV0ZWN0IG92ZXJsYXBwaW5nIHRyYW5zaXRpb25zIGFuZFxuICAgICAgLy8ga2VlcCBvbmx5IHRoZSBvdXRjb21lIG9mIHRoZSBsYXN0IHRyYW5zaXRpb24uXG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICRzdGF0ZS50cmFuc2l0aW9uID0gcmVzb2x2ZWQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsLCBlbnRlcmluZywgZXhpdGluZztcblxuICAgICAgICBpZiAoJHN0YXRlLnRyYW5zaXRpb24gIT09IHRyYW5zaXRpb24pIHJldHVybiBUcmFuc2l0aW9uU3VwZXJzZWRlZDtcblxuICAgICAgICAvLyBFeGl0ICdmcm9tJyBzdGF0ZXMgbm90IGtlcHRcbiAgICAgICAgZm9yIChsID0gZnJvbVBhdGgubGVuZ3RoIC0gMTsgbCA+PSBrZWVwOyBsLS0pIHtcbiAgICAgICAgICBleGl0aW5nID0gZnJvbVBhdGhbbF07XG4gICAgICAgICAgaWYgKGV4aXRpbmcuc2VsZi5vbkV4aXQpIHtcbiAgICAgICAgICAgICRpbmplY3Rvci5pbnZva2UoZXhpdGluZy5zZWxmLm9uRXhpdCwgZXhpdGluZy5zZWxmLCBleGl0aW5nLmxvY2Fscy5nbG9iYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhpdGluZy5sb2NhbHMgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW50ZXIgJ3RvJyBzdGF0ZXMgbm90IGtlcHRcbiAgICAgICAgZm9yIChsID0ga2VlcDsgbCA8IHRvUGF0aC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgIGVudGVyaW5nID0gdG9QYXRoW2xdO1xuICAgICAgICAgIGVudGVyaW5nLmxvY2FscyA9IHRvTG9jYWxzW2xdO1xuICAgICAgICAgIGlmIChlbnRlcmluZy5zZWxmLm9uRW50ZXIpIHtcbiAgICAgICAgICAgICRpbmplY3Rvci5pbnZva2UoZW50ZXJpbmcuc2VsZi5vbkVudGVyLCBlbnRlcmluZy5zZWxmLCBlbnRlcmluZy5sb2NhbHMuZ2xvYmFscyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUnVuIGl0IGFnYWluLCB0byBjYXRjaCBhbnkgdHJhbnNpdGlvbnMgaW4gY2FsbGJhY2tzXG4gICAgICAgIGlmICgkc3RhdGUudHJhbnNpdGlvbiAhPT0gdHJhbnNpdGlvbikgcmV0dXJuIFRyYW5zaXRpb25TdXBlcnNlZGVkO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBnbG9iYWxzIGluICRzdGF0ZVxuICAgICAgICAkc3RhdGUuJGN1cnJlbnQgPSB0bztcbiAgICAgICAgJHN0YXRlLmN1cnJlbnQgPSB0by5zZWxmO1xuICAgICAgICAkc3RhdGUucGFyYW1zID0gdG9QYXJhbXM7XG4gICAgICAgIGNvcHkoJHN0YXRlLnBhcmFtcywgJHN0YXRlUGFyYW1zKTtcbiAgICAgICAgJHN0YXRlLnRyYW5zaXRpb24gPSBudWxsO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmxvY2F0aW9uICYmIHRvLm5hdmlnYWJsZSkge1xuICAgICAgICAgICR1cmxSb3V0ZXIucHVzaCh0by5uYXZpZ2FibGUudXJsLCB0by5uYXZpZ2FibGUubG9jYWxzLmdsb2JhbHMuJHN0YXRlUGFyYW1zLCB7XG4gICAgICAgICAgICByZXBsYWNlOiBvcHRpb25zLmxvY2F0aW9uID09PSAncmVwbGFjZSdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm5vdGlmeSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlQ2hhbmdlU3VjY2Vzc1xuICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEZpcmVkIG9uY2UgdGhlIHN0YXRlIHRyYW5zaXRpb24gaXMgKipjb21wbGV0ZSoqLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSB0b1N0YXRlIFRoZSBzdGF0ZSBiZWluZyB0cmFuc2l0aW9uZWQgdG8uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b1BhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgdG9TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSwgcHJlLXRyYW5zaXRpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGBmcm9tU3RhdGVgLlxuICAgICAgICAgKi9cbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCB0by5zZWxmLCB0b1BhcmFtcywgZnJvbS5zZWxmLCBmcm9tUGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICAkdXJsUm91dGVyLnVwZGF0ZSh0cnVlKTtcblxuICAgICAgICByZXR1cm4gJHN0YXRlLmN1cnJlbnQ7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKCRzdGF0ZS50cmFuc2l0aW9uICE9PSB0cmFuc2l0aW9uKSByZXR1cm4gVHJhbnNpdGlvblN1cGVyc2VkZWQ7XG5cbiAgICAgICAgJHN0YXRlLnRyYW5zaXRpb24gPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlQ2hhbmdlRXJyb3JcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBGaXJlZCB3aGVuIGFuICoqZXJyb3Igb2NjdXJzKiogZHVyaW5nIHRyYW5zaXRpb24uIEl0J3MgaW1wb3J0YW50IHRvIG5vdGUgdGhhdCBpZiB5b3VcbiAgICAgICAgICogaGF2ZSBhbnkgZXJyb3JzIGluIHlvdXIgcmVzb2x2ZSBmdW5jdGlvbnMgKGphdmFzY3JpcHQgZXJyb3JzLCBub24tZXhpc3RlbnQgc2VydmljZXMsIGV0YylcbiAgICAgICAgICogdGhleSB3aWxsIG5vdCB0aHJvdyB0cmFkaXRpb25hbGx5LiBZb3UgbXVzdCBsaXN0ZW4gZm9yIHRoaXMgJHN0YXRlQ2hhbmdlRXJyb3IgZXZlbnQgdG9cbiAgICAgICAgICogY2F0Y2ggKipBTEwqKiBlcnJvcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IHRvU3RhdGUgVGhlIHN0YXRlIGJlaW5nIHRyYW5zaXRpb25lZCB0by5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRvUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGB0b1N0YXRlYC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gZnJvbVN0YXRlIFRoZSBjdXJyZW50IHN0YXRlLCBwcmUtdHJhbnNpdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZyb21QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYGZyb21TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSByZXNvbHZlIGVycm9yIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGV2dCA9ICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHN0YXRlQ2hhbmdlRXJyb3InLCB0by5zZWxmLCB0b1BhcmFtcywgZnJvbS5zZWxmLCBmcm9tUGFyYW1zLCBlcnJvcik7XG5cbiAgICAgICAgaWYgKCFldnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgJHVybFJvdXRlci51cGRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2lzXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNpbWlsYXIgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19pbmNsdWRlcyAkc3RhdGUuaW5jbHVkZXN9LFxuICAgICAqIGJ1dCBvbmx5IGNoZWNrcyBmb3IgdGhlIGZ1bGwgc3RhdGUgbmFtZS4gSWYgcGFyYW1zIGlzIHN1cHBsaWVkIHRoZW4gaXQgd2lsbCBiZSBcbiAgICAgKiB0ZXN0ZWQgZm9yIHN0cmljdCBlcXVhbGl0eSBhZ2FpbnN0IHRoZSBjdXJyZW50IGFjdGl2ZSBwYXJhbXMgb2JqZWN0LCBzbyBhbGwgcGFyYW1zIFxuICAgICAqIG11c3QgbWF0Y2ggd2l0aCBub25lIG1pc3NpbmcgYW5kIG5vIGV4dHJhcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiAkc3RhdGUuJGN1cnJlbnQubmFtZSA9ICdjb250YWN0cy5kZXRhaWxzLml0ZW0nO1xuICAgICAqXG4gICAgICogLy8gYWJzb2x1dGUgbmFtZVxuICAgICAqICRzdGF0ZS5pcygnY29udGFjdC5kZXRhaWxzLml0ZW0nKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmlzKGNvbnRhY3REZXRhaWxJdGVtU3RhdGVPYmplY3QpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKlxuICAgICAqIC8vIHJlbGF0aXZlIG5hbWUgKC4gYW5kIF4pLCB0eXBpY2FsbHkgZnJvbSBhIHRlbXBsYXRlXG4gICAgICogLy8gRS5nLiBmcm9tIHRoZSAnY29udGFjdHMuZGV0YWlscycgdGVtcGxhdGVcbiAgICAgKiA8ZGl2IG5nLWNsYXNzPVwie2hpZ2hsaWdodGVkOiAkc3RhdGUuaXMoJy5pdGVtJyl9XCI+SXRlbTwvZGl2PlxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBzdGF0ZU5hbWUgVGhlIHN0YXRlIG5hbWUgKGFic29sdXRlIG9yIHJlbGF0aXZlKSBvciBzdGF0ZSBvYmplY3QgeW91J2QgbGlrZSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBIHBhcmFtIG9iamVjdCwgZS5nLiBge3NlY3Rpb25JZDogc2VjdGlvbi5pZH1gLCB0aGF0IHlvdSdkIGxpa2UgXG4gICAgICogdG8gdGVzdCBhZ2FpbnN0IHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGl0IGlzIHRoZSBzdGF0ZS5cbiAgICAgKi9cbiAgICAkc3RhdGUuaXMgPSBmdW5jdGlvbiBpcyhzdGF0ZU9yTmFtZSwgcGFyYW1zKSB7XG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUpO1xuXG4gICAgICBpZiAoIWlzRGVmaW5lZChzdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKCRzdGF0ZS4kY3VycmVudCAhPT0gc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNEZWZpbmVkKHBhcmFtcykgJiYgcGFyYW1zICE9PSBudWxsID8gYW5ndWxhci5lcXVhbHMoJHN0YXRlUGFyYW1zLCBwYXJhbXMpIDogdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNpbmNsdWRlc1xuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBIG1ldGhvZCB0byBkZXRlcm1pbmUgaWYgdGhlIGN1cnJlbnQgYWN0aXZlIHN0YXRlIGlzIGVxdWFsIHRvIG9yIGlzIHRoZSBjaGlsZCBvZiB0aGVcbiAgICAgKiBzdGF0ZSBzdGF0ZU5hbWUuIElmIGFueSBwYXJhbXMgYXJlIHBhc3NlZCB0aGVuIHRoZXkgd2lsbCBiZSB0ZXN0ZWQgZm9yIGEgbWF0Y2ggYXMgd2VsbC5cbiAgICAgKiBOb3QgYWxsIHRoZSBwYXJhbWV0ZXJzIG5lZWQgdG8gYmUgcGFzc2VkLCBqdXN0IHRoZSBvbmVzIHlvdSdkIGxpa2UgdG8gdGVzdCBmb3IgZXF1YWxpdHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFBhcnRpYWwgYW5kIHJlbGF0aXZlIG5hbWVzXG4gICAgICogPHByZT5cbiAgICAgKiAkc3RhdGUuJGN1cnJlbnQubmFtZSA9ICdjb250YWN0cy5kZXRhaWxzLml0ZW0nO1xuICAgICAqXG4gICAgICogLy8gVXNpbmcgcGFydGlhbCBuYW1lc1xuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImNvbnRhY3RzXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJjb250YWN0cy5kZXRhaWxzXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJjb250YWN0cy5kZXRhaWxzLml0ZW1cIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImNvbnRhY3RzLmxpc3RcIik7IC8vIHJldHVybnMgZmFsc2VcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJhYm91dFwiKTsgLy8gcmV0dXJucyBmYWxzZVxuICAgICAqXG4gICAgICogLy8gVXNpbmcgcmVsYXRpdmUgbmFtZXMgKC4gYW5kIF4pLCB0eXBpY2FsbHkgZnJvbSBhIHRlbXBsYXRlXG4gICAgICogLy8gRS5nLiBmcm9tIHRoZSAnY29udGFjdHMuZGV0YWlscycgdGVtcGxhdGVcbiAgICAgKiA8ZGl2IG5nLWNsYXNzPVwie2hpZ2hsaWdodGVkOiAkc3RhdGUuaW5jbHVkZXMoJy5pdGVtJyl9XCI+SXRlbTwvZGl2PlxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQmFzaWMgZ2xvYmJpbmcgcGF0dGVybnNcbiAgICAgKiA8cHJlPlxuICAgICAqICRzdGF0ZS4kY3VycmVudC5uYW1lID0gJ2NvbnRhY3RzLmRldGFpbHMuaXRlbS51cmwnO1xuICAgICAqXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLiouKlwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLioqXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqKi5pdGVtLioqXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqLmRldGFpbHMuaXRlbS51cmxcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIiouZGV0YWlscy4qLnVybFwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLipcIik7IC8vIHJldHVybnMgZmFsc2VcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJpdGVtLioqXCIpOyAvLyByZXR1cm5zIGZhbHNlXG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVPck5hbWUgQSBwYXJ0aWFsIG5hbWUsIHJlbGF0aXZlIG5hbWUsIG9yIGdsb2IgcGF0dGVyblxuICAgICAqIHRvIGJlIHNlYXJjaGVkIGZvciB3aXRoaW4gdGhlIGN1cnJlbnQgc3RhdGUgbmFtZS5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIEEgcGFyYW0gb2JqZWN0LCBlLmcuIGB7c2VjdGlvbklkOiBzZWN0aW9uLmlkfWAsXG4gICAgICogdGhhdCB5b3UnZCBsaWtlIHRvIHRlc3QgYWdhaW5zdCB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpdCBkb2VzIGluY2x1ZGUgdGhlIHN0YXRlXG4gICAgICovXG4gICAgJHN0YXRlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMoc3RhdGVPck5hbWUsIHBhcmFtcykge1xuICAgICAgaWYgKGlzU3RyaW5nKHN0YXRlT3JOYW1lKSAmJiBpc0dsb2Ioc3RhdGVPck5hbWUpKSB7XG4gICAgICAgIGlmICghZG9lc1N0YXRlTWF0Y2hHbG9iKHN0YXRlT3JOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZU9yTmFtZSA9ICRzdGF0ZS4kY3VycmVudC5uYW1lO1xuICAgICAgfVxuICAgICAgdmFyIHN0YXRlID0gZmluZFN0YXRlKHN0YXRlT3JOYW1lKTtcblxuICAgICAgaWYgKCFpc0RlZmluZWQoc3RhdGUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAoIWlzRGVmaW5lZCgkc3RhdGUuJGN1cnJlbnQuaW5jbHVkZXNbc3RhdGUubmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlcXVhbEZvcktleXMocGFyYW1zLCAkc3RhdGVQYXJhbXMpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjaHJlZlxuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBIHVybCBnZW5lcmF0aW9uIG1ldGhvZCB0aGF0IHJldHVybnMgdGhlIGNvbXBpbGVkIHVybCBmb3IgdGhlIGdpdmVuIHN0YXRlIHBvcHVsYXRlZCB3aXRoIHRoZSBnaXZlbiBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogZXhwZWN0KCRzdGF0ZS5ocmVmKFwiYWJvdXQucGVyc29uXCIsIHsgcGVyc29uOiBcImJvYlwiIH0pKS50b0VxdWFsKFwiL2Fib3V0L2JvYlwiKTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gc3RhdGVPck5hbWUgVGhlIHN0YXRlIG5hbWUgb3Igc3RhdGUgb2JqZWN0IHlvdSdkIGxpa2UgdG8gZ2VuZXJhdGUgYSB1cmwgZnJvbS5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBbiBvYmplY3Qgb2YgcGFyYW1ldGVyIHZhbHVlcyB0byBmaWxsIHRoZSBzdGF0ZSdzIHJlcXVpcmVkIHBhcmFtZXRlcnMuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0LiBUaGUgb3B0aW9ucyBhcmU6XG4gICAgICpcbiAgICAgKiAtICoqYGxvc3N5YCoqIC0ge2Jvb2xlYW49dHJ1ZX0gLSAgSWYgdHJ1ZSwgYW5kIGlmIHRoZXJlIGlzIG5vIHVybCBhc3NvY2lhdGVkIHdpdGggdGhlIHN0YXRlIHByb3ZpZGVkIGluIHRoZVxuICAgICAqICAgIGZpcnN0IHBhcmFtZXRlciwgdGhlbiB0aGUgY29uc3RydWN0ZWQgaHJlZiB1cmwgd2lsbCBiZSBidWlsdCBmcm9tIHRoZSBmaXJzdCBuYXZpZ2FibGUgYW5jZXN0b3IgKGFrYVxuICAgICAqICAgIGFuY2VzdG9yIHdpdGggYSB2YWxpZCB1cmwpLlxuICAgICAqIC0gKipgaW5oZXJpdGAqKiAtIHtib29sZWFuPXRydWV9LCBJZiBgdHJ1ZWAgd2lsbCBpbmhlcml0IHVybCBwYXJhbWV0ZXJzIGZyb20gY3VycmVudCB1cmwuXG4gICAgICogLSAqKmByZWxhdGl2ZWAqKiAtIHtvYmplY3Q9JHN0YXRlLiRjdXJyZW50fSwgV2hlbiB0cmFuc2l0aW9uaW5nIHdpdGggcmVsYXRpdmUgcGF0aCAoZS5nICdeJyksIFxuICAgICAqICAgIGRlZmluZXMgd2hpY2ggc3RhdGUgdG8gYmUgcmVsYXRpdmUgZnJvbS5cbiAgICAgKiAtICoqYGFic29sdXRlYCoqIC0ge2Jvb2xlYW49ZmFsc2V9LCAgSWYgdHJ1ZSB3aWxsIGdlbmVyYXRlIGFuIGFic29sdXRlIHVybCwgZS5nLiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vZnVsbHVybFwiLlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbXBpbGVkIHN0YXRlIHVybFxuICAgICAqL1xuICAgICRzdGF0ZS5ocmVmID0gZnVuY3Rpb24gaHJlZihzdGF0ZU9yTmFtZSwgcGFyYW1zLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKHtcbiAgICAgICAgbG9zc3k6ICAgIHRydWUsXG4gICAgICAgIGluaGVyaXQ6ICB0cnVlLFxuICAgICAgICBhYnNvbHV0ZTogZmFsc2UsXG4gICAgICAgIHJlbGF0aXZlOiAkc3RhdGUuJGN1cnJlbnRcbiAgICAgIH0sIG9wdGlvbnMgfHwge30pO1xuXG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUsIG9wdGlvbnMucmVsYXRpdmUpO1xuXG4gICAgICBpZiAoIWlzRGVmaW5lZChzdGF0ZSkpIHJldHVybiBudWxsO1xuICAgICAgaWYgKG9wdGlvbnMuaW5oZXJpdCkgcGFyYW1zID0gaW5oZXJpdFBhcmFtcygkc3RhdGVQYXJhbXMsIHBhcmFtcyB8fCB7fSwgJHN0YXRlLiRjdXJyZW50LCBzdGF0ZSk7XG4gICAgICBcbiAgICAgIHZhciBuYXYgPSAoc3RhdGUgJiYgb3B0aW9ucy5sb3NzeSkgPyBzdGF0ZS5uYXZpZ2FibGUgOiBzdGF0ZTtcblxuICAgICAgaWYgKCFuYXYgfHwgIW5hdi51cmwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gJHVybFJvdXRlci5ocmVmKG5hdi51cmwsIGZpbHRlckJ5S2V5cyhvYmplY3RLZXlzKHN0YXRlLnBhcmFtcyksIHBhcmFtcyB8fCB7fSksIHtcbiAgICAgICAgYWJzb2x1dGU6IG9wdGlvbnMuYWJzb2x1dGVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2dldFxuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgYW55IHNwZWNpZmljIHN0YXRlIG9yIGFsbCBzdGF0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xTYmplY3Q9fSBzdGF0ZU9yTmFtZSAoYWJzb2x1dGUgb3IgcmVsYXRpdmUpIElmIHByb3ZpZGVkLCB3aWxsIG9ubHkgZ2V0IHRoZSBjb25maWcgZm9yXG4gICAgICogdGhlIHJlcXVlc3RlZCBzdGF0ZS4gSWYgbm90IHByb3ZpZGVkLCByZXR1cm5zIGFuIGFycmF5IG9mIEFMTCBzdGF0ZSBjb25maWdzLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R8QXJyYXl9IFN0YXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG9yIGFycmF5IG9mIGFsbCBvYmplY3RzLlxuICAgICAqL1xuICAgICRzdGF0ZS5nZXQgPSBmdW5jdGlvbiAoc3RhdGVPck5hbWUsIGNvbnRleHQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gb2JqZWN0S2V5cyhzdGF0ZXMpLm1hcChmdW5jdGlvbihuYW1lKSB7IHJldHVybiBzdGF0ZXNbbmFtZV0uc2VsZjsgfSk7XG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIChzdGF0ZSAmJiBzdGF0ZS5zZWxmKSA/IHN0YXRlLnNlbGYgOiBudWxsO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlU3RhdGUoc3RhdGUsIHBhcmFtcywgcGFyYW1zQXJlRmlsdGVyZWQsIGluaGVyaXRlZCwgZHN0KSB7XG4gICAgICAvLyBNYWtlIGEgcmVzdHJpY3RlZCAkc3RhdGVQYXJhbXMgd2l0aCBvbmx5IHRoZSBwYXJhbWV0ZXJzIHRoYXQgYXBwbHkgdG8gdGhpcyBzdGF0ZSBpZlxuICAgICAgLy8gbmVjZXNzYXJ5LiBJbiBhZGRpdGlvbiB0byBiZWluZyBhdmFpbGFibGUgdG8gdGhlIGNvbnRyb2xsZXIgYW5kIG9uRW50ZXIvb25FeGl0IGNhbGxiYWNrcyxcbiAgICAgIC8vIHdlIGFsc28gbmVlZCAkc3RhdGVQYXJhbXMgdG8gYmUgYXZhaWxhYmxlIGZvciBhbnkgJGluamVjdG9yIGNhbGxzIHdlIG1ha2UgZHVyaW5nIHRoZVxuICAgICAgLy8gZGVwZW5kZW5jeSByZXNvbHV0aW9uIHByb2Nlc3MuXG4gICAgICB2YXIgJHN0YXRlUGFyYW1zID0gKHBhcmFtc0FyZUZpbHRlcmVkKSA/IHBhcmFtcyA6IGZpbHRlckJ5S2V5cyhvYmplY3RLZXlzKHN0YXRlLnBhcmFtcyksIHBhcmFtcyk7XG4gICAgICB2YXIgbG9jYWxzID0geyAkc3RhdGVQYXJhbXM6ICRzdGF0ZVBhcmFtcyB9O1xuXG4gICAgICAvLyBSZXNvbHZlICdnbG9iYWwnIGRlcGVuZGVuY2llcyBmb3IgdGhlIHN0YXRlLCBpLmUuIHRob3NlIG5vdCBzcGVjaWZpYyB0byBhIHZpZXcuXG4gICAgICAvLyBXZSdyZSBhbHNvIGluY2x1ZGluZyAkc3RhdGVQYXJhbXMgaW4gdGhpczsgdGhhdCB3YXkgdGhlIHBhcmFtZXRlcnMgYXJlIHJlc3RyaWN0ZWRcbiAgICAgIC8vIHRvIHRoZSBzZXQgdGhhdCBzaG91bGQgYmUgdmlzaWJsZSB0byB0aGUgc3RhdGUsIGFuZCBhcmUgaW5kZXBlbmRlbnQgb2Ygd2hlbiB3ZSB1cGRhdGVcbiAgICAgIC8vIHRoZSBnbG9iYWwgJHN0YXRlIGFuZCAkc3RhdGVQYXJhbXMgdmFsdWVzLlxuICAgICAgZHN0LnJlc29sdmUgPSAkcmVzb2x2ZS5yZXNvbHZlKHN0YXRlLnJlc29sdmUsIGxvY2FscywgZHN0LnJlc29sdmUsIHN0YXRlKTtcbiAgICAgIHZhciBwcm9taXNlcyA9IFtkc3QucmVzb2x2ZS50aGVuKGZ1bmN0aW9uIChnbG9iYWxzKSB7XG4gICAgICAgIGRzdC5nbG9iYWxzID0gZ2xvYmFscztcbiAgICAgIH0pXTtcbiAgICAgIGlmIChpbmhlcml0ZWQpIHByb21pc2VzLnB1c2goaW5oZXJpdGVkKTtcblxuICAgICAgLy8gUmVzb2x2ZSB0ZW1wbGF0ZSBhbmQgZGVwZW5kZW5jaWVzIGZvciBhbGwgdmlld3MuXG4gICAgICBmb3JFYWNoKHN0YXRlLnZpZXdzLCBmdW5jdGlvbiAodmlldywgbmFtZSkge1xuICAgICAgICB2YXIgaW5qZWN0YWJsZXMgPSAodmlldy5yZXNvbHZlICYmIHZpZXcucmVzb2x2ZSAhPT0gc3RhdGUucmVzb2x2ZSA/IHZpZXcucmVzb2x2ZSA6IHt9KTtcbiAgICAgICAgaW5qZWN0YWJsZXMuJHRlbXBsYXRlID0gWyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICR2aWV3LmxvYWQobmFtZSwgeyB2aWV3OiB2aWV3LCBsb2NhbHM6IGxvY2FscywgcGFyYW1zOiAkc3RhdGVQYXJhbXMgfSkgfHwgJyc7XG4gICAgICAgIH1dO1xuXG4gICAgICAgIHByb21pc2VzLnB1c2goJHJlc29sdmUucmVzb2x2ZShpbmplY3RhYmxlcywgbG9jYWxzLCBkc3QucmVzb2x2ZSwgc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIC8vIFJlZmVyZW5jZXMgdG8gdGhlIGNvbnRyb2xsZXIgKG9ubHkgaW5zdGFudGlhdGVkIGF0IGxpbmsgdGltZSlcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2aWV3LmNvbnRyb2xsZXJQcm92aWRlcikgfHwgaXNBcnJheSh2aWV3LmNvbnRyb2xsZXJQcm92aWRlcikpIHtcbiAgICAgICAgICAgIHZhciBpbmplY3RMb2NhbHMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgaW5qZWN0YWJsZXMsIGxvY2Fscyk7XG4gICAgICAgICAgICByZXN1bHQuJCRjb250cm9sbGVyID0gJGluamVjdG9yLmludm9rZSh2aWV3LmNvbnRyb2xsZXJQcm92aWRlciwgbnVsbCwgaW5qZWN0TG9jYWxzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LiQkY29udHJvbGxlciA9IHZpZXcuY29udHJvbGxlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gdGhlIHN0YXRlIGl0c2VsZiBmb3IgaW50ZXJuYWwgdXNlXG4gICAgICAgICAgcmVzdWx0LiQkc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICByZXN1bHQuJCRjb250cm9sbGVyQXMgPSB2aWV3LmNvbnRyb2xsZXJBcztcbiAgICAgICAgICBkc3RbbmFtZV0gPSByZXN1bHQ7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXYWl0IGZvciBhbGwgdGhlIHByb21pc2VzIGFuZCB0aGVuIHJldHVybiB0aGUgYWN0aXZhdGlvbiBvYmplY3RcbiAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gZHN0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRzdGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZFRyaWdnZXJSZWxvYWQodG8sIGZyb20sIGxvY2Fscywgb3B0aW9ucykge1xuICAgIGlmICh0byA9PT0gZnJvbSAmJiAoKGxvY2FscyA9PT0gZnJvbS5sb2NhbHMgJiYgIW9wdGlvbnMucmVsb2FkKSB8fCAodG8uc2VsZi5yZWxvYWRPblNlYXJjaCA9PT0gZmFsc2UpKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKVxuICAudmFsdWUoJyRzdGF0ZVBhcmFtcycsIHt9KVxuICAucHJvdmlkZXIoJyRzdGF0ZScsICRTdGF0ZVByb3ZpZGVyKTtcblxuXG4kVmlld1Byb3ZpZGVyLiRpbmplY3QgPSBbXTtcbmZ1bmN0aW9uICRWaWV3UHJvdmlkZXIoKSB7XG5cbiAgdGhpcy4kZ2V0ID0gJGdldDtcbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR2aWV3XG4gICAqXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKi9cbiAgJGdldC4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyR0ZW1wbGF0ZUZhY3RvcnknXTtcbiAgZnVuY3Rpb24gJGdldCggICAkcm9vdFNjb3BlLCAgICR0ZW1wbGF0ZUZhY3RvcnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gJHZpZXcubG9hZCgnZnVsbC52aWV3TmFtZScsIHsgdGVtcGxhdGU6IC4uLiwgY29udHJvbGxlcjogLi4uLCByZXNvbHZlOiAuLi4sIGFzeW5jOiBmYWxzZSwgcGFyYW1zOiAuLi4gfSlcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHZpZXcjbG9hZFxuICAgICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kdmlld1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWVcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIG9wdGlvbiBvYmplY3QuXG4gICAgICAgKi9cbiAgICAgIGxvYWQ6IGZ1bmN0aW9uIGxvYWQobmFtZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgcmVzdWx0LCBkZWZhdWx0cyA9IHtcbiAgICAgICAgICB0ZW1wbGF0ZTogbnVsbCwgY29udHJvbGxlcjogbnVsbCwgdmlldzogbnVsbCwgbG9jYWxzOiBudWxsLCBub3RpZnk6IHRydWUsIGFzeW5jOiB0cnVlLCBwYXJhbXM6IHt9XG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMgPSBleHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnZpZXcpIHtcbiAgICAgICAgICByZXN1bHQgPSAkdGVtcGxhdGVGYWN0b3J5LmZyb21Db25maWcob3B0aW9ucy52aWV3LCBvcHRpb25zLnBhcmFtcywgb3B0aW9ucy5sb2NhbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgJiYgb3B0aW9ucy5ub3RpZnkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyR2aWV3Q29udGVudExvYWRpbmdcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiR2aWV3XG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEZpcmVkIG9uY2UgdGhlIHZpZXcgKipiZWdpbnMgbG9hZGluZyoqLCAqYmVmb3JlKiB0aGUgRE9NIGlzIHJlbmRlcmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmlld0NvbmZpZyBUaGUgdmlldyBjb25maWcgcHJvcGVydGllcyAodGVtcGxhdGUsIGNvbnRyb2xsZXIsIGV0YykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqIDxwcmU+XG4gICAgICAgICAqICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRpbmcnLFxuICAgICAgICAgKiBmdW5jdGlvbihldmVudCwgdmlld0NvbmZpZyl7XG4gICAgICAgICAqICAgICAvLyBBY2Nlc3MgdG8gYWxsIHRoZSB2aWV3IGNvbmZpZyBwcm9wZXJ0aWVzLlxuICAgICAgICAgKiAgICAgLy8gYW5kIG9uZSBzcGVjaWFsIHByb3BlcnR5ICd0YXJnZXRWaWV3J1xuICAgICAgICAgKiAgICAgLy8gdmlld0NvbmZpZy50YXJnZXRWaWV3XG4gICAgICAgICAqIH0pO1xuICAgICAgICAgKiA8L3ByZT5cbiAgICAgICAgICovXG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckdmlld0NvbnRlbnRMb2FkaW5nJywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKS5wcm92aWRlcignJHZpZXcnLCAkVmlld1Byb3ZpZGVyKTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB0aGF0IHJldHVybnMgdGhlIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbH0gc2VydmljZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gJFZpZXdTY3JvbGxQcm92aWRlcigpIHtcblxuICB2YXIgdXNlQW5jaG9yU2Nyb2xsID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyI3VzZUFuY2hvclNjcm9sbFxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV2ZXJ0cyBiYWNrIHRvIHVzaW5nIHRoZSBjb3JlIFtgJGFuY2hvclNjcm9sbGBdKGh0dHA6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvYXBpL25nLiRhbmNob3JTY3JvbGwpIHNlcnZpY2UgZm9yXG4gICAqIHNjcm9sbGluZyBiYXNlZCBvbiB0aGUgdXJsIGFuY2hvci5cbiAgICovXG4gIHRoaXMudXNlQW5jaG9yU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgIHVzZUFuY2hvclNjcm9sbCA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxcbiAgICpcbiAgICogQHJlcXVpcmVzICRhbmNob3JTY3JvbGxcbiAgICogQHJlcXVpcmVzICR0aW1lb3V0XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBXaGVuIGNhbGxlZCB3aXRoIGEganFMaXRlIGVsZW1lbnQsIGl0IHNjcm9sbHMgdGhlIGVsZW1lbnQgaW50byB2aWV3IChhZnRlciBhXG4gICAqIGAkdGltZW91dGAgc28gdGhlIERPTSBoYXMgdGltZSB0byByZWZyZXNoKS5cbiAgICpcbiAgICogSWYgeW91IHByZWZlciB0byByZWx5IG9uIGAkYW5jaG9yU2Nyb2xsYCB0byBzY3JvbGwgdGhlIHZpZXcgdG8gdGhlIGFuY2hvcixcbiAgICogdGhpcyBjYW4gYmUgZW5hYmxlZCBieSBjYWxsaW5nIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyI21ldGhvZHNfdXNlQW5jaG9yU2Nyb2xsIGAkdWlWaWV3U2Nyb2xsUHJvdmlkZXIudXNlQW5jaG9yU2Nyb2xsKClgfS5cbiAgICovXG4gIHRoaXMuJGdldCA9IFsnJGFuY2hvclNjcm9sbCcsICckdGltZW91dCcsIGZ1bmN0aW9uICgkYW5jaG9yU2Nyb2xsLCAkdGltZW91dCkge1xuICAgIGlmICh1c2VBbmNob3JTY3JvbGwpIHtcbiAgICAgIHJldHVybiAkYW5jaG9yU2Nyb2xsO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGVsZW1lbnRbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgIH0sIDAsIGZhbHNlKTtcbiAgICB9O1xuICB9XTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLnByb3ZpZGVyKCckdWlWaWV3U2Nyb2xsJywgJFZpZXdTY3JvbGxQcm92aWRlcik7XG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmRpcmVjdGl2ZTp1aS12aWV3XG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAqIEByZXF1aXJlcyAkY29tcGlsZVxuICogQHJlcXVpcmVzICRjb250cm9sbGVyXG4gKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxcbiAqIEByZXF1aXJlcyAkZG9jdW1lbnRcbiAqXG4gKiBAcmVzdHJpY3QgRUNBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgdWktdmlldyBkaXJlY3RpdmUgdGVsbHMgJHN0YXRlIHdoZXJlIHRvIHBsYWNlIHlvdXIgdGVtcGxhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gdWktdmlldyBBIHZpZXcgbmFtZS4gVGhlIG5hbWUgc2hvdWxkIGJlIHVuaXF1ZSBhbW9uZ3N0IHRoZSBvdGhlciB2aWV3cyBpbiB0aGVcbiAqIHNhbWUgc3RhdGUuIFlvdSBjYW4gaGF2ZSB2aWV3cyBvZiB0aGUgc2FtZSBuYW1lIHRoYXQgbGl2ZSBpbiBkaWZmZXJlbnQgc3RhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYXV0b3Njcm9sbCBJdCBhbGxvd3MgeW91IHRvIHNldCB0aGUgc2Nyb2xsIGJlaGF2aW9yIG9mIHRoZSBicm93c2VyIHdpbmRvd1xuICogd2hlbiBhIHZpZXcgaXMgcG9wdWxhdGVkLiBCeSBkZWZhdWx0LCAkYW5jaG9yU2Nyb2xsIGlzIG92ZXJyaWRkZW4gYnkgdWktcm91dGVyJ3MgY3VzdG9tIHNjcm9sbFxuICogc2VydmljZSwge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsfS4gVGhpcyBjdXN0b20gc2VydmljZSBsZXQncyB5b3VcbiAqIHNjcm9sbCB1aS12aWV3IGVsZW1lbnRzIGludG8gdmlldyB3aGVuIHRoZXkgYXJlIHBvcHVsYXRlZCBkdXJpbmcgYSBzdGF0ZSBhY3RpdmF0aW9uLlxuICpcbiAqICpOb3RlOiBUbyByZXZlcnQgYmFjayB0byBvbGQgW2AkYW5jaG9yU2Nyb2xsYF0oaHR0cDovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcuJGFuY2hvclNjcm9sbClcbiAqIGZ1bmN0aW9uYWxpdHksIGNhbGwgYCR1aVZpZXdTY3JvbGxQcm92aWRlci51c2VBbmNob3JTY3JvbGwoKWAuKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gb25sb2FkIEV4cHJlc3Npb24gdG8gZXZhbHVhdGUgd2hlbmV2ZXIgdGhlIHZpZXcgdXBkYXRlcy5cbiAqIFxuICogQGV4YW1wbGVcbiAqIEEgdmlldyBjYW4gYmUgdW5uYW1lZCBvciBuYW1lZC4gXG4gKiA8cHJlPlxuICogPCEtLSBVbm5hbWVkIC0tPlxuICogPGRpdiB1aS12aWV3PjwvZGl2PiBcbiAqIFxuICogPCEtLSBOYW1lZCAtLT5cbiAqIDxkaXYgdWktdmlldz1cInZpZXdOYW1lXCI+PC9kaXY+XG4gKiA8L3ByZT5cbiAqXG4gKiBZb3UgY2FuIG9ubHkgaGF2ZSBvbmUgdW5uYW1lZCB2aWV3IHdpdGhpbiBhbnkgdGVtcGxhdGUgKG9yIHJvb3QgaHRtbCkuIElmIHlvdSBhcmUgb25seSB1c2luZyBhIFxuICogc2luZ2xlIHZpZXcgYW5kIGl0IGlzIHVubmFtZWQgdGhlbiB5b3UgY2FuIHBvcHVsYXRlIGl0IGxpa2Ugc286XG4gKiA8cHJlPlxuICogPGRpdiB1aS12aWV3PjwvZGl2PiBcbiAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZVwiLCB7XG4gKiAgIHRlbXBsYXRlOiBcIjxoMT5IRUxMTyE8L2gxPlwiXG4gKiB9KVxuICogPC9wcmU+XG4gKiBcbiAqIFRoZSBhYm92ZSBpcyBhIGNvbnZlbmllbnQgc2hvcnRjdXQgZXF1aXZhbGVudCB0byBzcGVjaWZ5aW5nIHlvdXIgdmlldyBleHBsaWNpdGx5IHdpdGggdGhlIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXIjdmlld3MgYHZpZXdzYH1cbiAqIGNvbmZpZyBwcm9wZXJ0eSwgYnkgbmFtZSwgaW4gdGhpcyBjYXNlIGFuIGVtcHR5IG5hbWU6XG4gKiA8cHJlPlxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdmlld3M6IHtcbiAqICAgICBcIlwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8aDE+SEVMTE8hPC9oMT5cIlxuICogICAgIH1cbiAqICAgfSAgICBcbiAqIH0pXG4gKiA8L3ByZT5cbiAqIFxuICogQnV0IHR5cGljYWxseSB5b3UnbGwgb25seSB1c2UgdGhlIHZpZXdzIHByb3BlcnR5IGlmIHlvdSBuYW1lIHlvdXIgdmlldyBvciBoYXZlIG1vcmUgdGhhbiBvbmUgdmlldyBcbiAqIGluIHRoZSBzYW1lIHRlbXBsYXRlLiBUaGVyZSdzIG5vdCByZWFsbHkgYSBjb21wZWxsaW5nIHJlYXNvbiB0byBuYW1lIGEgdmlldyBpZiBpdHMgdGhlIG9ubHkgb25lLCBcbiAqIGJ1dCB5b3UgY291bGQgaWYgeW91IHdhbnRlZCwgbGlrZSBzbzpcbiAqIDxwcmU+XG4gKiA8ZGl2IHVpLXZpZXc9XCJtYWluXCI+PC9kaXY+XG4gKiA8L3ByZT4gXG4gKiA8cHJlPlxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdmlld3M6IHtcbiAqICAgICBcIm1haW5cIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGgxPkhFTExPITwvaDE+XCJcbiAqICAgICB9XG4gKiAgIH0gICAgXG4gKiB9KVxuICogPC9wcmU+XG4gKiBcbiAqIFJlYWxseSB0aG91Z2gsIHlvdSdsbCB1c2Ugdmlld3MgdG8gc2V0IHVwIG11bHRpcGxlIHZpZXdzOlxuICogPHByZT5cbiAqIDxkaXYgdWktdmlldz48L2Rpdj5cbiAqIDxkaXYgdWktdmlldz1cImNoYXJ0XCI+PC9kaXY+IFxuICogPGRpdiB1aS12aWV3PVwiZGF0YVwiPjwvZGl2PiBcbiAqIDwvcHJlPlxuICogXG4gKiA8cHJlPlxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdmlld3M6IHtcbiAqICAgICBcIlwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8aDE+SEVMTE8hPC9oMT5cIlxuICogICAgIH0sXG4gKiAgICAgXCJjaGFydFwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8Y2hhcnRfdGhpbmcvPlwiXG4gKiAgICAgfSxcbiAqICAgICBcImRhdGFcIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGRhdGFfdGhpbmcvPlwiXG4gKiAgICAgfVxuICogICB9ICAgIFxuICogfSlcbiAqIDwvcHJlPlxuICpcbiAqIEV4YW1wbGVzIGZvciBgYXV0b3Njcm9sbGA6XG4gKlxuICogPHByZT5cbiAqIDwhLS0gSWYgYXV0b3Njcm9sbCBwcmVzZW50IHdpdGggbm8gZXhwcmVzc2lvbixcbiAqICAgICAgdGhlbiBzY3JvbGwgdWktdmlldyBpbnRvIHZpZXcgLS0+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsLz5cbiAqXG4gKiA8IS0tIElmIGF1dG9zY3JvbGwgcHJlc2VudCB3aXRoIHZhbGlkIGV4cHJlc3Npb24sXG4gKiAgICAgIHRoZW4gc2Nyb2xsIHVpLXZpZXcgaW50byB2aWV3IGlmIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIHRydWUgLS0+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsPSd0cnVlJy8+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsPSdmYWxzZScvPlxuICogPHVpLXZpZXcgYXV0b3Njcm9sbD0nc2NvcGVWYXJpYWJsZScvPlxuICogPC9wcmU+XG4gKi9cbiRWaWV3RGlyZWN0aXZlLiRpbmplY3QgPSBbJyRzdGF0ZScsICckaW5qZWN0b3InLCAnJHVpVmlld1Njcm9sbCddO1xuZnVuY3Rpb24gJFZpZXdEaXJlY3RpdmUoICAgJHN0YXRlLCAgICRpbmplY3RvciwgICAkdWlWaWV3U2Nyb2xsKSB7XG5cbiAgZnVuY3Rpb24gZ2V0U2VydmljZSgpIHtcbiAgICByZXR1cm4gKCRpbmplY3Rvci5oYXMpID8gZnVuY3Rpb24oc2VydmljZSkge1xuICAgICAgcmV0dXJuICRpbmplY3Rvci5oYXMoc2VydmljZSkgPyAkaW5qZWN0b3IuZ2V0KHNlcnZpY2UpIDogbnVsbDtcbiAgICB9IDogZnVuY3Rpb24oc2VydmljZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoc2VydmljZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgc2VydmljZSA9IGdldFNlcnZpY2UoKSxcbiAgICAgICRhbmltYXRvciA9IHNlcnZpY2UoJyRhbmltYXRvcicpLFxuICAgICAgJGFuaW1hdGUgPSBzZXJ2aWNlKCckYW5pbWF0ZScpO1xuXG4gIC8vIFJldHVybnMgYSBzZXQgb2YgRE9NIG1hbmlwdWxhdGlvbiBmdW5jdGlvbnMgYmFzZWQgb24gd2hpY2ggQW5ndWxhciB2ZXJzaW9uXG4gIC8vIGl0IHNob3VsZCB1c2VcbiAgZnVuY3Rpb24gZ2V0UmVuZGVyZXIoYXR0cnMsIHNjb3BlKSB7XG4gICAgdmFyIHN0YXRpY3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVudGVyOiBmdW5jdGlvbiAoZWxlbWVudCwgdGFyZ2V0LCBjYikgeyB0YXJnZXQuYWZ0ZXIoZWxlbWVudCk7IGNiKCk7IH0sXG4gICAgICAgIGxlYXZlOiBmdW5jdGlvbiAoZWxlbWVudCwgY2IpIHsgZWxlbWVudC5yZW1vdmUoKTsgY2IoKTsgfVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgaWYgKCRhbmltYXRlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgdGFyZ2V0LCBjYikgeyAkYW5pbWF0ZS5lbnRlcihlbGVtZW50LCBudWxsLCB0YXJnZXQsIGNiKTsgfSxcbiAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGNiKSB7ICRhbmltYXRlLmxlYXZlKGVsZW1lbnQsIGNiKTsgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoJGFuaW1hdG9yKSB7XG4gICAgICB2YXIgYW5pbWF0ZSA9ICRhbmltYXRvciAmJiAkYW5pbWF0b3Ioc2NvcGUsIGF0dHJzKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIHRhcmdldCwgY2IpIHthbmltYXRlLmVudGVyKGVsZW1lbnQsIG51bGwsIHRhcmdldCk7IGNiKCk7IH0sXG4gICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBjYikgeyBhbmltYXRlLmxlYXZlKGVsZW1lbnQpOyBjYigpOyB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0aWNzKCk7XG4gIH1cblxuICB2YXIgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwLFxuICAgIHRyYW5zY2x1ZGU6ICdlbGVtZW50JyxcbiAgICBjb21waWxlOiBmdW5jdGlvbiAodEVsZW1lbnQsIHRBdHRycywgJHRyYW5zY2x1ZGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsICRlbGVtZW50LCBhdHRycykge1xuICAgICAgICB2YXIgcHJldmlvdXNFbCwgY3VycmVudEVsLCBjdXJyZW50U2NvcGUsIGxhdGVzdExvY2FscyxcbiAgICAgICAgICAgIG9ubG9hZEV4cCAgICAgPSBhdHRycy5vbmxvYWQgfHwgJycsXG4gICAgICAgICAgICBhdXRvU2Nyb2xsRXhwID0gYXR0cnMuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIHJlbmRlcmVyICAgICAgPSBnZXRSZW5kZXJlcihhdHRycywgc2NvcGUpO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHVwZGF0ZVZpZXcoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdXBkYXRlVmlldyhmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVwZGF0ZVZpZXcodHJ1ZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cExhc3RWaWV3KCkge1xuICAgICAgICAgIGlmIChwcmV2aW91c0VsKSB7XG4gICAgICAgICAgICBwcmV2aW91c0VsLnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJldmlvdXNFbCA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50RWwpIHtcbiAgICAgICAgICAgIHJlbmRlcmVyLmxlYXZlKGN1cnJlbnRFbCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWwgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByZXZpb3VzRWwgPSBjdXJyZW50RWw7XG4gICAgICAgICAgICBjdXJyZW50RWwgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgdmFyIG5ld1Njb3BlLFxuICAgICAgICAgICAgICBuYW1lICAgICAgICAgICAgPSBnZXRVaVZpZXdOYW1lKGF0dHJzLCAkZWxlbWVudC5pbmhlcml0ZWREYXRhKCckdWlWaWV3JykpLFxuICAgICAgICAgICAgICBwcmV2aW91c0xvY2FscyAgPSBuYW1lICYmICRzdGF0ZS4kY3VycmVudCAmJiAkc3RhdGUuJGN1cnJlbnQubG9jYWxzW25hbWVdO1xuXG4gICAgICAgICAgaWYgKCFmaXJzdFRpbWUgJiYgcHJldmlvdXNMb2NhbHMgPT09IGxhdGVzdExvY2FscykgcmV0dXJuOyAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgICAgbmV3U2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgbGF0ZXN0TG9jYWxzID0gJHN0YXRlLiRjdXJyZW50LmxvY2Fsc1tuYW1lXTtcblxuICAgICAgICAgIHZhciBjbG9uZSA9ICR0cmFuc2NsdWRlKG5ld1Njb3BlLCBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgcmVuZGVyZXIuZW50ZXIoY2xvbmUsICRlbGVtZW50LCBmdW5jdGlvbiBvblVpVmlld0VudGVyKCkge1xuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXV0b1Njcm9sbEV4cCkgJiYgIWF1dG9TY3JvbGxFeHAgfHwgc2NvcGUuJGV2YWwoYXV0b1Njcm9sbEV4cCkpIHtcbiAgICAgICAgICAgICAgICAkdWlWaWV3U2Nyb2xsKGNsb25lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGN1cnJlbnRFbCA9IGNsb25lO1xuICAgICAgICAgIGN1cnJlbnRTY29wZSA9IG5ld1Njb3BlO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktdmlldyMkdmlld0NvbnRlbnRMb2FkZWRcbiAgICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXZpZXdcbiAgICAgICAgICAgKiBAZXZlbnRUeXBlIGVtaXRzIG9uIHVpLXZpZXcgZGlyZWN0aXZlIHNjb3BlXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uICAgICAgICAgICAqXG4gICAgICAgICAgICogRmlyZWQgb25jZSB0aGUgdmlldyBpcyAqKmxvYWRlZCoqLCAqYWZ0ZXIqIHRoZSBET00gaXMgcmVuZGVyZWQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGN1cnJlbnRTY29wZS4kZW1pdCgnJHZpZXdDb250ZW50TG9hZGVkJyk7XG4gICAgICAgICAgY3VycmVudFNjb3BlLiRldmFsKG9ubG9hZEV4cCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBkaXJlY3RpdmU7XG59XG5cbiRWaWV3RGlyZWN0aXZlRmlsbC4kaW5qZWN0ID0gWyckY29tcGlsZScsICckY29udHJvbGxlcicsICckc3RhdGUnXTtcbmZ1bmN0aW9uICRWaWV3RGlyZWN0aXZlRmlsbCAoJGNvbXBpbGUsICRjb250cm9sbGVyLCAkc3RhdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgcHJpb3JpdHk6IC00MDAsXG4gICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtZW50KSB7XG4gICAgICB2YXIgaW5pdGlhbCA9IHRFbGVtZW50Lmh0bWwoKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsICRlbGVtZW50LCBhdHRycykge1xuICAgICAgICB2YXIgY3VycmVudCA9ICRzdGF0ZS4kY3VycmVudCxcbiAgICAgICAgICAgIG5hbWUgPSBnZXRVaVZpZXdOYW1lKGF0dHJzLCAkZWxlbWVudC5pbmhlcml0ZWREYXRhKCckdWlWaWV3JykpLFxuICAgICAgICAgICAgbG9jYWxzICA9IGN1cnJlbnQgJiYgY3VycmVudC5sb2NhbHNbbmFtZV07XG5cbiAgICAgICAgaWYgKCEgbG9jYWxzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJGVsZW1lbnQuZGF0YSgnJHVpVmlldycsIHsgbmFtZTogbmFtZSwgc3RhdGU6IGxvY2Fscy4kJHN0YXRlIH0pO1xuICAgICAgICAkZWxlbWVudC5odG1sKGxvY2Fscy4kdGVtcGxhdGUgPyBsb2NhbHMuJHRlbXBsYXRlIDogaW5pdGlhbCk7XG5cbiAgICAgICAgdmFyIGxpbmsgPSAkY29tcGlsZSgkZWxlbWVudC5jb250ZW50cygpKTtcblxuICAgICAgICBpZiAobG9jYWxzLiQkY29udHJvbGxlcikge1xuICAgICAgICAgIGxvY2Fscy4kc2NvcGUgPSBzY29wZTtcbiAgICAgICAgICB2YXIgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGxvY2Fscy4kJGNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgICAgaWYgKGxvY2Fscy4kJGNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgc2NvcGVbbG9jYWxzLiQkY29udHJvbGxlckFzXSA9IGNvbnRyb2xsZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgICRlbGVtZW50LmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oKS5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGluayhzY29wZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBTaGFyZWQgdWktdmlldyBjb2RlIGZvciBib3RoIGRpcmVjdGl2ZXM6XG4gKiBHaXZlbiBhdHRyaWJ1dGVzIGFuZCBpbmhlcml0ZWQgJHVpVmlldyBkYXRhLCByZXR1cm4gdGhlIHZpZXcncyBuYW1lXG4gKi9cbmZ1bmN0aW9uIGdldFVpVmlld05hbWUoYXR0cnMsIGluaGVyaXRlZCkge1xuICB2YXIgbmFtZSA9IGF0dHJzLnVpVmlldyB8fCBhdHRycy5uYW1lIHx8ICcnO1xuICByZXR1cm4gbmFtZS5pbmRleE9mKCdAJykgPj0gMCA/ICBuYW1lIDogIChuYW1lICsgJ0AnICsgKGluaGVyaXRlZCA/IGluaGVyaXRlZC5zdGF0ZS5uYW1lIDogJycpKTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLmRpcmVjdGl2ZSgndWlWaWV3JywgJFZpZXdEaXJlY3RpdmUpO1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLmRpcmVjdGl2ZSgndWlWaWV3JywgJFZpZXdEaXJlY3RpdmVGaWxsKTtcblxuZnVuY3Rpb24gcGFyc2VTdGF0ZVJlZihyZWYsIGN1cnJlbnQpIHtcbiAgdmFyIHByZXBhcnNlZCA9IHJlZi5tYXRjaCgvXlxccyooe1tefV0qfSlcXHMqJC8pLCBwYXJzZWQ7XG4gIGlmIChwcmVwYXJzZWQpIHJlZiA9IGN1cnJlbnQgKyAnKCcgKyBwcmVwYXJzZWRbMV0gKyAnKSc7XG4gIHBhcnNlZCA9IHJlZi5yZXBsYWNlKC9cXG4vZywgXCIgXCIpLm1hdGNoKC9eKFteKF0rPylcXHMqKFxcKCguKilcXCkpPyQvKTtcbiAgaWYgKCFwYXJzZWQgfHwgcGFyc2VkLmxlbmd0aCAhPT0gNCkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdGF0ZSByZWYgJ1wiICsgcmVmICsgXCInXCIpO1xuICByZXR1cm4geyBzdGF0ZTogcGFyc2VkWzFdLCBwYXJhbUV4cHI6IHBhcnNlZFszXSB8fCBudWxsIH07XG59XG5cbmZ1bmN0aW9uIHN0YXRlQ29udGV4dChlbCkge1xuICB2YXIgc3RhdGVEYXRhID0gZWwucGFyZW50KCkuaW5oZXJpdGVkRGF0YSgnJHVpVmlldycpO1xuXG4gIGlmIChzdGF0ZURhdGEgJiYgc3RhdGVEYXRhLnN0YXRlICYmIHN0YXRlRGF0YS5zdGF0ZS5uYW1lKSB7XG4gICAgcmV0dXJuIHN0YXRlRGF0YS5zdGF0ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktc3JlZlxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKiBAcmVxdWlyZXMgJHRpbWVvdXRcbiAqXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBiaW5kcyBhIGxpbmsgKGA8YT5gIHRhZykgdG8gYSBzdGF0ZS4gSWYgdGhlIHN0YXRlIGhhcyBhbiBhc3NvY2lhdGVkIFxuICogVVJMLCB0aGUgZGlyZWN0aXZlIHdpbGwgYXV0b21hdGljYWxseSBnZW5lcmF0ZSAmIHVwZGF0ZSB0aGUgYGhyZWZgIGF0dHJpYnV0ZSB2aWEgXG4gKiB0aGUge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19ocmVmICRzdGF0ZS5ocmVmKCl9IG1ldGhvZC4gQ2xpY2tpbmcgXG4gKiB0aGUgbGluayB3aWxsIHRyaWdnZXIgYSBzdGF0ZSB0cmFuc2l0aW9uIHdpdGggb3B0aW9uYWwgcGFyYW1ldGVycy4gXG4gKlxuICogQWxzbyBtaWRkbGUtY2xpY2tpbmcsIHJpZ2h0LWNsaWNraW5nLCBhbmQgY3RybC1jbGlja2luZyBvbiB0aGUgbGluayB3aWxsIGJlIFxuICogaGFuZGxlZCBuYXRpdmVseSBieSB0aGUgYnJvd3Nlci5cbiAqXG4gKiBZb3UgY2FuIGFsc28gdXNlIHJlbGF0aXZlIHN0YXRlIHBhdGhzIHdpdGhpbiB1aS1zcmVmLCBqdXN0IGxpa2UgdGhlIHJlbGF0aXZlIFxuICogcGF0aHMgcGFzc2VkIHRvIGAkc3RhdGUuZ28oKWAuIFlvdSBqdXN0IG5lZWQgdG8gYmUgYXdhcmUgdGhhdCB0aGUgcGF0aCBpcyByZWxhdGl2ZVxuICogdG8gdGhlIHN0YXRlIHRoYXQgdGhlIGxpbmsgbGl2ZXMgaW4sIGluIG90aGVyIHdvcmRzIHRoZSBzdGF0ZSB0aGF0IGxvYWRlZCB0aGUgXG4gKiB0ZW1wbGF0ZSBjb250YWluaW5nIHRoZSBsaW5rLlxuICpcbiAqIFlvdSBjYW4gc3BlY2lmeSBvcHRpb25zIHRvIHBhc3MgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjZ28gJHN0YXRlLmdvKCl9XG4gKiB1c2luZyB0aGUgYHVpLXNyZWYtb3B0c2AgYXR0cmlidXRlLiBPcHRpb25zIGFyZSByZXN0cmljdGVkIHRvIGBsb2NhdGlvbmAsIGBpbmhlcml0YCxcbiAqIGFuZCBgcmVsb2FkYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogSGVyZSdzIGFuIGV4YW1wbGUgb2YgaG93IHlvdSdkIHVzZSB1aS1zcmVmIGFuZCBob3cgaXQgd291bGQgY29tcGlsZS4gSWYgeW91IGhhdmUgdGhlIFxuICogZm9sbG93aW5nIHRlbXBsYXRlOlxuICogPHByZT5cbiAqIDxhIHVpLXNyZWY9XCJob21lXCI+SG9tZTwvYT4gfCA8YSB1aS1zcmVmPVwiYWJvdXRcIj5BYm91dDwvYT4gfCA8YSB1aS1zcmVmPVwie3BhZ2U6IDJ9XCI+TmV4dCBwYWdlPC9hPlxuICogXG4gKiA8dWw+XG4gKiAgICAgPGxpIG5nLXJlcGVhdD1cImNvbnRhY3QgaW4gY29udGFjdHNcIj5cbiAqICAgICAgICAgPGEgdWktc3JlZj1cImNvbnRhY3RzLmRldGFpbCh7IGlkOiBjb250YWN0LmlkIH0pXCI+e3sgY29udGFjdC5uYW1lIH19PC9hPlxuICogICAgIDwvbGk+XG4gKiA8L3VsPlxuICogPC9wcmU+XG4gKiBcbiAqIFRoZW4gdGhlIGNvbXBpbGVkIGh0bWwgd291bGQgYmUgKGFzc3VtaW5nIEh0bWw1TW9kZSBpcyBvZmYgYW5kIGN1cnJlbnQgc3RhdGUgaXMgY29udGFjdHMpOlxuICogPHByZT5cbiAqIDxhIGhyZWY9XCIjL2hvbWVcIiB1aS1zcmVmPVwiaG9tZVwiPkhvbWU8L2E+IHwgPGEgaHJlZj1cIiMvYWJvdXRcIiB1aS1zcmVmPVwiYWJvdXRcIj5BYm91dDwvYT4gfCA8YSBocmVmPVwiIy9jb250YWN0cz9wYWdlPTJcIiB1aS1zcmVmPVwie3BhZ2U6IDJ9XCI+TmV4dCBwYWdlPC9hPlxuICogXG4gKiA8dWw+XG4gKiAgICAgPGxpIG5nLXJlcGVhdD1cImNvbnRhY3QgaW4gY29udGFjdHNcIj5cbiAqICAgICAgICAgPGEgaHJlZj1cIiMvY29udGFjdHMvMVwiIHVpLXNyZWY9XCJjb250YWN0cy5kZXRhaWwoeyBpZDogY29udGFjdC5pZCB9KVwiPkpvZTwvYT5cbiAqICAgICA8L2xpPlxuICogICAgIDxsaSBuZy1yZXBlYXQ9XCJjb250YWN0IGluIGNvbnRhY3RzXCI+XG4gKiAgICAgICAgIDxhIGhyZWY9XCIjL2NvbnRhY3RzLzJcIiB1aS1zcmVmPVwiY29udGFjdHMuZGV0YWlsKHsgaWQ6IGNvbnRhY3QuaWQgfSlcIj5BbGljZTwvYT5cbiAqICAgICA8L2xpPlxuICogICAgIDxsaSBuZy1yZXBlYXQ9XCJjb250YWN0IGluIGNvbnRhY3RzXCI+XG4gKiAgICAgICAgIDxhIGhyZWY9XCIjL2NvbnRhY3RzLzNcIiB1aS1zcmVmPVwiY29udGFjdHMuZGV0YWlsKHsgaWQ6IGNvbnRhY3QuaWQgfSlcIj5Cb2I8L2E+XG4gKiAgICAgPC9saT5cbiAqIDwvdWw+XG4gKlxuICogPGEgdWktc3JlZj1cImhvbWVcIiB1aS1zcmVmLW9wdHM9XCJ7cmVsb2FkOiB0cnVlfVwiPkhvbWU8L2E+XG4gKiA8L3ByZT5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdWktc3JlZiAnc3RhdGVOYW1lJyBjYW4gYmUgYW55IHZhbGlkIGFic29sdXRlIG9yIHJlbGF0aXZlIHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdWktc3JlZi1vcHRzIG9wdGlvbnMgdG8gcGFzcyB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNnbyAkc3RhdGUuZ28oKX1cbiAqL1xuJFN0YXRlUmVmRGlyZWN0aXZlLiRpbmplY3QgPSBbJyRzdGF0ZScsICckdGltZW91dCddO1xuZnVuY3Rpb24gJFN0YXRlUmVmRGlyZWN0aXZlKCRzdGF0ZSwgJHRpbWVvdXQpIHtcbiAgdmFyIGFsbG93ZWRPcHRpb25zID0gWydsb2NhdGlvbicsICdpbmhlcml0JywgJ3JlbG9hZCddO1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiBbJz9edWlTcmVmQWN0aXZlJywgJz9edWlTcmVmQWN0aXZlRXEnXSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHVpU3JlZkFjdGl2ZSkge1xuICAgICAgdmFyIHJlZiA9IHBhcnNlU3RhdGVSZWYoYXR0cnMudWlTcmVmLCAkc3RhdGUuY3VycmVudC5uYW1lKTtcbiAgICAgIHZhciBwYXJhbXMgPSBudWxsLCB1cmwgPSBudWxsLCBiYXNlID0gc3RhdGVDb250ZXh0KGVsZW1lbnQpIHx8ICRzdGF0ZS4kY3VycmVudDtcbiAgICAgIHZhciBpc0Zvcm0gPSBlbGVtZW50WzBdLm5vZGVOYW1lID09PSBcIkZPUk1cIjtcbiAgICAgIHZhciBhdHRyID0gaXNGb3JtID8gXCJhY3Rpb25cIiA6IFwiaHJlZlwiLCBuYXYgPSB0cnVlO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IHsgcmVsYXRpdmU6IGJhc2UsIGluaGVyaXQ6IHRydWUgfTtcbiAgICAgIHZhciBvcHRpb25zT3ZlcnJpZGUgPSBzY29wZS4kZXZhbChhdHRycy51aVNyZWZPcHRzKSB8fCB7fTtcblxuICAgICAgYW5ndWxhci5mb3JFYWNoKGFsbG93ZWRPcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKG9wdGlvbiBpbiBvcHRpb25zT3ZlcnJpZGUpIHtcbiAgICAgICAgICBvcHRpb25zW29wdGlvbl0gPSBvcHRpb25zT3ZlcnJpZGVbb3B0aW9uXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbihuZXdWYWwpIHtcbiAgICAgICAgaWYgKG5ld1ZhbCkgcGFyYW1zID0gbmV3VmFsO1xuICAgICAgICBpZiAoIW5hdikgcmV0dXJuO1xuXG4gICAgICAgIHZhciBuZXdIcmVmID0gJHN0YXRlLmhyZWYocmVmLnN0YXRlLCBwYXJhbXMsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBhY3RpdmVEaXJlY3RpdmUgPSB1aVNyZWZBY3RpdmVbMV0gfHwgdWlTcmVmQWN0aXZlWzBdO1xuICAgICAgICBpZiAoYWN0aXZlRGlyZWN0aXZlKSB7XG4gICAgICAgICAgYWN0aXZlRGlyZWN0aXZlLiQkc2V0U3RhdGVJbmZvKHJlZi5zdGF0ZSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3SHJlZiA9PT0gbnVsbCkge1xuICAgICAgICAgIG5hdiA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50WzBdW2F0dHJdID0gbmV3SHJlZjtcbiAgICAgIH07XG5cbiAgICAgIGlmIChyZWYucGFyYW1FeHByKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChyZWYucGFyYW1FeHByLCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgIGlmIChuZXdWYWwgIT09IHBhcmFtcykgdXBkYXRlKG5ld1ZhbCk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgICBwYXJhbXMgPSBzY29wZS4kZXZhbChyZWYucGFyYW1FeHByKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICBpZiAoaXNGb3JtKSByZXR1cm47XG5cbiAgICAgIGVsZW1lbnQuYmluZChcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGUud2hpY2ggfHwgZS5idXR0b247XG4gICAgICAgIGlmICggIShidXR0b24gPiAxIHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSB8fCBlbGVtZW50LmF0dHIoJ3RhcmdldCcpKSApIHtcbiAgICAgICAgICAvLyBIQUNLOiBUaGlzIGlzIHRvIGFsbG93IG5nLWNsaWNrcyB0byBiZSBwcm9jZXNzZWQgYmVmb3JlIHRoZSB0cmFuc2l0aW9uIGlzIGluaXRpYXRlZDpcbiAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKHJlZi5zdGF0ZSwgcGFyYW1zLCBvcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodHJhbnNpdGlvbik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktc3JlZi1hY3RpdmVcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQYXJhbXNcbiAqIEByZXF1aXJlcyAkaW50ZXJwb2xhdGVcbiAqXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgd29ya2luZyBhbG9uZ3NpZGUgdWktc3JlZiB0byBhZGQgY2xhc3NlcyB0byBhbiBlbGVtZW50IHdoZW4gdGhlXG4gKiByZWxhdGVkIHVpLXNyZWYgZGlyZWN0aXZlJ3Mgc3RhdGUgaXMgYWN0aXZlLCBhbmQgcmVtb3ZpbmcgdGhlbSB3aGVuIGl0IGlzIGluYWN0aXZlLlxuICogVGhlIHByaW1hcnkgdXNlLWNhc2UgaXMgdG8gc2ltcGxpZnkgdGhlIHNwZWNpYWwgYXBwZWFyYW5jZSBvZiBuYXZpZ2F0aW9uIG1lbnVzXG4gKiByZWx5aW5nIG9uIGB1aS1zcmVmYCwgYnkgaGF2aW5nIHRoZSBcImFjdGl2ZVwiIHN0YXRlJ3MgbWVudSBidXR0b24gYXBwZWFyIGRpZmZlcmVudCxcbiAqIGRpc3Rpbmd1aXNoaW5nIGl0IGZyb20gdGhlIGluYWN0aXZlIG1lbnUgaXRlbXMuXG4gKlxuICogdWktc3JlZi1hY3RpdmUgY2FuIGxpdmUgb24gdGhlIHNhbWUgZWxlbWVudCBhcyB1aS1zcmVmIG9yIG9uIGEgcGFyZW50IGVsZW1lbnQuIFRoZSBmaXJzdFxuICogdWktc3JlZi1hY3RpdmUgZm91bmQgYXQgdGhlIHNhbWUgbGV2ZWwgb3IgYWJvdmUgdGhlIHVpLXNyZWYgd2lsbCBiZSB1c2VkLlxuICpcbiAqIFdpbGwgYWN0aXZhdGUgd2hlbiB0aGUgdWktc3JlZidzIHRhcmdldCBzdGF0ZSBvciBhbnkgY2hpbGQgc3RhdGUgaXMgYWN0aXZlLiBJZiB5b3VcbiAqIG5lZWQgdG8gYWN0aXZhdGUgb25seSB3aGVuIHRoZSB1aS1zcmVmIHRhcmdldCBzdGF0ZSBpcyBhY3RpdmUgYW5kICpub3QqIGFueSBvZlxuICogaXQncyBjaGlsZHJlbiwgdGhlbiB5b3Ugd2lsbCB1c2VcbiAqIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXNyZWYtYWN0aXZlLWVxIHVpLXNyZWYtYWN0aXZlLWVxfVxuICpcbiAqIEBleGFtcGxlXG4gKiBHaXZlbiB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOlxuICogPHByZT5cbiAqIDx1bD5cbiAqICAgPGxpIHVpLXNyZWYtYWN0aXZlPVwiYWN0aXZlXCIgY2xhc3M9XCJpdGVtXCI+XG4gKiAgICAgPGEgaHJlZiB1aS1zcmVmPVwiYXBwLnVzZXIoe3VzZXI6ICdiaWxib2JhZ2dpbnMnfSlcIj5AYmlsYm9iYWdnaW5zPC9hPlxuICogICA8L2xpPlxuICogPC91bD5cbiAqIDwvcHJlPlxuICpcbiAqXG4gKiBXaGVuIHRoZSBhcHAgc3RhdGUgaXMgXCJhcHAudXNlclwiIChvciBhbnkgY2hpbGRyZW4gc3RhdGVzKSwgYW5kIGNvbnRhaW5zIHRoZSBzdGF0ZSBwYXJhbWV0ZXIgXCJ1c2VyXCIgd2l0aCB2YWx1ZSBcImJpbGJvYmFnZ2luc1wiLFxuICogdGhlIHJlc3VsdGluZyBIVE1MIHdpbGwgYXBwZWFyIGFzIChub3RlIHRoZSAnYWN0aXZlJyBjbGFzcyk6XG4gKiA8cHJlPlxuICogPHVsPlxuICogICA8bGkgdWktc3JlZi1hY3RpdmU9XCJhY3RpdmVcIiBjbGFzcz1cIml0ZW0gYWN0aXZlXCI+XG4gKiAgICAgPGEgdWktc3JlZj1cImFwcC51c2VyKHt1c2VyOiAnYmlsYm9iYWdnaW5zJ30pXCIgaHJlZj1cIi91c2Vycy9iaWxib2JhZ2dpbnNcIj5AYmlsYm9iYWdnaW5zPC9hPlxuICogICA8L2xpPlxuICogPC91bD5cbiAqIDwvcHJlPlxuICpcbiAqIFRoZSBjbGFzcyBuYW1lIGlzIGludGVycG9sYXRlZCAqKm9uY2UqKiBkdXJpbmcgdGhlIGRpcmVjdGl2ZXMgbGluayB0aW1lIChhbnkgZnVydGhlciBjaGFuZ2VzIHRvIHRoZVxuICogaW50ZXJwb2xhdGVkIHZhbHVlIGFyZSBpZ25vcmVkKS5cbiAqXG4gKiBNdWx0aXBsZSBjbGFzc2VzIG1heSBiZSBzcGVjaWZpZWQgaW4gYSBzcGFjZS1zZXBhcmF0ZWQgZm9ybWF0OlxuICogPHByZT5cbiAqIDx1bD5cbiAqICAgPGxpIHVpLXNyZWYtYWN0aXZlPSdjbGFzczEgY2xhc3MyIGNsYXNzMyc+XG4gKiAgICAgPGEgdWktc3JlZj1cImFwcC51c2VyXCI+bGluazwvYT5cbiAqICAgPC9saT5cbiAqIDwvdWw+XG4gKiA8L3ByZT5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktc3JlZi1hY3RpdmUtZXFcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQYXJhbXNcbiAqIEByZXF1aXJlcyAkaW50ZXJwb2xhdGVcbiAqXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIHNhbWUgYXMge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktc3JlZi1hY3RpdmUgdWktc3JlZi1hY3RpdmV9IGJ1dCB3aWxsIHdpbGwgb25seSBhY3RpdmF0ZVxuICogd2hlbiB0aGUgZXhhY3QgdGFyZ2V0IHN0YXRlIHVzZWQgaW4gdGhlIGB1aS1zcmVmYCBpcyBhY3RpdmU7IG5vIGNoaWxkIHN0YXRlcy5cbiAqXG4gKi9cbiRTdGF0ZVJlZkFjdGl2ZURpcmVjdGl2ZS4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpbnRlcnBvbGF0ZSddO1xuZnVuY3Rpb24gJFN0YXRlUmVmQWN0aXZlRGlyZWN0aXZlKCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkaW50ZXJwb2xhdGUpIHtcbiAgcmV0dXJuICB7XG4gICAgcmVzdHJpY3Q6IFwiQVwiLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsIGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgIHZhciBzdGF0ZSwgcGFyYW1zLCBhY3RpdmVDbGFzcztcblxuICAgICAgLy8gVGhlcmUgcHJvYmFibHkgaXNuJ3QgbXVjaCBwb2ludCBpbiAkb2JzZXJ2aW5nIHRoaXNcbiAgICAgIC8vIHVpU3JlZkFjdGl2ZSBhbmQgdWlTcmVmQWN0aXZlRXEgc2hhcmUgdGhlIHNhbWUgZGlyZWN0aXZlIG9iamVjdCB3aXRoIHNvbWVcbiAgICAgIC8vIHNsaWdodCBkaWZmZXJlbmNlIGluIGxvZ2ljIHJvdXRpbmdcbiAgICAgIGFjdGl2ZUNsYXNzID0gJGludGVycG9sYXRlKCRhdHRycy51aVNyZWZBY3RpdmVFcSB8fCAkYXR0cnMudWlTcmVmQWN0aXZlIHx8ICcnLCBmYWxzZSkoJHNjb3BlKTtcblxuICAgICAgLy8gQWxsb3cgdWlTcmVmIHRvIGNvbW11bmljYXRlIHdpdGggdWlTcmVmQWN0aXZlW0VxdWFsc11cbiAgICAgIHRoaXMuJCRzZXRTdGF0ZUluZm8gPSBmdW5jdGlvbiAobmV3U3RhdGUsIG5ld1BhcmFtcykge1xuICAgICAgICBzdGF0ZSA9ICRzdGF0ZS5nZXQobmV3U3RhdGUsIHN0YXRlQ29udGV4dCgkZWxlbWVudCkpO1xuICAgICAgICBwYXJhbXMgPSBuZXdQYXJhbXM7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG5cbiAgICAgIC8vIFVwZGF0ZSByb3V0ZSBzdGF0ZVxuICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICBpZiAoaXNNYXRjaCgpKSB7XG4gICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc01hdGNoKCkge1xuICAgICAgICBpZiAodHlwZW9mICRhdHRycy51aVNyZWZBY3RpdmVFcSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gJHN0YXRlLiRjdXJyZW50LnNlbGYgPT09IHN0YXRlICYmIG1hdGNoZXNQYXJhbXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJHN0YXRlLmluY2x1ZGVzKHN0YXRlLm5hbWUpICYmIG1hdGNoZXNQYXJhbXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYXRjaGVzUGFyYW1zKCkge1xuICAgICAgICByZXR1cm4gIXBhcmFtcyB8fCBlcXVhbEZvcktleXMocGFyYW1zLCAkc3RhdGVQYXJhbXMpO1xuICAgICAgfVxuICAgIH1dXG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKVxuICAuZGlyZWN0aXZlKCd1aVNyZWYnLCAkU3RhdGVSZWZEaXJlY3RpdmUpXG4gIC5kaXJlY3RpdmUoJ3VpU3JlZkFjdGl2ZScsICRTdGF0ZVJlZkFjdGl2ZURpcmVjdGl2ZSlcbiAgLmRpcmVjdGl2ZSgndWlTcmVmQWN0aXZlRXEnLCAkU3RhdGVSZWZBY3RpdmVEaXJlY3RpdmUpO1xuXG4vKipcbiAqIEBuZ2RvYyBmaWx0ZXJcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5maWx0ZXI6aXNTdGF0ZVxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUcmFuc2xhdGVzIHRvIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfaXMgJHN0YXRlLmlzKFwic3RhdGVOYW1lXCIpfS5cbiAqL1xuJElzU3RhdGVGaWx0ZXIuJGluamVjdCA9IFsnJHN0YXRlJ107XG5mdW5jdGlvbiAkSXNTdGF0ZUZpbHRlcigkc3RhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgcmV0dXJuICRzdGF0ZS5pcyhzdGF0ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQG5nZG9jIGZpbHRlclxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmZpbHRlcjppbmNsdWRlZEJ5U3RhdGVcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVHJhbnNsYXRlcyB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2luY2x1ZGVzICRzdGF0ZS5pbmNsdWRlcygnZnVsbE9yUGFydGlhbFN0YXRlTmFtZScpfS5cbiAqL1xuJEluY2x1ZGVkQnlTdGF0ZUZpbHRlci4kaW5qZWN0ID0gWyckc3RhdGUnXTtcbmZ1bmN0aW9uICRJbmNsdWRlZEJ5U3RhdGVGaWx0ZXIoJHN0YXRlKSB7XG4gIHJldHVybiBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHJldHVybiAkc3RhdGUuaW5jbHVkZXMoc3RhdGUpO1xuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJylcbiAgLmZpbHRlcignaXNTdGF0ZScsICRJc1N0YXRlRmlsdGVyKVxuICAuZmlsdGVyKCdpbmNsdWRlZEJ5U3RhdGUnLCAkSW5jbHVkZWRCeVN0YXRlRmlsdGVyKTtcbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuIl19
