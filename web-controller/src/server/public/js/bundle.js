(function () {
'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = findIndex;
});

function persistState(payload) {
  var requestOpts = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  };

  fetch('/model', requestOpts).then(function (res) {
    return res.json();
  }).then(function (json) {
    render(represent(json));
  }).catch(function (err) {
    render(represent(err));
  });

  return false;
}

function selectCiTool(ciTool) {
  var currentState = JSON.parse(window.localStorage.getItem('currentState'));
  var toolIdx = index(currentState, { name: 'ci server' });
  currentState[toolIdx].configuration.tool = ciTool;
  window.localStorage.setItem('currentState', JSON.stringify(currentState));
  render(currentState);
}

function removeJob(index$$1) {
  var currentState = JSON.parse(window.localStorage.getItem('currentState'));
  var toolIdx = index(currentState, { name: 'jobs to monitor' });
  currentState[toolIdx].configuration.items.splice(index$$1, 1);
  window.localStorage.setItem('currentState', JSON.stringify(currentState));
  render(currentState);
}

function addNewJob() {
  var currentState = JSON.parse(window.localStorage.getItem('currentState'));
  var toolIdx = index(currentState, { name: 'jobs to monitor' });
  currentState[toolIdx].configuration.items.push({ name: '', active: false });
  window.localStorage.setItem('currentState', JSON.stringify(currentState));
  render(currentState);
}

function switchToTab(tabName, present) {
  return persistState({ tabChange: tabName });
}

function dismissAlert(model) {
  render(model);
  return false;
}

function reboot() {
  fetch('/reboot').then(function (res) {
    return res.json();
  }).then(function (json) {
    render(represent(json));
  }).catch(function (err) {
    render(represent(err));
  });

  return false;
}

function shutdown() {
  fetch('/shutdown').then(function (res) {
    return res.json();
  }).then(function (json) {
    render(represent(json));
  }).catch(function (err) {
    render(represent(err));
  });

  return false;
}

function completeDeviceAction(model) {
  if (model.reboot) {
    location.reload();
  } else {
    model.completed = true;
    render(model);
  }
}

function save(data, present) {
  return persistState(data);
}

var infernoDom$1 = createCommonjsModule(function (module, exports) {
/*!
 * inferno-dom v0.7.27
 * (c) 2016 Dominic Gannaway
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.InfernoDOM = factory());
}(commonjsGlobal, (function () { 'use strict';

function addChildrenToProps(children, props) {
	if (!isNullOrUndefined(children)) {
		var isChildrenArray = isArray(children);
		if (isChildrenArray && children.length > 0 || !isChildrenArray) {
			if (props) {
				props = Object.assign({}, props, { children: children });
			} else {
				props = {
					children: children
				};
			}
		}
	}
	return props;
}

var NO_RENDER = 'NO_RENDER';

// Runs only once in applications lifetime
var isBrowser = typeof window !== 'undefined' && window.document;

function isArray(obj) {
	return obj instanceof Array;
}

function isStatefulComponent(obj) {
	return obj.prototype && obj.prototype.render !== undefined;
}

function isStringOrNumber(obj) {
	return isString(obj) || isNumber(obj);
}

function isNullOrUndefined(obj) {
	return isUndefined(obj) || isNull(obj);
}

function isInvalidNode(obj) {
	return isNull(obj) || obj === false || obj === true || isUndefined(obj);
}

function isFunction(obj) {
	return typeof obj === 'function';
}

function isString(obj) {
	return typeof obj === 'string';
}

function isNumber(obj) {
	return typeof obj === 'number';
}

function isNull(obj) {
	return obj === null;
}

function isTrue(obj) {
	return obj === true;
}

function isUndefined(obj) {
	return obj === undefined;
}

function deepScanChildrenForNode(children, node) {
	if (!isInvalidNode(children)) {
		if (isArray(children)) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i];

				if (!isInvalidNode(child)) {
					if (child === node) {
						return true;
					} else if (child.children) {
						return deepScanChildrenForNode(child.children, node);
					}
				}
			}
		} else {
			if (children === node) {
				return true;
			} else if (children.children) {
				return deepScanChildrenForNode(children.children, node);
			}
		}
	}
	return false;
}

function getRefInstance$1(node, instance) {
	var children = instance.props.children;

	if (deepScanChildrenForNode(children, node)) {
		return getRefInstance$1(node, instance._parentComponent);
	}
	return instance;
}

var recyclingEnabled = true;

function recycle(node, bp, lifecycle, context, instance) {
	if (bp !== undefined) {
		var pool = bp.pool;
		var recycledNode = pool.pop();

		if (!isNullOrUndefined(recycledNode)) {
			patch(recycledNode, node, null, lifecycle, context, instance, bp.isSVG);
			return node.dom;
		}
	}
	return null;
}

function pool(node) {
	var bp = node.bp;

	if (!isNullOrUndefined(bp)) {
		bp.pool.push(node);
		return true;
	}
	return false;
}

function unmount(input, parentDom) {
	if (isVList(input)) {
		unmountVList(input, parentDom, true);
	} else if (isVNode(input)) {
		unmountVNode(input, parentDom, false);
	}
}

function unmountVList(vList, parentDom, removePointer) {
	var items = vList.items;
	var itemsLength = items.length;
	var pointer = vList.pointer;

	if (itemsLength > 0) {
		for (var i = 0; i < itemsLength; i++) {
			var item = items[i];

			if (isVList(item)) {
				unmountVList(item, parentDom, true);
			} else {
				if (parentDom) {
					removeChild(parentDom, item.dom);
				}
				unmount(item, null);
			}
		}
	}
	if (parentDom && removePointer) {
		removeChild(parentDom, pointer);
	}
}

function unmountVNode(node, parentDom, shallow) {
	var instance = node.instance;
	var instanceHooks = null;
	var instanceChildren = null;

	if (!isNullOrUndefined(instance)) {
		instanceHooks = instance.hooks;
		instanceChildren = instance.children;

		if (instance.render !== undefined) {
			instance.componentWillUnmount();
			instance._unmounted = true;
			componentToDOMNodeMap.delete(instance);
			!shallow && unmount(instance._lastNode, null);
		}
	}
	var hooks = node.hooks || instanceHooks;

	if (!isNullOrUndefined(hooks)) {
		if (!isNullOrUndefined(hooks.willDetach)) {
			hooks.willDetach(node.dom);
		}
		if (!isNullOrUndefined(hooks.componentWillUnmount)) {
			hooks.componentWillUnmount(node.dom, hooks);
		}
	}
	var children = (isNullOrUndefined(instance) ? node.children : null) || instanceChildren;

	if (!isNullOrUndefined(children)) {
		if (isArray(children)) {
			for (var i = 0; i < children.length; i++) {
				unmount(children[i], null);
			}
		} else {
			unmount(children, null);
		}
	}
}

function VText(text) {
	this.text = text;
	this.dom = null;
}

function VPlaceholder() {
	this.placeholder = true;
	this.dom = null;
}

function VList(items) {
	this.dom = null;
	this.pointer = null;
	this.items = items;
}

function createVText(text) {
	return new VText(text);
}

function createVPlaceholder() {
	return new VPlaceholder();
}

function createVList(items) {
	return new VList(items);
}

function constructDefaults(string, object, value) {
	/* eslint no-return-assign: 0 */
	string.split(',').forEach(function (i) { return object[i] = value; });
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var strictProps = {};
var booleanProps = {};
var namespaces = {};
var isUnitlessNumber = {};

constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,value', strictProps, true);
constructDefaults('muted,scoped,loop,open,checked,default,capture,disabled,selected,readonly,multiple,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);
constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

function isVText(o) {
	return o.text !== undefined;
}

function isVPlaceholder(o) {
	return o.placeholder === true;
}

function isVList(o) {
	return o.items !== undefined;
}

function isVNode(o) {
	return o.tag !== undefined || o.bp !== undefined;
}

function insertOrAppend(parentDom, newNode, nextNode) {
	if (isNullOrUndefined(nextNode)) {
		parentDom.appendChild(newNode);
	} else {
		parentDom.insertBefore(newNode, nextNode);
	}
}

function replaceVListWithNode(parentDom, vList, dom) {
	var pointer = vList.pointer;

	unmountVList(vList, parentDom, false);
	replaceNode(parentDom, dom, pointer);
}

function documentCreateElement(tag, isSVG) {
	var dom;

	if (isSVG === true) {
		dom = document.createElementNS('http://www.w3.org/2000/svg', tag);
	} else {
		dom = document.createElement(tag);
	}
	return dom;
}

function appendText(text, parentDom, singleChild) {
	if (parentDom === null) {
		return document.createTextNode(text);
	} else {
		if (singleChild) {
			if (text !== '') {
				parentDom.textContent = text;
				return parentDom.firstChild;
			} else {
				var textNode = document.createTextNode('');

				parentDom.appendChild(textNode);
				return textNode;
			}
		} else {
			var textNode$1 = document.createTextNode(text);

			parentDom.appendChild(textNode$1);
			return textNode$1;
		}
	}
}

function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG) {
	var lastInstance = null;
	var instanceLastNode = lastNode._lastNode;

	if (!isNullOrUndefined(instanceLastNode)) {
		lastInstance = lastNode;
		lastNode = instanceLastNode;
	}
	unmount(lastNode, false);
	var dom = mount(nextNode, null, lifecycle, context, instance, isSVG);

	nextNode.dom = dom;
	replaceNode(parentDom, dom, lastNode.dom);
	if (lastInstance !== null) {
		lastInstance._lastNode = nextNode;
	}
}

function replaceNode(parentDom, nextDom, lastDom) {
	parentDom.replaceChild(nextDom, lastDom);
}

function normalise(object) {
	if (isStringOrNumber(object)) {
		return createVText(object);
	} else if (isInvalidNode(object)) {
		return createVPlaceholder();
	} else if (isArray(object)) {
		return createVList(object);
	}
	return object;
}

function normaliseChild(children, i) {
	var child = children[i];

	return children[i] = normalise(child);
}

function remove(node, parentDom) {
	if (isVList(node)) {
		return unmount(node, parentDom);
	}
	var dom = node.dom;
	if (dom === parentDom) {
		dom.innerHTML = '';
	} else {
		removeChild(parentDom, dom);
		if (recyclingEnabled) {
			pool(node);
		}
	}
	unmount(node, false);
}

function removeChild(parentDom, dom) {
	parentDom.removeChild(dom);
}

function removeEvents(events, lastEventKeys, dom) {
	var eventKeys = lastEventKeys || Object.keys(events);

	for (var i = 0; i < eventKeys.length; i++) {
		var event = eventKeys[i];

		dom[event] = null;
	}
}

// TODO: for node we need to check if document is valid
function getActiveNode() {
	return document.activeElement;
}

function removeAllChildren(dom, children) {
	if (recyclingEnabled) {
		var childrenLength = children.length;

		if (childrenLength > 5) {
			for (var i = 0; i < childrenLength; i++) {
				var child = children[i];

				if (!isInvalidNode(child)) {
					pool(child);
				}
			}
		}
	}
	dom.textContent = '';
}

function resetActiveNode(activeNode) {
	if (activeNode !== null && activeNode !== document.body && document.activeElement !== activeNode) {
		activeNode.focus(); // TODO: verify are we doing new focus event, if user has focus listener this might trigger it
	}
}

function isKeyed(lastChildren, nextChildren) {
	if (lastChildren.complex) {
		return false;
	}
	return nextChildren.length && !isNullOrUndefined(nextChildren[0]) && !isNullOrUndefined(nextChildren[0].key)
		&& lastChildren.length && !isNullOrUndefined(lastChildren[0]) && !isNullOrUndefined(lastChildren[0].key);
}

function selectOptionValueIfNeeded(vdom, values) {
	if (vdom.tag !== 'option') {
		for (var i = 0, len = vdom.children.length; i < len; i++) {
			selectOptionValueIfNeeded(vdom.children[i], values);
		}
		// NOTE! Has to be a return here to catch optGroup elements
		return;
	}

	var value = vdom.attrs && vdom.attrs.value;

	if (values[value]) {
		vdom.attrs = vdom.attrs || {};
		vdom.attrs.selected = 'selected';
		vdom.dom.selected = true;
	} else {
		vdom.dom.selected = false;
	}
}

function selectValue(vdom) {
	var value = vdom.attrs && vdom.attrs.value;

	var values = {};
	if (isArray(value)) {
		for (var i = 0, len = value.length; i < len; i++) {
			values[value[i]] = value[i];
		}
	} else {
		values[value] = value;
	}
	for (var i$1 = 0, len$1 = vdom.children.length; i$1 < len$1; i$1++) {
		selectOptionValueIfNeeded(vdom.children[i$1], values);
	}

	if (vdom.attrs && vdom.attrs[value]) {
		delete vdom.attrs.value; // TODO! Avoid deletion here. Set to null or undef. Not sure what you want to usev
	}
}

function handleAttachedHooks(hooks, lifecycle, dom) {
	if (!isNullOrUndefined(hooks.created)) {
		hooks.created(dom);
	}
	if (!isNullOrUndefined(hooks.attached)) {
		lifecycle.addListener(function () {
			hooks.attached(dom);
		});
	}
}

function setValueProperty(nextNode) {
	var value = nextNode.attrs.value;
	if (!isNullOrUndefined(value)) {
		nextNode.dom.value = value;
	}
}

function setFormElementProperties(nextTag, nextNode) {
	if (nextTag === 'input' && nextNode.attrs) {
		var inputType = nextNode.attrs.type;
		if (inputType === 'text') {
			setValueProperty(nextNode);
		} else if (inputType === 'checkbox' || inputType === 'radio') {
			var checked = nextNode.attrs.checked;
			nextNode.dom.checked = !!checked;
		}
	} else if (nextTag === 'textarea') {
		setValueProperty(nextNode);
	}
}

function mount(input, parentDom, lifecycle, context, instance, isSVG) {
	if (isVPlaceholder(input)) {
		return mountVPlaceholder(input, parentDom);
	} else if (isVText(input)) {
		return mountVText(input, parentDom);
	} else if (isVList(input)) {
		return mountVList(input, parentDom, lifecycle, context, instance, isSVG);
	} else if (isVNode(input)) {
		return mountVNode$1(input, parentDom, lifecycle, context, instance, isSVG);
	} else {
		var normalisedInput = normalise(input);

		if (input !== normalisedInput) {
			return mount(normalisedInput, parentDom, lifecycle, context, instance, isSVG);
		} else {
			throw new Error(("Inferno Error: invalid object \"" + (typeof input) + "\" passed to mount()"));
		}
	}
}

function mountVNode$1(vNode, parentDom, lifecycle, context, instance, isSVG) {
	var bp = vNode.bp;

	if (isUndefined(bp)) {
		return mountVNodeWithoutBlueprint(vNode, parentDom, lifecycle, context, instance, isSVG);
	} else {
		if (recyclingEnabled) {
			var dom = recycle(vNode, bp, lifecycle, context, instance);

			if (!isNull(dom)) {
				if (!isNull(parentDom)) {
					parentDom.appendChild(dom);
				}
				return dom;
			}
		}
		return mountVNodeWithBlueprint(vNode, bp, parentDom, lifecycle, context, instance);
	}
}

function mountVList(vList, parentDom, lifecycle, context, instance, isSVG) {
	var items = vList.items;
	var pointer = document.createTextNode('');
	var dom = document.createDocumentFragment();

	mountArrayChildren(items, dom, lifecycle, context, instance, isSVG);
	vList.pointer = pointer;
	vList.dom = dom;
	dom.appendChild(pointer);
	if (parentDom) {
		insertOrAppend(parentDom, dom);
	}
	return dom;
}

function mountVText(vText, parentDom) {
	var dom = document.createTextNode(vText.text);

	vText.dom = dom;
	if (parentDom) {
		insertOrAppend(parentDom, dom);
	}
	return dom;
}

function mountVPlaceholder(vPlaceholder, parentDom) {
	var dom = document.createTextNode('');

	vPlaceholder.dom = dom;
	if (parentDom) {
		insertOrAppend(parentDom, dom);
	}
	return dom;
}

function handleSelects(node) {
	if (node.tag === 'select') {
		selectValue(node);
	}
}

function mountBlueprintAttrs(node, bp, dom, instance) {
	handleSelects(node);
	var attrs = node.attrs;

	if (isNull(bp.attrKeys)) {
		var newKeys = Object.keys(attrs);
		bp.attrKeys = bp.attrKeys ? bp.attrKeys.concat(newKeys) : newKeys;
	}
	var attrKeys = bp.attrKeys;

	mountAttributes(node, attrs, attrKeys, dom, instance);
}

function mountBlueprintEvents(node, bp, dom) {
	var events = node.events;

	if (isNull(bp.eventKeys)) {
		bp.eventKeys = Object.keys(events);
	}
	var eventKeys = bp.eventKeys;

	mountEvents(events, eventKeys, dom);
}

function mountVNodeWithBlueprint(node, bp, parentDom, lifecycle, context, instance) {
	var tag = node.tag;

	if (isTrue(bp.isComponent)) {
		return mountComponent(node, tag, node.attrs || {}, node.hooks, node.children, instance, parentDom, lifecycle, context);
	}
	var dom = documentCreateElement(bp.tag, bp.isSVG);

	node.dom = dom;
	if (isTrue(bp.hasHooks)) {
		handleAttachedHooks(node.hooks, lifecycle, dom);
	}
	if (isTrue(bp.lazy)) {
		handleLazyAttached(node, lifecycle, dom);
	}
	var children = node.children;
	// bp.childrenType:
	// 0: no children
	// 1: text node
	// 2: single child
	// 3: multiple children
	// 4: multiple children (keyed)
	// 5: variable children (defaults to no optimisation)

	switch (bp.childrenType) {
		case 1:
			appendText(children, dom, true);
			break;
		case 2:
			mount(node.children, dom, lifecycle, context, instance, bp.isSVG);
			break;
		case 3:
			mountArrayChildren(children, dom, lifecycle, context, instance, bp.isSVG);
			break;
		case 4:
			for (var i = 0; i < children.length; i++) {
				mount(children[i], dom, lifecycle, context, instance, bp.isSVG);
			}
			break;
		case 5:
			mountChildren(node, children, dom, lifecycle, context, instance, bp.isSVG);
			break;
		default:
			break;
	}

	if (isTrue(bp.hasAttrs)) {
		mountBlueprintAttrs(node, bp, dom, instance);
	}
	if (isTrue(bp.hasClassName)) {
		dom.className = node.className;
	}
	if (isTrue(bp.hasStyle)) {
		patchStyle(null, node.style, dom);
	}
	if (isTrue(bp.hasEvents)) {
		mountBlueprintEvents(node, bp, dom);
	}
	if (!isNull(parentDom)) {
		parentDom.appendChild(dom);
	}
	return dom;
}

function mountVNodeWithoutBlueprint(node, parentDom, lifecycle, context, instance, isSVG) {
	var tag = node.tag;

	if (isFunction(tag)) {
		return mountComponent(node, tag, node.attrs || {}, node.hooks, node.children, instance, parentDom, lifecycle, context);
	}
	if (!isString(tag) || tag === '') {
		throw Error('Inferno Error: Expected function or string for element tag type');
	}
	if (tag === 'svg') {
		isSVG = true;
	}
	var dom = documentCreateElement(tag, isSVG);
	var children = node.children;
	var attrs = node.attrs;
	var events = node.events;
	var hooks = node.hooks;
	var className = node.className;
	var style = node.style;

	node.dom = dom;
	if (!isNullOrUndefined(hooks)) {
		handleAttachedHooks(hooks, lifecycle, dom);
	}
	if (!isInvalidNode(children)) {
		mountChildren(node, children, dom, lifecycle, context, instance, isSVG);
	}
	if (!isNullOrUndefined(attrs)) {
		handleSelects(node);
		mountAttributes(node, attrs, Object.keys(attrs), dom, instance);
	}
	if (!isNullOrUndefined(className)) {
		dom.className = className;
	}
	if (!isNullOrUndefined(style)) {
		patchStyle(null, style, dom);
	}
	if (!isNullOrUndefined(events)) {
		mountEvents(events, Object.keys(events), dom);
	}
	if (!isNull(parentDom)) {
		parentDom.appendChild(dom);
	}
	return dom;
}

function mountArrayChildren(children, parentDom, lifecycle, context, instance, isSVG) {
	children.complex = false;
	for (var i = 0; i < children.length; i++) {
		var child = normaliseChild(children, i);

		if (isVText(child)) {
			mountVText(child, parentDom);
			children.complex = true;
		} else if (isVPlaceholder(child)) {
			mountVPlaceholder(child, parentDom);
			children.complex = true;
		} else if (isVList(child)) {
			mountVList(child, parentDom, lifecycle, context, instance, isSVG);
			children.complex = true;
		} else {
			mount(child, parentDom, lifecycle, context, instance, isSVG);
		}
	}
}

function mountChildren(node, children, parentDom, lifecycle, context, instance, isSVG) {
	if (isArray(children)) {
		mountArrayChildren(children, parentDom, lifecycle, context, instance, isSVG);
	} else if (isStringOrNumber(children)) {
		appendText(children, parentDom, true);
	} else if (!isInvalidNode(children)) {
		mount(children, parentDom, lifecycle, context, instance, isSVG);
	}
}

function mountRef(instance, value, refValue) {
	if (!isInvalidNode(instance) && isString(value)) {
		instance.refs[value] = refValue;
	}
}

function mountEvents(events, eventKeys, dom) {
	for (var i = 0; i < eventKeys.length; i++) {
		var event = eventKeys[i];

		dom[event] = events[event];
	}
}

function mountComponent(parentNode, Component, props, hooks, children, lastInstance, parentDom, lifecycle, context) {
	props = addChildrenToProps(children, props);

	var dom;
	if (isStatefulComponent(Component)) {
		var instance = new Component(props, context);

		instance._patch = patch;
		instance._componentToDOMNodeMap = componentToDOMNodeMap;
		if (!isNullOrUndefined(lastInstance) && props.ref) {
			mountRef(lastInstance, props.ref, instance);
		}
		var childContext = instance.getChildContext();

		if (!isNullOrUndefined(childContext)) {
			context = Object.assign({}, context, childContext);
		}
		instance.context = context;
		instance._unmounted = false;
		instance._parentNode = parentNode;
		if (lastInstance) {
			instance._parentComponent = lastInstance;
		}
		instance._pendingSetState = true;
		instance.componentWillMount();
		var node = instance.render();

		if (isInvalidNode(node)) {
			node = createVPlaceholder();
		}
		instance._pendingSetState = false;
		dom = mount(node, null, lifecycle, context, instance, false);
		instance._lastNode = node;
		instance.componentDidMount();
		if (parentDom !== null && !isInvalidNode(dom)) {
			parentDom.appendChild(dom);
		}
		componentToDOMNodeMap.set(instance, dom);
		parentNode.dom = dom;
		parentNode.instance = instance;
	} else {
		if (!isNullOrUndefined(hooks)) {
			if (!isNullOrUndefined(hooks.componentWillMount)) {
				hooks.componentWillMount(null, props);
			}
			if (!isNullOrUndefined(hooks.componentDidMount)) {
				lifecycle.addListener(function () {
					hooks.componentDidMount(dom, props);
				});
			}
		}

		/* eslint new-cap: 0 */
		var node$1 = Component(props, context);

		if (isInvalidNode(node$1)) {
			node$1 = createVPlaceholder();
		}
		dom = mount(node$1, null, lifecycle, context, null, false);

		parentNode.instance = node$1;

		if (parentDom !== null && !isInvalidNode(dom)) {
			parentDom.appendChild(dom);
		}
		parentNode.dom = dom;
	}
	return dom;
}

function mountAttributes(node, attrs, attrKeys, dom, instance) {
	for (var i = 0; i < attrKeys.length; i++) {
		var attr = attrKeys[i];

		if (attr === 'ref') {
			mountRef(getRefInstance$1(node, instance), attrs[attr], dom);
		} else {
			patchAttribute(attr, null, attrs[attr], dom);
		}
	}
}

function patch(lastInput, nextInput, parentDom, lifecycle, context, instance, isSVG) {
	if (lastInput !== nextInput) {
		if (isInvalidNode(lastInput)) {
			mount(nextInput, parentDom, lifecycle, context, instance, isSVG);
		} else if (isInvalidNode(nextInput)) {
			remove(lastInput, parentDom);
		} else if (isStringOrNumber(lastInput)) {
			if (isStringOrNumber(nextInput)) {
				parentDom.firstChild.nodeValue = nextInput;
			} else {
				var dom = mount(nextInput, null, lifecycle, context, instance, isSVG);

				nextInput.dom = dom;
				replaceNode(parentDom, dom, parentDom.firstChild);
			}
		} else if (isStringOrNumber(nextInput)) {
			replaceNode(parentDom, document.createTextNode(nextInput), lastInput.dom);
		} else {
			if (isVList(nextInput)) {
				if (isVList(lastInput)) {
					patchVList(lastInput, nextInput, parentDom, lifecycle, context, instance, isSVG);
				} else {
					replaceNode(parentDom, mountVList(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVList(lastInput)) {
				replaceVListWithNode(parentDom, lastInput, mount(nextInput, null, lifecycle, context, instance, isSVG));
			} else if (isVPlaceholder(nextInput)) {
				if (isVPlaceholder(lastInput)) {
					patchVFragment(lastInput, nextInput);
				} else {
					replaceNode(parentDom, mountVPlaceholder(nextInput, null), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVPlaceholder(lastInput)) {
				replaceNode(parentDom, mount(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
			} else if (isVText(nextInput)) {
				if (isVText(lastInput)) {
					patchVText(lastInput, nextInput);
				} else {
					replaceNode(parentDom, mountVText(nextInput, null), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVText(lastInput)) {
				replaceNode(parentDom, mount(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
			} else if (isVNode(nextInput)) {
				if (isVNode(lastInput)) {
					patchVNode(lastInput, nextInput, parentDom, lifecycle, context, instance, isSVG, false);
				} else {
					replaceNode(parentDom, mountVNode(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVNode(lastInput)) {
				replaceNode(parentDom, mount(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
				unmount(lastInput, null);
			} else {
				return patch(lastInput, normalise(nextInput), parentDom, lifecycle, context, instance, isSVG);
			}
		}
	}
	return nextInput;
}

function patchTextNode(dom, lastChildren, nextChildren) {
	if (isStringOrNumber(lastChildren) && lastChildren !== '') {
		dom.firstChild.nodeValue = nextChildren;
	} else {
		dom.textContent = nextChildren;
	}
}

function patchRef(instance, lastValue, nextValue, dom) {
	if (instance) {
		if (isString(lastValue)) {
			delete instance.refs[lastValue];
		}
		if (isString(nextValue)) {
			instance.refs[nextValue] = dom;
		}
	}
}

function patchChildren(lastNode, nextNode, dom, lifecycle, context, instance, isSVG) {
	var nextChildren = nextNode.children;
	var lastChildren = lastNode.children;

	if (lastChildren === nextChildren) {
		return;
	}
	if (isInvalidNode(lastChildren)) {
		if (isStringOrNumber(nextChildren)) {
			patchTextNode(dom, lastChildren, nextChildren);
		} else if (!isInvalidNode(nextChildren)) {
			if (isArray(nextChildren)) {
				mountArrayChildren(nextChildren, dom, lifecycle, context, instance, isSVG);
			} else {
				mount(nextChildren, dom, lifecycle, context, instance, isSVG);
			}
		}
	} else {
		if (isInvalidNode(nextChildren)) {
			removeAllChildren(dom, lastChildren);
		} else {
			if (isArray(lastChildren)) {
				if (isArray(nextChildren)) {
					nextChildren.complex = lastChildren.complex;
					if (isKeyed(lastChildren, nextChildren)) {
						patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, null);
					} else {
						patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, null);
					}
				} else {
					patchNonKeyedChildren(lastChildren, [nextChildren], dom, lifecycle, context, instance, isSVG, null);
				}
			} else {
				if (isArray(nextChildren)) {
					var lastChild = lastChildren;

					if (isStringOrNumber(lastChildren)) {
						lastChild = createVText(lastChild);
						lastChild.dom = dom.firstChild;
					}
					patchNonKeyedChildren([lastChild], nextChildren, dom, lifecycle, context, instance, isSVG, null);
				} else if (isStringOrNumber(nextChildren)) {
					patchTextNode(dom, lastChildren, nextChildren);
				} else if (isStringOrNumber(lastChildren)) {
					patch(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG);
				} else {
					patchVNode(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, false);
				}
			}
		}
	}
}

function patchVNode(lastVNode, nextVNode, parentDom, lifecycle, context, instance, isSVG, skipLazyCheck) {
	var lastBp = lastVNode.bp;
	var nextBp = nextVNode.bp;

	if (lastBp === undefined || nextBp === undefined) {
		patchVNodeWithoutBlueprint(lastVNode, nextVNode, parentDom, lifecycle, context, instance, isSVG);
	} else {
		patchVNodeWithBlueprint(lastVNode, nextVNode, lastBp, nextBp, parentDom, lifecycle, context, instance, skipLazyCheck);
	}
}

function patchVNodeWithBlueprint(lastVNode, nextVNode, lastBp, nextBp, parentDom, lifecycle, context, instance, skipLazyCheck) {
	var nextHooks;

	if (nextBp.hasHooks === true) {
		nextHooks = nextVNode.hooks;
		if (nextHooks && !isNullOrUndefined(nextHooks.willUpdate)) {
			nextHooks.willUpdate(lastVNode.dom);
		}
	}
	var nextTag = nextVNode.tag || nextBp.tag;
	var lastTag = lastVNode.tag || lastBp.tag;

	if (lastTag !== nextTag) {
		if (lastBp && lastBp.isComponent === true) {
			var lastNodeInstance = lastVNode.instance;

			if (nextBp.isComponent === true) {
				replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, instance, false);
			} else if (isStatefulComponent(lastTag)) {
				unmountVNode(lastVNode, null, true);
				var lastNode = lastNodeInstance._lastNode;
				patchVNodeWithBlueprint(lastNode, nextVNode, lastNode.bp, nextBp, parentDom, lifecycle, context, instance, nextBp.isSVG);
			} else {
				unmountVNode(lastVNode, null, true);
				patchVNodeWithBlueprint(lastNodeInstance, nextVNode, lastNodeInstance.bp, nextBp, parentDom, lifecycle, context, instance, nextBp.isSVG);
			}
		} else {
			replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, instance, nextBp.isSVG);
		}
	} else if (isNullOrUndefined(lastTag)) {
		nextVNode.dom = lastVNode.dom;
	} else {
		if (lastBp && lastBp.isComponent === true) {
			if (nextBp.isComponent === true) {
				var instance$1 = lastVNode.instance;

				if (!isNullOrUndefined(instance$1) && instance$1._unmounted) {
					var newDom = mountComponent(nextVNode, lastTag, nextVNode.attrs || {}, nextVNode.hooks, nextVNode.children, instance$1, parentDom, lifecycle, context);
					if (parentDom !== null) {
						replaceNode(parentDom, newDom, lastVNode.dom);
					}
				} else {
					nextVNode.instance = instance$1;
					nextVNode.dom = lastVNode.dom;
					patchComponent(true, nextVNode, nextVNode.tag, lastBp, nextBp, instance$1, lastVNode.attrs || {}, nextVNode.attrs || {}, nextVNode.hooks, lastVNode.children, nextVNode.children, parentDom, lifecycle, context);
				}
			}
		} else {
			var dom = lastVNode.dom;
			var lastChildrenType = lastBp.childrenType;
			var nextChildrenType = nextBp.childrenType;
			nextVNode.dom = dom;

			if (nextBp.lazy === true && skipLazyCheck === false) {
				var clipData = lastVNode.clipData;

				if (lifecycle.scrollY === null) {
					lifecycle.refresh();
				}

				nextVNode.clipData = clipData;
				if (clipData.pending === true || clipData.top - lifecycle.scrollY > lifecycle.screenHeight) {
					if (setClipNode(clipData, dom, lastVNode, nextVNode, parentDom, lifecycle, context, instance, lastBp.isSVG)) {
						return;
					}
				}
				if (clipData.bottom < lifecycle.scrollY) {
					if (setClipNode(clipData, dom, lastVNode, nextVNode, parentDom, lifecycle, context, instance, lastBp.isSVG)) {
						return;
					}
				}
			}

			if (lastChildrenType > 0 || nextChildrenType > 0) {
				if (nextChildrenType === 5 || lastChildrenType === 5) {
					patchChildren(lastVNode, nextVNode, dom, lifecycle, context, instance);
				} else {
					var lastChildren = lastVNode.children;
					var nextChildren = nextVNode.children;

					if (lastChildrenType === 0 || isInvalidNode(lastChildren)) {
						if (nextChildrenType > 2) {
							mountArrayChildren(nextChildren, dom, lifecycle, context, instance);
						} else {
							mount(nextChildren, dom, lifecycle, context, instance);
						}
					} else if (nextChildrenType === 0 || isInvalidNode(nextChildren)) {
						if (lastChildrenType > 2) {
							removeAllChildren(dom, lastChildren);
						} else {
							remove(lastChildren, dom);
						}
					} else {
						if (lastChildren !== nextChildren) {
							if (lastChildrenType === 4 && nextChildrenType === 4) {
								patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, nextBp.isSVG, null);
							} else if (lastChildrenType === 2 && nextChildrenType === 2) {
								patch(lastChildren, nextChildren, dom, lifecycle, context, instance, true, nextBp.isSVG);
							} else if (lastChildrenType === 1 && nextChildrenType === 1) {
								patchTextNode(dom, lastChildren, nextChildren);
							} else {
								patchChildren(lastVNode, nextVNode, dom, lifecycle, context, instance, nextBp.isSVG);
							}
						}
					}
				}
			}
			if (lastBp.hasAttrs === true || nextBp.hasAttrs === true) {
				patchAttributes(lastVNode, nextVNode, lastBp.attrKeys, nextBp.attrKeys, dom, instance);
			}
			if (lastBp.hasEvents === true || nextBp.hasEvents === true) {
				patchEvents(lastVNode.events, nextVNode.events, lastBp.eventKeys, nextBp.eventKeys, dom);
			}
			if (lastBp.hasClassName === true || nextBp.hasClassName === true) {
				var nextClassName = nextVNode.className;

				if (lastVNode.className !== nextClassName) {
					if (isNullOrUndefined(nextClassName)) {
						dom.removeAttribute('class');
					} else {
						dom.className = nextClassName;
					}
				}
			}
			if (lastBp.hasStyle === true || nextBp.hasStyle === true) {
				var nextStyle = nextVNode.style;
				var lastStyle = lastVNode.style;

				if (lastStyle !== nextStyle) {
					patchStyle(lastStyle, nextStyle, dom);
				}
			}
			if (nextBp.hasHooks === true && !isNullOrUndefined(nextHooks.didUpdate)) {
				nextHooks.didUpdate(dom);
			}
			setFormElementProperties(nextTag, nextVNode);
		}
	}
}

function patchVNodeWithoutBlueprint(lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG) {
	var nextHooks = nextNode.hooks;
	var nextHooksDefined = !isNullOrUndefined(nextHooks);

	if (nextHooksDefined && !isNullOrUndefined(nextHooks.willUpdate)) {
		nextHooks.willUpdate(lastNode.dom);
	}
	var nextTag = nextNode.tag || ((isNullOrUndefined(nextNode.bp)) ? null : nextNode.bp.tag);
	var lastTag = lastNode.tag || ((isNullOrUndefined(lastNode.bp)) ? null : lastNode.bp.tag);

	if (nextTag === 'svg') {
		isSVG = true;
	}
	if (lastTag !== nextTag) {
		var lastNodeInstance = lastNode.instance;

		if (isFunction(lastTag)) {
			if (isFunction(nextTag)) {
				replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG);
			} else if (isStatefulComponent(lastTag)) {
				unmountVNode(lastNode, null, true);
				patchVNodeWithoutBlueprint(lastNodeInstance._lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG);
			} else {
				unmountVNode(lastNode, null, true);
				patchVNodeWithoutBlueprint(lastNodeInstance, nextNode, parentDom, lifecycle, context, instance, isSVG);
			}
		} else {
			replaceWithNewNode(lastNodeInstance || lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG);
		}
	} else if (isNullOrUndefined(lastTag)) {
		nextNode.dom = lastNode.dom;
	} else {
		if (isFunction(lastTag)) {
			if (isFunction(nextTag)) {
				var instance$1 = lastNode._instance;

				if (!isNullOrUndefined(instance$1) && instance$1._unmounted) {
					var newDom = mountComponent(nextNode, lastTag, nextNode.attrs || {}, nextNode.hooks, nextNode.children, instance$1, parentDom, lifecycle, context);
					if (parentDom !== null) {
						replaceNode(parentDom, newDom, lastNode.dom);
					}
				} else {
					nextNode.instance = lastNode.instance;
					nextNode.dom = lastNode.dom;
					patchComponent(false, nextNode, nextNode.tag, null, null, nextNode.instance, lastNode.attrs || {}, nextNode.attrs || {}, nextNode.hooks, lastNode.children, nextNode.children, parentDom, lifecycle, context);
				}
			}
		} else {
			var dom = lastNode.dom;
			var nextClassName = nextNode.className;
			var nextStyle = nextNode.style;

			nextNode.dom = dom;

			patchChildren(lastNode, nextNode, dom, lifecycle, context, instance, isSVG);
			patchAttributes(lastNode, nextNode, null, null, dom, instance);
			patchEvents(lastNode.events, nextNode.events, null, null, dom);

			if (lastNode.className !== nextClassName) {
				if (isNullOrUndefined(nextClassName)) {
					dom.removeAttribute('class');
				} else {
					dom.className = nextClassName;
				}
			}
			if (lastNode.style !== nextStyle) {
				patchStyle(lastNode.style, nextStyle, dom);
			}
			if (nextHooksDefined && !isNullOrUndefined(nextHooks.didUpdate)) {
				nextHooks.didUpdate(dom);
			}
			setFormElementProperties(nextTag, nextNode);
		}
	}
}

function patchAttributes(lastNode, nextNode, lastAttrKeys, nextAttrKeys, dom, instance) {
	if (lastNode.tag === 'select') {
		selectValue(nextNode);
	}
	var nextAttrs = nextNode.attrs;
	var lastAttrs = lastNode.attrs;
	var nextAttrsIsUndef = isNullOrUndefined(nextAttrs);
	var lastAttrsIsNotUndef = !isNullOrUndefined(lastAttrs);

	if (!nextAttrsIsUndef) {
		var nextAttrsKeys = nextAttrKeys || Object.keys(nextAttrs);
		var attrKeysLength = nextAttrsKeys.length;

		for (var i = 0; i < attrKeysLength; i++) {
			var attr = nextAttrsKeys[i];
			var lastAttrVal = lastAttrsIsNotUndef && lastAttrs[attr];
			var nextAttrVal = nextAttrs[attr];

			if (lastAttrVal !== nextAttrVal) {
				if (attr === 'ref') {
					patchRef(instance, lastAttrVal, nextAttrVal, dom);
				} else {
					patchAttribute(attr, lastAttrVal, nextAttrVal, dom);
				}
			}
		}
	}
	if (lastAttrsIsNotUndef) {
		var lastAttrsKeys = lastAttrKeys || Object.keys(lastAttrs);
		var attrKeysLength$1 = lastAttrsKeys.length;

		for (var i$1 = 0; i$1 < attrKeysLength$1; i$1++) {
			var attr$1 = lastAttrsKeys[i$1];

			if (nextAttrsIsUndef || isNullOrUndefined(nextAttrs[attr$1])) {
				if (attr$1 === 'ref') {
					patchRef(getRefInstance(node, instance), lastAttrs[attr$1], null, dom);
				} else {
					dom.removeAttribute(attr$1);
				}
			}
		}
	}
}


function patchStyle(lastAttrValue, nextAttrValue, dom) {
	if (isString(nextAttrValue)) {
		dom.style.cssText = nextAttrValue;
	} else if (isNullOrUndefined(lastAttrValue)) {
		if (!isNullOrUndefined(nextAttrValue)) {
			var styleKeys = Object.keys(nextAttrValue);

			for (var i = 0; i < styleKeys.length; i++) {
				var style = styleKeys[i];
				var value = nextAttrValue[style];

				if (isNumber(value) && !isUnitlessNumber[style]) {
					dom.style[style] = value + 'px';
				} else {
					dom.style[style] = value;
				}
			}
		}
	} else if (isNullOrUndefined(nextAttrValue)) {
		dom.removeAttribute('style');
	} else {
		var styleKeys$1 = Object.keys(nextAttrValue);

		for (var i$1 = 0; i$1 < styleKeys$1.length; i$1++) {
			var style$1 = styleKeys$1[i$1];
			var value$1 = nextAttrValue[style$1];

			if (isNumber(value$1) && !isUnitlessNumber[style$1]) {
				dom.style[style$1] = value$1 + 'px';
			} else {
				dom.style[style$1] = value$1;
			}
		}
		var lastStyleKeys = Object.keys(lastAttrValue);

		for (var i$2 = 0; i$2 < lastStyleKeys.length; i$2++) {
			var style$2 = lastStyleKeys[i$2];
			if (isNullOrUndefined(nextAttrValue[style$2])) {
				dom.style[style$2] = '';
			}
		}
	}
}

function patchEvents(lastEvents, nextEvents, _lastEventKeys, _nextEventKeys, dom) {
	var nextEventsDefined = !isNullOrUndefined(nextEvents);
	var lastEventsDefined = !isNullOrUndefined(lastEvents);
	var lastEventKeys;

	if (lastEventsDefined) {
		lastEventKeys = _lastEventKeys || Object.keys(lastEvents);
	}
	if (nextEventsDefined) {
		var nextEventKeys = _nextEventKeys || Object.keys(nextEvents);

		if (lastEventsDefined) {
			for (var i = 0; i < nextEventKeys.length; i++) {
				var event = nextEventKeys[i];
				var lastEvent = lastEvents[event];
				var nextEvent = nextEvents[event];

				if (lastEvent !== nextEvent) {
					dom[event] = nextEvent;
				}
			}
			for (var i$1 = 0; i$1 < lastEventKeys.length; i$1++) {
				var event$1 = lastEventKeys[i$1];

				if (isNullOrUndefined(nextEvents[event$1])) {
					dom[event$1] = null;
				}
			}
		} else {
			mountEvents(nextEvents, nextEventKeys, dom);
		}
	} else if (lastEventsDefined) {
		removeEvents(lastEvents, lastEventKeys, dom);
	}
}

function patchAttribute(attrName, lastAttrValue, nextAttrValue, dom) {
	if (attrName === 'dangerouslySetInnerHTML') {
		var lastHtml = lastAttrValue && lastAttrValue.__html;
		var nextHtml = nextAttrValue && nextAttrValue.__html;

		if (isNullOrUndefined(nextHtml)) {
			throw new Error('Inferno Error: dangerouslySetInnerHTML requires an object with a __html propety containing the innerHTML content');
		}
		if (lastHtml !== nextHtml) {
			dom.innerHTML = nextHtml;
		}
	} else if (attrName === 'eventData') {
		dom.eventData = nextAttrValue;
	} else if (strictProps[attrName]) {
		dom[attrName] = nextAttrValue === null ? '' : nextAttrValue;
	} else {
		if (booleanProps[attrName]) {
			dom[attrName] = nextAttrValue ? true : false;
		} else {
			var ns = namespaces[attrName];

			if (nextAttrValue === false || isNullOrUndefined(nextAttrValue)) {
				if (ns !== undefined) {
					dom.removeAttributeNS(ns, attrName);
				} else {
					dom.removeAttribute(attrName);
				}
			} else {
				if (ns !== undefined) {
					dom.setAttributeNS(ns, attrName, nextAttrValue === true ? attrName : nextAttrValue);
				} else {
					dom.setAttribute(attrName, nextAttrValue === true ? attrName : nextAttrValue);
				}
			}
		}
	}
}

function patchComponent(hasBlueprint, lastNode, Component, lastBp, nextBp, instance, lastProps, nextProps, nextHooks, lastChildren, nextChildren, parentDom, lifecycle, context) {
	nextProps = addChildrenToProps(nextChildren, nextProps);

	if (isStatefulComponent(Component)) {
		var prevProps = instance.props;
		var prevState = instance.state;
		var nextState = instance.state;

		var childContext = instance.getChildContext();
		if (!isNullOrUndefined(childContext)) {
			context = Object.assign({}, context, childContext);
		}
		instance.context = context;
		var nextNode = instance._updateComponent(prevState, nextState, prevProps, nextProps);

		if (nextNode === NO_RENDER) {
			nextNode = instance._lastNode;
		} else if (isNullOrUndefined(nextNode)) {
			nextNode = createVPlaceholder();
		}
		patch(instance._lastNode, nextNode, parentDom, lifecycle, context, instance, null, false);
		lastNode.dom = nextNode.dom;
		instance._lastNode = nextNode;
		instance.componentDidUpdate(prevProps, prevState);
		componentToDOMNodeMap.set(instance, nextNode.dom);
	} else {
		var shouldUpdate = true;
		var nextHooksDefined = (hasBlueprint && nextBp.hasHooks === true) || !isNullOrUndefined(nextHooks);

		lastProps = addChildrenToProps(lastChildren, lastProps);
		if (nextHooksDefined && !isNullOrUndefined(nextHooks.componentShouldUpdate)) {
			shouldUpdate = nextHooks.componentShouldUpdate(lastNode.dom, lastProps, nextProps);
		}
		if (shouldUpdate !== false) {
			if (nextHooksDefined && !isNullOrUndefined(nextHooks.componentWillUpdate)) {
				nextHooks.componentWillUpdate(lastNode.dom, lastProps, nextProps);
			}
			var nextNode$1 = Component(nextProps, context);

			if (isInvalidNode(nextNode$1)) {
				nextNode$1 = createVPlaceholder();
			}
			nextNode$1.dom = lastNode.dom;
			patch(instance, nextNode$1, parentDom, lifecycle, context, null, null, false);
			lastNode.instance = nextNode$1;
			if (nextHooksDefined && !isNullOrUndefined(nextHooks.componentDidUpdate)) {
				nextHooks.componentDidUpdate(lastNode.dom, lastProps, nextProps);
			}
		}
	}
}

function patchVList(lastVList, nextVList, parentDom, lifecycle, context, instance, isSVG) {
	var lastItems = lastVList.items;
	var nextItems = nextVList.items;
	var pointer = lastVList.pointer;

	nextVList.dom = lastVList.dom;
	nextVList.pointer = pointer;
	if (!lastItems !== nextItems) {
		if (isKeyed(lastItems, nextItems)) {
			patchKeyedChildren(lastItems, nextItems, parentDom, lifecycle, context, instance, isSVG, nextVList);
		} else {
			patchNonKeyedChildren(lastItems, nextItems, parentDom, lifecycle, context, instance, isSVG, nextVList);
		}
	}
}

function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, parentVList) {
	var lastChildrenLength = lastChildren.length;
	var nextChildrenLength = nextChildren.length;
	var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
	var i = 0;

	for (; i < commonLength; i++) {
		var lastChild = lastChildren[i];
		var nextChild = normaliseChild(nextChildren, i);

		patch(lastChild, nextChild, dom, lifecycle, context, instance, isSVG);
	}
	if (lastChildrenLength < nextChildrenLength) {
		for (i = commonLength; i < nextChildrenLength; i++) {
			var child = normaliseChild(nextChildren, i);

			insertOrAppend(dom, mount(child, null, lifecycle, context, instance, isSVG), parentVList && parentVList.pointer);
		}
	} else if (lastChildrenLength > nextChildrenLength) {
		for (i = commonLength; i < lastChildrenLength; i++) {
			remove(lastChildren[i], dom);
		}
	}
}

function patchVFragment(lastVFragment, nextVFragment) {
	nextVFragment.dom = lastVFragment.dom;
}

function patchVText(lastVText, nextVText) {
	var nextText = nextVText.text;
	var dom = lastVText.dom;

	nextVText.dom = dom;
	if (lastVText.text !== nextText) {
		dom.nodeValue = nextText;
	}
}

function patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, parentVList) {
	var lastChildrenLength = lastChildren.length;
	var nextChildrenLength = nextChildren.length;
	var lastEndIndex = lastChildrenLength - 1;
	var nextEndIndex = nextChildrenLength - 1;
	var lastStartIndex = 0;
	var nextStartIndex = 0;
	var lastStartNode = null;
	var nextStartNode = null;
	var nextEndNode = null;
	var lastEndNode = null;
	var nextNode;

	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextStartNode = nextChildren[nextStartIndex];
		lastStartNode = lastChildren[lastStartIndex];

		if (nextStartNode.key !== lastStartNode.key) {
			break;
		}
		patchVNode(lastStartNode, nextStartNode, dom, lifecycle, context, instance, isSVG, false);
		nextStartIndex++;
		lastStartIndex++;
	}
	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextEndNode = nextChildren[nextEndIndex];
		lastEndNode = lastChildren[lastEndIndex];

		if (nextEndNode.key !== lastEndNode.key) {
			break;
		}
		patchVNode(lastEndNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
		nextEndIndex--;
		lastEndIndex--;
	}
	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextEndNode = nextChildren[nextEndIndex];
		lastStartNode = lastChildren[lastStartIndex];

		if (nextEndNode.key !== lastStartNode.key) {
			break;
		}
		nextNode = (nextEndIndex + 1 < nextChildrenLength) ? nextChildren[nextEndIndex + 1].dom : null;
		patchVNode(lastStartNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
		insertOrAppend(dom, nextEndNode.dom, nextNode);
		nextEndIndex--;
		lastStartIndex++;
	}
	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextStartNode = nextChildren[nextStartIndex];
		lastEndNode = lastChildren[lastEndIndex];

		if (nextStartNode.key !== lastEndNode.key) {
			break;
		}
		nextNode = lastChildren[lastStartIndex].dom;
		patchVNode(lastEndNode, nextStartNode, dom, lifecycle, context, instance, isSVG, false);
		insertOrAppend(dom, nextStartNode.dom, nextNode);
		nextStartIndex++;
		lastEndIndex--;
	}

	if (lastStartIndex > lastEndIndex) {
		if (nextStartIndex <= nextEndIndex) {
			nextNode = (nextEndIndex + 1 < nextChildrenLength) ? nextChildren[nextEndIndex + 1].dom : parentVList && parentVList.pointer;
			for (; nextStartIndex <= nextEndIndex; nextStartIndex++) {
				insertOrAppend(dom, mount(nextChildren[nextStartIndex], null, lifecycle, context, instance, isSVG), nextNode);
			}
		}
	} else if (nextStartIndex > nextEndIndex) {
		while (lastStartIndex <= lastEndIndex) {
			remove(lastChildren[lastStartIndex++], dom);
		}
	} else {
		var aLength = lastEndIndex - lastStartIndex + 1;
		var bLength = nextEndIndex - nextStartIndex + 1;
		var sources = new Array(bLength);

		// Mark all nodes as inserted.
		var i;
		for (i = 0; i < bLength; i++) {
			sources[i] = -1;
		}
		var moved = false;
		var removeOffset = 0;
		var lastTarget = 0;
		var index;
		var removed = true;
		var k = 0;

		if ((bLength <= 4) || (aLength * bLength <= 16)) {
			for (i = lastStartIndex; i <= lastEndIndex; i++) {
				removed = true;
				lastEndNode = lastChildren[i];
				if (k < bLength) {
					for (index = nextStartIndex; index <= nextEndIndex; index++) {
						nextEndNode = nextChildren[index];
						if (lastEndNode.key === nextEndNode.key) {
							sources[index - nextStartIndex] = i;

							if (lastTarget > index) {
								moved = true;
							} else {
								lastTarget = index;
							}
							patchVNode(lastEndNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
							k++;
							removed = false;
							break;
						}
					}
				}
				if (removed) {
					remove(lastEndNode, dom);
					removeOffset++;
				}
			}
		} else {
			var prevItemsMap = new Map();

			for (i = nextStartIndex; i <= nextEndIndex; i++) {
				prevItemsMap.set(nextChildren[i].key, i);
			}
			for (i = lastStartIndex; i <= lastEndIndex; i++) {
				removed = true;
				lastEndNode = lastChildren[i];

				if (k < nextChildrenLength) {
					index = prevItemsMap.get(lastEndNode.key);

					if (index !== undefined) {
						nextEndNode = nextChildren[index];
						sources[index - nextStartIndex] = i;
						if (lastTarget > index) {
							moved = true;
						} else {
							lastTarget = index;
						}
						patchVNode(lastEndNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
						k++;
						removed = false;
					}
				}
				if (removed) {
					remove(lastEndNode, dom);
					removeOffset++;
				}
			}
		}

		var pos;
		if (moved) {
			var seq = lis_algorithm(sources);
			index = seq.length - 1;
			for (i = bLength - 1; i >= 0; i--) {
				if (sources[i] === -1) {
					pos = i + nextStartIndex;
					nextNode = (pos + 1 < nextChildrenLength) ? nextChildren[pos + 1].dom : parentVList && parentVList.pointer;
					insertOrAppend(dom, mount(nextChildren[pos], null, lifecycle, context, instance, isSVG), nextNode);
				} else {
					if (index < 0 || i !== seq[index]) {
						pos = i + nextStartIndex;
						nextNode = (pos + 1 < nextChildrenLength) ? nextChildren[pos + 1].dom : parentVList && parentVList.pointer;
						insertOrAppend(dom, nextChildren[pos].dom, nextNode);
					} else {
						index--;
					}
				}
			}
		} else if (aLength - removeOffset !== bLength) {
			for (i = bLength - 1; i >= 0; i--) {
				if (sources[i] === -1) {
					pos = i + nextStartIndex;
					nextNode = (pos + 1 < nextChildrenLength) ? nextChildren[pos + 1].dom : parentVList && parentVList.pointer;
					insertOrAppend(dom, mount(nextChildren[pos], null, lifecycle, context, instance, isSVG), nextNode);
				}
			}
		}
	}
}

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(a) {
	var p = a.slice(0);
	var result = [];
	result.push(0);
	var i;
	var j;
	var u;
	var v;
	var c;

	for (i = 0; i < a.length; i++) {
		if (a[i] === -1) {
			continue;
		}

		j = result[result.length - 1];
		if (a[j] < a[i]) {
			p[i] = j;
			result.push(i);
			continue;
		}

		u = 0;
		v = result.length - 1;

		while (u < v) {
			c = ((u + v) / 2) | 0;
			if (a[result[c]] < a[i]) {
				u = c + 1;
			} else {
				v = c;
			}
		}

		if (a[i] < a[result[u]]) {
			if (u > 0) {
				p[i] = result[u - 1];
			}
			result[u] = i;
		}
	}

	u = result.length;
	v = result[u - 1];

	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}

	return result;
}

var screenWidth = isBrowser && window.screen.width;
var screenHeight = isBrowser && window.screen.height;
var scrollX = 0;
var scrollY = 0;
var lastScrollTime = 0;

if (isBrowser) {
	window.onscroll = function () {
		scrollX = window.scrollX;
		scrollY = window.scrollY;
		lastScrollTime = performance.now();
	};

	window.resize = function () {
		scrollX = window.scrollX;
		scrollY = window.scrollY;
		screenWidth = window.screen.width;
		screenHeight = window.screen.height;
		lastScrollTime = performance.now();
	};
}

function Lifecycle() {
	this._listeners = [];
	this.scrollX = null;
	this.scrollY = null;
	this.screenHeight = screenHeight;
	this.screenWidth = screenWidth;
}

Lifecycle.prototype = {
	refresh: function refresh() {
		this.scrollX = isBrowser && window.scrollX;
		this.scrollY = isBrowser && window.scrollY;
	},
	addListener: function addListener(callback) {
		this._listeners.push(callback);
	},
	trigger: function trigger() {
		var this$1 = this;

		for (var i = 0; i < this._listeners.length; i++) {
			this$1._listeners[i]();
		}
	}
};

function handleLazyAttached(node, lifecycle, dom) {
	lifecycle.addListener(function () {
		var rect = dom.getBoundingClientRect();

		if (lifecycle.scrollY === null) {
			lifecycle.refresh();
		}
		node.clipData = {
			top: rect.top + lifecycle.scrollY,
			left: rect.left + lifecycle.scrollX,
			bottom: rect.bottom + lifecycle.scrollY,
			right: rect.right + lifecycle.scrollX,
			pending: false
		};
	});
}

function hydrateChild(child, childNodes, counter, parentDom, lifecycle, context, instance) {
	var domNode = childNodes[counter.i];

	if (isVText(child)) {
		var text = child.text;

		child.dom = domNode;
		if (domNode.nodeType === 3 && text !== '') {
			domNode.nodeValue = text;
		} else {
			var newDomNode = mountVText(text);

			replaceNode(parentDom, newDomNode, domNode);
			childNodes.splice(childNodes.indexOf(domNode), 1, newDomNode);
			child.dom = newDomNode;
		}
	} else if (isVPlaceholder(child)) {
		child.dom = domNode;
	} else if (isVList(child)) {
		var items = child.items;

		// this doesn't really matter, as it won't be used again, but it's what it should be given the purpose of VList
		child.dom = document.createDocumentFragment();
		for (var i = 0; i < items.length; i++) {
			var rebuild = hydrateChild(normaliseChild(items, i), childNodes, counter, parentDom, lifecycle, context, instance);

			if (rebuild) {
				return true;
			}
		}
		// at the end of every VList, there should be a "pointer". It's an empty TextNode used for tracking the VList
		var pointer = childNodes[counter.i++];

		if (pointer && pointer.nodeType === 3) {
			child.pointer = pointer;
		} else {
			// there is a problem, we need to rebuild this tree
			return true;
		}
	} else {
		var rebuild$1 = hydrateNode(child, domNode, parentDom, lifecycle, context, instance, false);

		if (rebuild$1) {
			return true;
		}
	}
	counter.i++;
}

function getChildNodesWithoutComments(domNode) {
	var childNodes = [];
	var rawChildNodes = domNode.childNodes;
	var length = rawChildNodes.length;
	var i = 0;

	while (i < length) {
		var rawChild = rawChildNodes[i];

		if (rawChild.nodeType === 8) {
			if (rawChild.data === '!') {
				var placeholder = document.createTextNode('');

				domNode.replaceChild(placeholder, rawChild);
				childNodes.push(placeholder);
				i++;
			} else {
				domNode.removeChild(rawChild);
				length--;
			}
		} else {
			childNodes.push(rawChild);
			i++;
		}
	}
	return childNodes;
}

function hydrateComponent(node, Component, props, hooks, children, domNode, parentDom, lifecycle, context, lastInstance, isRoot) {
	props = addChildrenToProps(children, props);

	if (isStatefulComponent(Component)) {
		var instance = node.instance = new Component(props);

		instance._patch = patch;
		if (!isNullOrUndefined(lastInstance) && props.ref) {
			mountRef(lastInstance, props.ref, instance);
		}
		var childContext = instance.getChildContext();

		if (!isNullOrUndefined(childContext)) {
			context = Object.assign({}, context, childContext);
		}
		instance.context = context;
		instance._unmounted = false;
		instance._parentNode = node;
		if (lastInstance) {
			instance._parentComponent = lastInstance;
		}
		instance._pendingSetState = true;
		instance.componentWillMount();
		var nextNode = instance.render();

		instance._pendingSetState = false;
		if (isInvalidNode(nextNode)) {
			nextNode = createVPlaceholder();
		}
		hydrateNode(nextNode, domNode, parentDom, lifecycle, context, instance, isRoot);
		instance._lastNode = nextNode;
		instance.componentDidMount();

	} else {
		var instance$1 = node.instance = Component(props);

		if (!isNullOrUndefined(hooks)) {
			if (!isNullOrUndefined(hooks.componentWillMount)) {
				hooks.componentWillMount(null, props);
			}
			if (!isNullOrUndefined(hooks.componentDidMount)) {
				lifecycle.addListener(function () {
					hooks.componentDidMount(domNode, props);
				});
			}
		}
		return hydrateNode(instance$1, domNode, parentDom, lifecycle, context, instance$1, isRoot);
	}
}

function hydrateNode(node, domNode, parentDom, lifecycle, context, instance, isRoot) {
	var bp = node.bp;
	var tag = node.tag || bp.tag;

	if (isFunction(tag)) {
		node.dom = domNode;
		hydrateComponent(node, tag, node.attrs || {}, node.hooks, node.children, domNode, parentDom, lifecycle, context, instance, isRoot);
	} else {
		if (
			domNode.nodeType !== 1 ||
			tag !== domNode.tagName.toLowerCase()
		) {
			// TODO remake node
		} else {
			node.dom = domNode;
			var hooks = node.hooks;

			if ((bp && bp.hasHooks === true) || !isNullOrUndefined(hooks)) {
				handleAttachedHooks(hooks, lifecycle, domNode);
			}
			var children = node.children;

			if (!isNullOrUndefined(children)) {
				if (isStringOrNumber(children)) {
					if (domNode.textContent !== children) {
						domNode.textContent = children;
					}
				} else {
					var childNodes = getChildNodesWithoutComments(domNode);
					var counter = { i: 0 };
					var rebuild = false;

					if (isArray(children)) {
						for (var i = 0; i < children.length; i++) {
							rebuild = hydrateChild(normaliseChild(children, i), childNodes, counter, domNode, lifecycle, context, instance);

							if (rebuild) {
								break;
							}
						}
					} else {
						if (childNodes.length === 1) {
							rebuild = hydrateChild(children, childNodes, counter, domNode, lifecycle, context, instance);
						} else {
							rebuild = true;
						}
					}

					if (rebuild) {
						// TODO scrap children and rebuild again
					}
				}
			}
			var className = node.className;
			var style = node.style;

			if (!isNullOrUndefined(className)) {
				domNode.className = className;
			}
			if (!isNullOrUndefined(style)) {
				patchStyle(null, style, domNode);
			}
			if (bp && bp.hasAttrs === true) {
				mountBlueprintAttrs(node, bp, domNode, instance);
			} else {
				var attrs = node.attrs;

				if (!isNullOrUndefined(attrs)) {
					handleSelects(node);
					mountAttributes(node, attrs, Object.keys(attrs), domNode, instance);
				}
			}
			if (bp && bp.hasEvents === true) {
				mountBlueprintEvents(node, bp, domNode);
			} else {
				var events = node.events;

				if (!isNullOrUndefined(events)) {
					mountEvents(events, Object.keys(events), domNode);
				}
			}
		}
	}
}
var documetBody = isBrowser ? document.body : null;

function hydrate(node, parentDom, lifecycle) {
	if (parentDom && parentDom.nodeType === 1) {
		var rootNode = parentDom.querySelector('[data-infernoroot]');

		if (rootNode && rootNode.parentNode === parentDom) {
			hydrateNode(node, rootNode, parentDom, lifecycle, {}, true);
			return true;
		}
	}
	// clear parentDom, unless it's document.body
	if (parentDom !== documetBody) {
		parentDom.textContent = '';
	} else {
		console.warn('Inferno Warning: rendering to the "document.body" is dangerous! Use a dedicated container element instead.');
	}
	return false;
}

var roots = new Map();
var componentToDOMNodeMap = new Map();

function findDOMNode(domNode) {
	return componentToDOMNodeMap.get(domNode) || null;
}

function render(input, parentDom) {
	var root = roots.get(parentDom);
	var lifecycle = new Lifecycle();

	if (isUndefined(root)) {
		if (!isInvalidNode(input)) {
			if (!hydrate(input, parentDom, lifecycle)) {
				mount(input, parentDom, lifecycle, {}, null, false);
			}
			lifecycle.trigger();
			roots.set(parentDom, { input: input });
		}
	} else {
		var activeNode = getActiveNode();
		var nextInput = patch(root.input, input, parentDom, lifecycle, {}, null, false);

		lifecycle.trigger();
		if (isNull(input)) {
			roots.delete(parentDom);
		}
		root.input = nextInput;
		resetActiveNode(activeNode);
	}
}

var index = {
	render: render,
	findDOMNode: findDOMNode,
	mount: mount,
	patch: patch,
	unmount: unmount
};

return index;

})));
});

var infernoDom = infernoDom$1;

__$styleInject("html,\nbody {\n    margin: 0;\n    padding: 0;\n    height: 100%;\n}\nbody {\n    min-width: 30em;\n}\nbody > div {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    margin: 0;\n    padding: 0;\n    height: 100%;\n}\n.container {\n    margin: 0 auto;\n    max-width: 60em;\n    width: 100%;\n}\n.representation {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    -ms-flex-direction: column;\n            -webkit-box-orient: vertical;\n            -webkit-box-direction: normal;\n        flex-direction: column;\n}\n.representation .waiting {\n    background-color: #00B6F0;\n    background-image: url('/static/img/loader.gif');\n    background-position: 50% 40%;\n    background-size: auto;\n    background-repeat: no-repeat;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    position: relative;\n}\n.representation .waiting.error {\n    background-image: url('/static/img/warning.png');\n}\n.representation .waiting .message {\n    position: absolute;\n    top: 60%;\n    width: 100%;\n}\n.representation .waiting .message p {\n    color: #fff;\n    font-family: 'Roboto';\n    font-size: 1.8em;\n    letter-spacing: 1px;\n    line-height: 1.4;\n    text-align: center;\n}\n.representation .waiting .message p a {\n    text-decoration: underline;\n}\nheader {\n    background-color: #192854;\n}\nheader .container {\n    background-image: url('/static/img/dius_logo.png');\n    background-position: 0 50%;\n    background-size: 180px;\n    background-repeat: no-repeat;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    height: 5em;\n    margin: 0.5em auto;\n}\nheader span {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    color: #fff;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    font-family: 'Roboto';\n    font-size: 1.5em;\n    letter-spacing: 1px;\n    margin-left: 8em;\n    text-transform: uppercase;\n}\nheader .device-actions {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    position: relative;\n}\nheader .device-actions button {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    background-color: #21366C;\n    background-image: url('/static/img/power.png');\n    background-position: 1em 50%;\n    background-repeat: no-repeat;\n    background-size: 28px;\n    border: 1px solid #A3A9AC;\n    border-radius: 0.25em;\n    color: #fff;\n    font-size: 1.125em;\n    padding: 0.875em 3.5em;\n    position: relative;\n}\nheader .device-actions button::after {\n    border-color: #fff transparent transparent transparent;\n    border-style: solid;\n    border-width: 5px 5px 0 5px;\n    content: '\\A';\n    height: 0;\n    position: absolute;\n    right: 10%;\n    top: 50%;\n    width: 0;\n}\nheader .device-actions .dropdown-device-actions {\n    background-color: #fff;\n    border-radius: 0.25em;\n    box-shadow: 0 0 5px 1px #192854;\n    display: none;\n    position: absolute;\n    right: 0;\n    top: 85%;\n    z-index: 100;\n}\nheader .device-actions .dropdown-device-actions li a {\n    border-radius: 0.25em;\n    display: block;\n    padding: 0.75em 1.5em;\n}\nheader .device-actions .dropdown-device-actions li a:hover {\n    background-color: #CBCFD1;\n}\nheader .device-actions .dropdown-device-actions li.separator div {\n    border: 0.03125em solid #CBCFD1;\n    margin: 0.75em 1.5em;\n}\nheader .device-actions:hover button {\n    background-color: #314B84;\n}\nheader .device-actions:hover button::after {\n    border-color: transparent transparent #fff transparent;\n    border-width: 0 5px 5px 5px;\n}\nheader .device-actions:hover .dropdown-device-actions {\n    display: block;\n}\nfooter {\n    background: #A3A9AC;\n    font-size: 0.75em;\n    padding: 0.625em;\n    text-align: center;\n}\nfooter div {\n    padding: 0.5em 0;\n}\nfooter div a {\n    text-decoration: underline;\n}\n", undefined);

var inferno$1 = createCommonjsModule(function (module, exports) {
/*!
 * inferno v0.7.27
 * (c) 2016 Dominic Gannaway
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Inferno = factory());
}(commonjsGlobal, (function () { 'use strict';

// Runs only once in applications lifetime
var isBrowser = typeof window !== 'undefined' && window.document;

function isNullOrUndefined(obj) {
	return isUndefined(obj) || isNull(obj);
}

function isAttrAnEvent$1(attr) {
	return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

function isNull(obj) {
	return obj === null;
}

function isUndefined(obj) {
	return obj === undefined;
}

function VNode(blueprint) {
	this.bp = blueprint;
	this.dom = null;
	this.instance = null;
	this.tag = null;
	this.children = null;
	this.style = null;
	this.className = null;
	this.attrs = null;
	this.events = null;
	this.hooks = null;
	this.key = null;
	this.clipData = null;
}

VNode.prototype = {
	setAttrs: function setAttrs(attrs) {
		this.attrs = attrs;
		return this;
	},
	setTag: function setTag(tag) {
		this.tag = tag;
		return this;
	},
	setStyle: function setStyle(style) {
		this.style = style;
		return this;
	},
	setClassName: function setClassName(className) {
		this.className = className;
		return this;
	},
	setChildren: function setChildren(children) {
		this.children = children;
		return this;
	},
	setHooks: function setHooks(hooks) {
		this.hooks = hooks;
		return this;
	},
	setEvents: function setEvents(events) {
		this.events = events;
		return this;
	},
	setKey: function setKey(key) {
		this.key = key;
		return this;
	}
};

function createVNode(bp) {
	return new VNode(bp);
}

function isAttrAnEvent(attr) {
	return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

function isAttrAHook(hook) {
	return hook === 'onCreated'
		|| hook === 'onAttached'
		|| hook === 'onWillDetach'
		|| hook === 'onWillUpdate'
		|| hook === 'onDidUpdate';
}

function isAttrAComponentHook(hook) {
	return hook === 'onComponentWillMount'
		|| hook === 'onComponentDidMount'
		|| hook === 'onComponentWillUnmount'
		|| hook === 'onComponentShouldUpdate'
		|| hook === 'onComponentWillUpdate'
		|| hook === 'onComponentDidUpdate';
}


function createBlueprint(shape, childrenType) {
	var tag = shape.tag || null;
	var tagIsDynamic = tag && tag.arg !== undefined ? true : false;

	var children = isNullOrUndefined(shape.children) ? null : shape.children;
	var childrenIsDynamic = children && children.arg !== undefined ? true : false;

	var attrs = shape.attrs || null;
	var attrsIsDynamic = attrs && attrs.arg !== undefined ? true : false;

	var hooks = shape.hooks || null;
	var hooksIsDynamic = hooks && hooks.arg !== undefined ? true : false;

	var events = shape.events || null;
	var eventsIsDynamic = events && events.arg !== undefined ? true : false;

	var key = shape.key === undefined ? null : shape.key;
	var keyIsDynamic = !isNullOrUndefined(key) && !isNullOrUndefined(key.arg);

	var style = shape.style || null;
	var styleIsDynamic = style && style.arg !== undefined ? true : false;

	var className = shape.className === undefined ? null : shape.className;
	var classNameIsDynamic = className && className.arg !== undefined ? true : false;

	var spread = shape.spread === undefined ? null : shape.spread;
	var hasSpread = shape.spread !== undefined;

	var blueprint = {
		lazy: shape.lazy || false,
		dom: null,
		pool: [],
		tag: tagIsDynamic ? null : tag,
		className: className !== '' && className ? className : null,
		style: style !== '' && style ? style : null,
		isComponent: tagIsDynamic,
		hasAttrs: attrsIsDynamic || (attrs ? true : false),
		hasHooks: hooksIsDynamic,
		hasEvents: eventsIsDynamic,
		hasStyle: styleIsDynamic || (style !== '' && style ? true : false),
		hasClassName: classNameIsDynamic || (className !== '' && className ? true : false),
		childrenType: childrenType === undefined ? (children ? 5 : 0) : childrenType,
		attrKeys: null,
		eventKeys: null,
		isSVG: shape.isSVG || false
	};

	return function () {
		var vNode = new VNode(blueprint);

		if (tagIsDynamic === true) {
			vNode.tag = arguments[tag.arg];
		}
		if (childrenIsDynamic === true) {
			vNode.children = arguments[children.arg];
		}
		if (hasSpread) {
			var _spread = arguments[spread.arg];
			var attrs$1;
			var events$1;
			var hooks$1;
			var attrKeys = [];
			var eventKeys = [];

			for (var prop in _spread) {
				var value = _spread[prop];

				if (prop === 'className' || (prop === 'class' && !blueprint.isSVG)) {
					vNode.className = value;
					blueprint.hasClassName = true;
				} else if (prop === 'style') {
					vNode.style = value;
					blueprint.hasStyle = true;
				} else if (prop === 'key') {
					vNode.key = value;
				} else if (isAttrAHook(prop) || isAttrAComponentHook(prop)) {
					if (!hooks$1) {
						hooks$1 = {};
					}
					hooks$1[prop[2].toLowerCase() + prop.substring(3)] = value;
				} else if (isAttrAnEvent(prop)) {
					if (!events$1) {
						events$1 = {};
					}
					eventKeys.push(prop.toLowerCase());
					events$1[prop.toLowerCase()] = value;
				} else if (prop === 'children') {
					vNode.children = value;
					blueprint.childrenType = blueprint.childrenType || 5;
				} else {
					if (!attrs$1) {
						attrs$1 = {};
					}
					attrKeys.push(prop);
					attrs$1[prop] = value;
				}
			}
			if (attrs$1) {
				vNode.attrs = attrs$1;
				blueprint.attrKeys = attrKeys;
				blueprint.hasAttrs = true;
			}
			if (events$1) {
				vNode.events = events$1;
				blueprint.eventKeys = eventKeys;
				blueprint.hasEvents = true;
			}
			if (hooks$1) {
				vNode.hooks = hooks$1;
				blueprint.hasHooks = true;
			}
		} else {
			if (attrsIsDynamic === true) {
				vNode.attrs = arguments[attrs.arg];
			} else {
				vNode.attrs = attrs;
			}
			if (hooksIsDynamic === true) {
				vNode.hooks = arguments[hooks.arg];
			}
			if (eventsIsDynamic === true) {
				vNode.events = arguments[events.arg];
			}
			if (keyIsDynamic === true) {
				vNode.key = arguments[key.arg];
			} else {
				vNode.key = key;
			}
			if (styleIsDynamic === true) {
				vNode.style = arguments[style.arg];
			} else {
				vNode.style = blueprint.style;
			}
			if (classNameIsDynamic === true) {
				vNode.className = arguments[className.arg];
			} else {
				vNode.className = blueprint.className;
			}
		}
		return vNode;
	};
}

function VText(text) {
	this.text = text;
	this.dom = null;
}

function createVText(text) {
	return new VText(text);
}

// Copy of the util from dom/util, otherwise it makes massive bundles
function documentCreateElement(tag, isSVG) {
	var dom;

	if (isSVG === true) {
		dom = document.createElementNS('http://www.w3.org/2000/svg', tag);
	} else {
		dom = document.createElement(tag);
	}
	return dom;
}

function createUniversalElement(tag, attrs, isSVG) {
	if (isBrowser) {
		var dom = documentCreateElement(tag, isSVG);
		if (attrs) {
			createStaticAttributes(attrs, dom);
		}
		return dom;
	}
	return null;
}

function createStaticAttributes(attrs, dom) {
	var attrKeys = Object.keys(attrs);

	for (var i = 0; i < attrKeys.length; i++) {
		var attr = attrKeys[i];
		var value = attrs[attr];

		if (attr === 'className') {
			dom.className = value;
		} else {
			if (value === true) {
				dom.setAttribute(attr, attr);
			} else if (!isNullOrUndefined(value) && value !== false && !isAttrAnEvent$1(attr)) {
				dom.setAttribute(attr, value);
			}
		}
	}
}

var index = {
	createBlueprint: createBlueprint,
	createVNode: createVNode,
	createVText: createVText,
	universal: {
		createElement: createUniversalElement
	}
};

return index;

})));
});

var inferno = inferno$1;

__$styleInject(".tab {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    min-width: 100%;\n}\n.tab .tab-nav-container {\n    border-bottom: 1px solid #A3A9AC;\n}\n.tab .tab-nav-container ul {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    list-style: none;\n}\n.tab .tab-nav-container ul li {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    border-bottom: 4px solid transparent;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    margin-top: 4px;\n}\n.tab .tab-nav-container ul li a {\n    color: #666;\n    display: block;\n    font-family: 'Roboto', sans-serif;\n    letter-spacing: 2px;\n    padding: 1em 0;\n    text-align: center;\n    text-transform: uppercase;\n}\n.tab .tab-nav-container ul li.selected,\n                .tab .tab-nav-container ul li:hover {\n    border-bottom-color: #192854;\n}\n.tab .tab-nav-container ul li.selected a, .tab .tab-nav-container ul li:hover a {\n    color: #192854;\n}\n.tab .tab-nav-container ul li.selected a {\n    font-weight: bold;\n}\n.tab .tab-content {\n    padding: 1.5em 0;\n}\n.tab .tab-content .tab-content-container {\n    display: block;\n}\n.tab .tab-content .tab-content-container.hidden {\n    display: none;\n}\n", undefined);

__$styleInject(".alert {\n    border-radius: 0.1875em;\n    color: #f5f5f5;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    margin-bottom: 1.5em;\n    padding: 1em;\n    -webkit-transition: 0.3s;\n    transition: 0.3s;\n}\n.alert.collapse {\n    padding: 0;\n    margin: 0;\n    visibility: collapse;\n}\n.alert.collapse span,\n        .alert.collapse a {\n    display: none;\n}\n.alert.success {\n    background-color: #8A9939;\n}\n.alert.error {\n    background-color: #C12834;\n}\n.alert span {\n    -ms-flex: 0.9;\n            -webkit-box-flex: 0.9;\n        flex: 0.9;\n}\n.alert span a {\n    font-size: 1em;\n    font-weight: normal;\n    text-decoration: underline;\n}\n.alert a {\n    -ms-flex-item-align: end;\n        align-self: flex-end;\n    color: #f5f5f5;\n    -ms-flex: 0.1;\n            -webkit-box-flex: 0.1;\n        flex: 0.1;\n    font-size: 1.2em;\n    font-weight: bold;\n    right: 1em;\n    text-align: right;\n    -webkit-transition: none;\n    transition: none;\n}\n", undefined);

var bp0$2 = inferno.createBlueprint({
  tag: 'div'
});
var bp3$1 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp2$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp1$2 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var Alert = function Alert(model) {
  var content = bp0$2();

  var className = model.success ? 'alert success' : 'alert error';

  content = bp1$2(className, [bp2$2(model.message), bp3$1({
    href: '#'
  }, {
    onclick: model.dismissHandler
  }, '\xD7')]);

  return content;
};

var bp1$3 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp0$3 = inferno.createBlueprint({
  tag: 'li',
  className: {
    arg: 0
  },
  attrs: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var TabItem = function TabItem(tabInfo) {
  var selectedClass = tabInfo.active ? 'selected' : '';

  return bp0$3(selectedClass, {
    role: 'presentation'
  }, bp1$3({
    href: '#',
    'aria-controls': tabInfo.name,
    role: 'tab',
    'data-toggle': 'tab'
  }, {
    onclick: function onclick() {
      return switchToTab(tabInfo.name);
    }
  }, tabInfo.name));
};

__$styleInject("form {\n    letter-spacing: 0.03125em;\n}\nform h2 {\n    border-bottom: 1px solid #CBCFD1;\n    font-size: 1.25em;\n    margin: 0.4375em 0;\n    padding: 0.4375em 0;\n}\nform .form-container {\n    background-color: #EEEFF0;\n    border-radius: 0.1875em;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    margin-bottom: 0.25em;\n    padding: 2em 4em;\n}\nform .form-container.vertical {\n    -ms-flex-direction: column;\n            -webkit-box-orient: vertical;\n            -webkit-box-direction: normal;\n        flex-direction: column;\n}\nform .form-container.vertical label {\n    margin: 0.5em 0;\n}\nform .form-container .fieldset {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n}\nform .form-container .fieldset label {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    margin: 0;\n}\nform .form-container .fieldset.hidden {\n    height: 0;\n    opacity: 0;\n    overflow: hidden;\n    width: 0;\n}\nform .form-container label {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n}\nform .form-container label span {\n    font-weight: bold;\n}\nform .form-container input,\n        form .form-container select {\n    border: 1px solid #ccc;\n    box-sizing: border-box;\n    color: #333;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    padding: 0.625em;\n    margin: 0.3125em 0;\n}\nform .form-container input:focus, form .form-container select:focus {\n    border-color: #00B6F0;\n}\nform .form-container .full-length {\n    min-width: 100%;\n}\nform .form-container input[type=\"checkbox\"],\n        form .form-container input[type=\"radio\"] {\n    -ms-flex-item-align: start;\n        align-self: flex-start;\n    border: none;\n    cursor: pointer;\n    -ms-flex-positive: 0.1;\n            -webkit-box-flex: 0.1;\n        flex-grow: 0.1;\n    padding: 0;\n}\nform .form-container input[type=\"checkbox\"] + label, form .form-container input[type=\"radio\"] + label {\n    cursor: pointer;\n}\nform .form-container input[type=\"checkbox\"]:not(old), form .form-container input[type=\"radio\"]:not(old) {\n    font-size: 1em;\n    margin: 0;\n    opacity: 0;\n    width: 2em;\n}\nform .form-container input[type=\"checkbox\"]:not(old) + label, form .form-container input[type=\"radio\"]:not(old) + label {\n    display: inline-block;\n    margin-left: -2em;\n    line-height: 1.5em;\n}\nform .form-container input[type=\"checkbox\"]:not(old) + label > span, form .form-container input[type=\"radio\"]:not(old) + label > span {\n    background: transparent;\n    border: 0.125em solid #838688;\n    border-radius: 0.25em;\n    display: inline-block;\n    height: 0.875em;\n    margin: 0.25em 0.5em 0.25em 0.25em;\n    vertical-align: bottom;\n    width: 0.875em;\n}\nform .form-container input[type=\"checkbox\"]:not(old):checked + label > span, form .form-container input[type=\"radio\"]:not(old):checked + label > span {\n    border-color: #00B6F0;\n}\nform .form-container input[type=\"checkbox\"]:not(old):checked + label > span::before, form .form-container input[type=\"radio\"]:not(old):checked + label > span::before {\n    color: #00B6F0;\n    display: block;\n    font-size: 0.875em;\n    font-weight: bold;\n    line-height: 1em;\n    text-align: center;\n    width: 1em;\n}\nform .form-container input[type=\"checkbox\"]:not(old):checked + label > span > span, form .form-container input[type=\"radio\"]:not(old):checked + label > span > span {\n    background-color: #00B6F0;\n    border: 0.0625em solid #00B6F0;\n    display: block;\n    height: 0.5em;\n    margin: 0.125em;\n    width: 0.5em;\n}\nform .form-container input[type=\"radio\"]:not(old) + label > span {\n    border-radius: 1em;\n}\nform .form-container input[type=\"radio\"]:not(old):checked + label > span > span {\n    border-radius: 1em;\n}\nform .form-container .controls {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n}\nform .wireless-connection,\n    form .static-configuration {\n    -webkit-transition: 0.2s;\n    transition: 0.2s;\n}\nform .wireless-connection .fieldset, form .static-configuration .fieldset {\n    margin: 0.5em 0;\n}\nform .wireless-connection label, form .static-configuration label {\n    text-align: right;\n}\nform .wireless-connection label.checkbox, form .static-configuration label.checkbox {\n    cursor: pointer;\n    margin-left: 50%;\n}\nform .wireless-connection input[type=\"text\"],\n        form .wireless-connection input[type=\"password\"],\n        form .static-configuration input[type=\"text\"],\n        form .static-configuration input[type=\"password\"] {\n    margin-left: 1em;\n}\nform .wireless-connection.shown, form .static-configuration.shown {\n    height: auto;\n    opacity: 1;\n    overflow: auto;\n    width: auto;\n}\nform .wireless-connection.hidden, form .static-configuration.hidden {\n    height: 0;\n    opacity: 0;\n    overflow: hidden;\n    width: 0;\n}\nform .actions {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    -ms-flex-align: center;\n            -webkit-box-align: center;\n        align-items: center;\n    margin-top: 1em;\n}\nform .actions button {\n    -ms-flex: 0.1;\n            -webkit-box-flex: 0.1;\n        flex: 0.1;\n}\nform .actions small {\n    color: #838688;\n    -ms-flex: 0.9;\n            -webkit-box-flex: 0.9;\n        flex: 0.9;\n    text-align: right;\n}\nform button {\n    background-color: #00B6F0;\n    border-radius: 0.1875em;\n    color: #fff;\n    font-size: 1.285em;\n    font-weight: bold;\n    line-height: 1;\n    padding: 1em 3em;\n    text-transform: capitalize;\n}\nform button:hover {\n    background-color: #5894CE;\n}\nform button.small {\n    font-size: 80%;\n    margin: 0.5em 0;\n}\nform button.secondary {\n    background-color: #A2B842;\n}\nform button.secondary:hover {\n    background-color: #8A9939;\n}\nform button.danger {\n    background-color: #A41E22;\n}\nform button.danger:hover {\n    background-color: #76141B;\n}\n", undefined);

var transformFormIntoPayload = function transformFormIntoPayload(formElements, payload) {
  for (var i = 0; i < formElements.length; i++) {
    var formEl = formElements[i];
    var alreadyContainsEl = false;

    if (formEl.type === 'radio' && formEl.checked) {
      payload[formEl.name] = formElements[formEl.name].value;
    }

    if (formEl.type !== 'radio') {
      if (typeof payload[formEl.name] !== 'undefined' && !Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true;

        var originalValue = payload[formEl.name];
        delete payload[formEl.name];

        payload[formEl.name] = [];
        payload[formEl.name].push(originalValue);
      }

      if (Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true;
      }

      var value = formEl.type === 'checkbox' ? formEl.checked : formEl.value;
      if (formEl.name) {
        if (alreadyContainsEl) {
          payload[formEl.name].push(value);
        } else {
          payload[formEl.name] = value;
        }
      }
    }
  }
};

var bp3$2 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp2$3 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp1$4 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciAddress'
  },
  children: {
    arg: 0
  }
});
var bp0$5 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp6 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp5 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciUsername'
  },
  children: {
    arg: 0
  }
});
var bp4$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp9 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp8 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciPassword'
  },
  children: {
    arg: 0
  }
});
var bp7 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp12 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp11 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciApiToken'
  },
  children: {
    arg: 0
  }
});
var bp10 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp25 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp24 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp23 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp22 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'travisci'
  },
  children: {
    arg: 0
  }
});
var bp21 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'jenkins'
  },
  children: {
    arg: 0
  }
});
var bp20 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'circleci'
  },
  children: {
    arg: 0
  }
});
var bp19 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'buildkite'
  },
  children: {
    arg: 0
  }
});
var bp18 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'bamboo'
  },
  children: {
    arg: 0
  }
});
var bp17 = inferno.createBlueprint({
  tag: 'select',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp16 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp15 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciTool'
  },
  children: {
    arg: 0
  }
});
var bp14 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp13 = inferno.createBlueprint({
  tag: 'form',
  events: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var CiTabContent = function CiTabContent(model) {
  var handleCiToolChange = function handleCiToolChange(event) {
    selectCiTool(event.currentTarget.value);
  };

  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'ci', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  var isToolOneOf = function isToolOneOf(tools) {
    return tools.indexOf(model.configuration.tool) > -1;
  };

  var address = isToolOneOf(['bamboo', 'jenkins']) ? bp0$5([bp1$4(['Address of the ', bp2$3('CI server you want to connect to')]), bp3$2({
    type: 'text',
    id: 'ciAddress',
    placeholder: 'http://myci.mycompany',
    name: 'ciAddress',
    value: model.configuration.address
  })]) : '';

  var usernameLabels = {
    'bamboo': 'User (Optional)',
    'buildkite': 'Organization Slug',
    'circleci': 'Team Name',
    'travisci': 'Account'
  };
  var username = isToolOneOf(['bamboo', 'buildkite', 'circleci', 'travisci']) ? bp4$1([bp5(usernameLabels[model.configuration.tool]), bp6({
    type: 'text',
    id: 'ciUsername',
    name: 'ciUsername',
    value: model.configuration.username
  })]) : '';

  var password = isToolOneOf(['bamboo']) ? bp7([bp8('Password (Optional)'), bp9({
    type: 'password',
    id: 'ciPassword',
    placeholder: '',
    name: 'ciPassword',
    value: model.configuration.password
  })]) : '';

  var apiToken = isToolOneOf(['buildkite', 'circleci']) ? bp10([bp11('API token'), bp12({
    type: 'text',
    id: 'ciApiToken',
    placeholder: '',
    name: 'ciApiToken',
    value: model.configuration.apiToken
  })]) : '';

  return bp13({
    onsubmit: handleFormSubmit
  }, [bp14('form-container vertical ' + model.configuration.tool, [bp15([bp16('CI tool'), ' you are using']), bp17({
    required: true,
    id: 'ciTool',
    name: 'ciTool',
    value: model.configuration.tool
  }, {
    onchange: handleCiToolChange
  }, [bp18('Bamboo'), bp19('Buildkite'), bp20('Circle CI'), bp21('Jenkins'), bp22('Travis CI')]), address, username, password, apiToken]), bp23([bp24('Save'), bp25(['Last updated: ', model.lastUpdated])])]);
};

__$styleInject("form .jobs-container > button {\n    -ms-flex-item-align: end;\n        align-self: flex-end;\n    background-color: #A2B842;\n    margin-right: 0.5em;\n}\nform .jobs-container .fieldset {\n    padding: 0.25em 0.5em;\n}\nform .jobs-container .fieldset:hover {\n    background-color: #fff;\n}\nform .jobs-container .fieldset:hover label {\n    font-weight: bold;\n}\nform .jobs-container .fieldset input,\n            form .jobs-container .fieldset label {\n    -ms-flex: initial;\n            -webkit-box-flex: initial;\n        flex: initial;\n    -ms-flex-positive: initial;\n        flex-grow: initial;\n}\nform .jobs-container .fieldset input[type=\"text\"], form .jobs-container .fieldset label[type=\"text\"] {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    margin-right: 1em;\n}\n", undefined);

var bp6$2 = inferno.createBlueprint({
  tag: 'button',
  className: 'small danger',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp5$2 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp4$3 = inferno.createBlueprint({
  tag: 'span'
});
var bp3$4 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$5 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp1$6 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp0$7 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var Job = function Job(props) {
  var handleRemoveJob = function handleRemoveJob(e) {
    removeJob(props.index);
  };

  return bp0$7([bp1$6({
    type: 'checkbox',
    name: 'jobActive',
    id: 'jobActive_' + props.index,
    checked: props.active,
    value: 'jobActive_' + props.index
  }), bp2$5({
    for: 'jobActive_' + props.index
  }, [bp3$4(bp4$3()), '\xA0']), bp5$2({
    type: 'text',
    name: 'jobName',
    id: 'jobName_' + props.index,
    value: props.name
  }), bp6$2({
    type: 'button'
  }, {
    onclick: handleRemoveJob
  }, 'Remove')]);
};

var bp0$6 = inferno.createBlueprint({
  tag: {
    arg: 0
  },
  attrs: {
    arg: 1
  }
});
var bp12$1 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp11$1 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp10$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp9$1 = inferno.createBlueprint({
  tag: 'button',
  className: 'small secondary',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp8$1 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp7$1 = inferno.createBlueprint({
  tag: 'label',
  children: {
    arg: 0
  }
});
var bp6$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'jobs-container form-container vertical',
  children: {
    arg: 0
  }
});
var bp5$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp4$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp3$3 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'pollRate'
  },
  children: {
    arg: 0
  }
});
var bp2$4 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp1$5 = inferno.createBlueprint({
  tag: 'form',
  events: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var JobsTabContent = function JobsTabContent(model) {
  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'jobs', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  var handleAddNewJob = function handleAddNewJob(event) {
    addNewJob();
  };

  var jobs = model.configuration.items.map(function (i, idx) {
    return bp0$6(Job, {
      name: i.name,
      active: i.active,
      index: idx
    });
  });

  return bp1$5({
    onsubmit: handleFormSubmit
  }, [bp2$4([bp3$3(['Rate to ', bp4$2('poll your CI server'), ' (in seconds)']), bp5$1({
    type: 'number',
    name: 'pollRate',
    id: 'pollRate',
    value: model.configuration.pollrate
  })]), bp6$1([bp7$1(bp8$1('Jobs to monitor')), jobs, bp9$1({
    type: 'button'
  }, {
    onclick: handleAddNewJob
  }, 'Add new job')]), bp10$1([bp11$1('Save'), bp12$1(['Last updated: ', model.lastUpdated])])]);
};

var bp52 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp51 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp50 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp49 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp48 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'gateway'
  },
  children: {
    arg: 0
  }
});
var bp47 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp46 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp45 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'address'
  },
  children: {
    arg: 0
  }
});
var bp44 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp43 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp42 = inferno.createBlueprint({
  tag: 'span'
});
var bp41 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp40 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'no'
  },
  children: {
    arg: 0
  }
});
var bp39 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp38 = inferno.createBlueprint({
  tag: 'span'
});
var bp37 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp36 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'yes'
  },
  children: {
    arg: 0
  }
});
var bp35 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp34 = inferno.createBlueprint({
  tag: 'div',
  className: 'controls',
  children: {
    arg: 0
  }
});
var bp33 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp32 = inferno.createBlueprint({
  tag: 'label',
  children: {
    arg: 0
  }
});
var bp31 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp30 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp29 = inferno.createBlueprint({
  tag: 'span'
});
var bp28 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp27 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'hidden'
  },
  children: {
    arg: 0
  }
});
var bp26 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp25$1 = inferno.createBlueprint({
  tag: 'label',
  className: 'checkbox',
  children: {
    arg: 0
  }
});
var bp24$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp23$1 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'key'
  },
  children: {
    arg: 0
  }
});
var bp22$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp21$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp20$1 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ssid'
  },
  children: {
    arg: 0
  }
});
var bp19$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp18$1 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp17$1 = inferno.createBlueprint({
  tag: 'span'
});
var bp16$1 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp15$1 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ethernet'
  },
  children: {
    arg: 0
  }
});
var bp14$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp13$1 = inferno.createBlueprint({
  tag: 'span'
});
var bp12$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp11$2 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'wireless'
  },
  children: {
    arg: 0
  }
});
var bp10$2 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp9$2 = inferno.createBlueprint({
  tag: 'div',
  className: 'controls',
  children: {
    arg: 0
  }
});
var bp8$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp7$2 = inferno.createBlueprint({
  tag: 'label',
  children: {
    arg: 0
  }
});
var bp6$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp5$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp4$4 = inferno.createBlueprint({
  tag: 'input',
  className: 'full-length',
  attrs: {
    arg: 0
  }
});
var bp3$5 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$6 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'hostname'
  },
  children: {
    arg: 0
  }
});
var bp1$7 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp0$8 = inferno.createBlueprint({
  tag: 'form',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var NetworkTabContent = function NetworkTabContent(model) {
  var handleConnectionTypeChange = function handleConnectionTypeChange(event) {
    var formEl = event.currentTarget.parentNode.parentNode.parentNode;
    var wifiConfEl = formEl.getElementsByClassName('wireless-connection')[0];

    if (event.currentTarget.value === 'wireless') {
      wifiConfEl.classList.remove('hidden');
      wifiConfEl.classList.add('shown');
    } else {
      wifiConfEl.classList.remove('shown');
      wifiConfEl.classList.add('hidden');
    }
  };

  var handleDhcpChange = function handleDhcpChange(event) {
    var formEl = event.currentTarget.parentNode.parentNode.parentNode;
    var staticEl = formEl.getElementsByClassName('static-configuration')[0];

    if (event.currentTarget.value === 'false') {
      staticEl.classList.remove('hidden');
      staticEl.classList.add('shown');
    } else {
      staticEl.classList.remove('shown');
      staticEl.classList.add('hidden');
    }
  };

  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'network', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  var wirelessContainerHidden = model.configuration.connectionType !== 'wireless' ? 'hidden' : 'shown';
  var staticContainerHidden = model.configuration.dhcp === true ? 'hidden' : 'shown';

  return bp0$8({
    name: 'networkForm'
  }, {
    onsubmit: handleFormSubmit
  }, [bp1$7([bp2$6(['Name of ', bp3$5('this device'), ' on the network']), bp4$4({
    required: true,
    type: 'text',
    id: 'hostname',
    name: 'hostname',
    placeholder: 'e.g. mycompany-build-lights',
    value: model.configuration.hostname
  })]), bp5$3([bp6$3([bp7$2(['Select your ', bp8$2('preferred connection type')]), bp9$2([bp10$2({
    type: 'radio',
    name: 'connectionType',
    checked: model.configuration.connectionType === 'wireless' ? 'checked' : '',
    value: 'wireless',
    id: 'wireless'
  }, {
    onchange: handleConnectionTypeChange
  }), bp11$2([bp12$2(bp13$1()), 'Wireless']), bp14$1({
    type: 'radio',
    name: 'connectionType',
    checked: model.configuration.connectionType === 'ethernet' ? 'checked' : '',
    value: 'ethernet',
    id: 'ethernet'
  }, {
    onchange: handleConnectionTypeChange
  }), bp15$1([bp16$1(bp17$1()), 'Ethernet'])])]), bp18$1('wireless-connection ' + wirelessContainerHidden, [bp19$1([bp20$1('SSID'), bp21$1({
    type: 'text',
    id: 'ssid',
    name: 'ssid',
    value: model.configuration.wireless.ssid
  })]), bp22$1([bp23$1('Password'), bp24$1({
    type: 'password',
    id: 'key',
    name: 'key',
    value: model.configuration.wireless.key
  })]), bp25$1([bp26({
    type: 'checkbox',
    id: 'hidden',
    name: 'hidden',
    value: model.configuration.wireless.hidden,
    checked: model.configuration.wireless.hidden ? 'checked' : ''
  }), bp27([bp28(bp29()), 'Hidden network?'])])])]), bp30([bp31([bp32(['Assign network ', bp33('IP address')]), bp34([bp35({
    type: 'radio',
    name: 'useDhcp',
    checked: !model.configuration.dhcp ? 'checked' : '',
    value: 'false',
    id: 'yes'
  }, {
    onchange: handleDhcpChange
  }), bp36([bp37(bp38()), 'Yes']), bp39({
    type: 'radio',
    name: 'useDhcp',
    checked: model.configuration.dhcp ? 'checked' : '',
    value: 'true',
    id: 'no'
  }, {
    onchange: handleDhcpChange
  }), bp40([bp41(bp42()), 'No'])])]), bp43('static-configuration ' + staticContainerHidden, [bp44([bp45('Address'), bp46({
    type: 'text',
    name: 'address',
    id: 'address',
    value: model.configuration.address,
    placeholder: '192.168.0.10/24'
  })]), bp47([bp48('Gateway'), bp49({
    type: 'text',
    name: 'gateway',
    id: 'gateway',
    value: model.configuration.gateway,
    placeholder: '192.168.0.1'
  })])])]), bp50([bp51('Save'), bp52(['Last updated: ', model.lastUpdated])])]);
};

var bp11$3 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp10$3 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp9$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp8$3 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp7$3 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'numLeds'
  },
  children: {
    arg: 0
  }
});
var bp6$4 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'adafruit_lpd8806'
  },
  children: {
    arg: 0
  }
});
var bp5$4 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'epistar_lpd8806'
  },
  children: {
    arg: 0
  }
});
var bp4$5 = inferno.createBlueprint({
  tag: 'select',
  attrs: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp3$6 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$7 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ledType'
  },
  children: {
    arg: 0
  }
});
var bp1$8 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp0$9 = inferno.createBlueprint({
  tag: 'form',
  events: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var LedHardwareTabContent = function LedHardwareTabContent(model) {
  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'led', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  return bp0$9({
    onsubmit: handleFormSubmit
  }, [bp1$8([bp2$7(['Which ', bp3$6('LED strip'), ' you are using']), bp4$5({
    required: true,
    id: 'ledType',
    name: 'ledType',
    value: model.configuration.ledType
  }, [bp5$4('Epistar LPD8806'), bp6$4('Adafruit LPD8806')]), bp7$3('Number of LEDs on your strip'), bp8$3({
    type: 'number',
    required: true,
    id: 'numLeds',
    name: 'numLeds',
    value: model.configuration.numLeds
  })]), bp9$3([bp10$3('Save'), bp11$3(['Last updated: ', model.lastUpdated])])]);
};

var bp0$4 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var TabContent = function TabContent(tabInfo) {
  var displayClass = !tabInfo.active ? 'hidden tab-content-container' : 'tab-content-container';
  var content = void 0;

  switch (tabInfo.name) {
    case 'network':
      content = NetworkTabContent(tabInfo);
      break;
    case 'ci server':
      content = CiTabContent(tabInfo);
      break;
    case 'led hardware':
      content = LedHardwareTabContent(tabInfo);
      break;
    case 'jobs to monitor':
      content = JobsTabContent(tabInfo);
      break;
    default:
      content = 'Nothing to see here.';
  }

  return bp0$4(displayClass, content);
};

var bp0$1 = inferno.createBlueprint({
  tag: {
    arg: 0
  },
  attrs: {
    arg: 1
  }
});
var bp4 = inferno.createBlueprint({
  tag: 'div',
  className: 'tab-content container',
  children: {
    arg: 0
  }
});
var bp3 = inferno.createBlueprint({
  tag: 'ul',
  className: 'container',
  children: {
    arg: 0
  }
});
var bp2$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'tab-nav-container',
  children: {
    arg: 0
  }
});
var bp1$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'tab',
  children: {
    arg: 0
  }
});
var Tab = function Tab(model) {
  var tabs = model.map(TabItem);
  var tabContent = model.filter(function (tool) {
    return tool.active;
  }).map(TabContent);

  var dismissHandler = function dismissHandler(e) {
    delete model.alert;
    return dismissAlert(model);
  };

  var alert = '';
  if (model.alert) {
    alert = bp0$1(Alert, {
      success: model.alert.success,
      message: model.alert.message,
      dismissHandler: dismissHandler
    });
  }

  return bp1$1([bp2$1(bp3(tabs)), bp4([alert, tabContent])]);
};

var bp10$4 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp9$4 = inferno.createBlueprint({
  tag: 'li',
  children: {
    arg: 0
  }
});
var bp8$4 = inferno.createBlueprint({
  tag: 'div'
});
var bp7$4 = inferno.createBlueprint({
  tag: 'li',
  className: 'separator',
  children: {
    arg: 0
  }
});
var bp6$5 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp5$5 = inferno.createBlueprint({
  tag: 'li',
  children: {
    arg: 0
  }
});
var bp4$6 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp3$7 = inferno.createBlueprint({
  tag: 'li',
  children: {
    arg: 0
  }
});
var bp2$8 = inferno.createBlueprint({
  tag: 'ul',
  className: 'dropdown-device-actions',
  children: {
    arg: 0
  }
});
var bp1$9 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'button',
    'aria-haspopup': 'true'
  },
  children: {
    arg: 0
  }
});
var bp0$10 = inferno.createBlueprint({
  tag: 'div',
  className: 'device-actions',
  children: {
    arg: 0
  }
});
var bp13$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp12$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'container',
  children: {
    arg: 0
  }
});
var bp11$4 = inferno.createBlueprint({
  tag: 'header',
  children: {
    arg: 0
  }
});
var Header = function Header(model) {
  var supervisorHref = 'http://' + location.hostname + ':9001';

  var rebootDevice = function rebootDevice() {
    return reboot();
  };
  var shutdownDevice = function shutdownDevice() {
    return shutdown();
  };

  var deviceActionsMenu = bp0$10([bp1$9('Menu'), bp2$8([bp3$7(bp4$6({
    href: '#'
  }, {
    onclick: rebootDevice
  }, 'Reboot')), bp5$5(bp6$5({
    href: '#'
  }, {
    onclick: shutdownDevice
  }, 'Shutdown')), bp7$4(bp8$4()), bp9$4(bp10$4({
    id: 'supervisor',
    target: '_blank',
    href: supervisorHref
  }, 'Supervisor'))])]);
  if (model.reboot || model.shutdown) {
    deviceActionsMenu = '';
  }

  return bp11$4(bp12$3([bp13$2('Build Lights'), deviceActionsMenu]));
};

var bp6$6 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    href: 'http://creativecommons.org/licenses/by/3.0/',
    title: 'Creative Commons BY 3.0',
    target: '_blank'
  },
  children: {
    arg: 0
  }
});
var bp5$6 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    href: 'http://www.flaticon.com',
    title: 'Flaticon'
  },
  children: {
    arg: 0
  }
});
var bp4$7 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    href: 'http://www.flaticon.com/authors/gregor-cresnar',
    title: 'Gregor Cresnar'
  },
  children: {
    arg: 0
  }
});
var bp3$8 = inferno.createBlueprint({
  tag: 'div',
  children: {
    arg: 0
  }
});
var bp2$9 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    href: 'http://www.dius.com.au',
    target: '_blank',
    title: 'DiUS'
  },
  children: {
    arg: 0
  }
});
var bp1$10 = inferno.createBlueprint({
  tag: 'div',
  children: {
    arg: 0
  }
});
var bp0$11 = inferno.createBlueprint({
  tag: 'footer',
  children: {
    arg: 0
  }
});
var Footer = function Footer() {
  return bp0$11([bp1$10([bp2$9('DiUS'), ' \xA9 2016 - All rights reserved.']), bp3$8(['Icons made by ', bp4$7('Gregor Cresnar'), ' from ', bp5$6('www.flaticon.com'), ' is licensed by ', bp6$6('CC 3.0 BY')])]);
};

var bp2$10 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp1$11 = inferno.createBlueprint({
  tag: 'br'
});
var bp0$12 = inferno.createBlueprint({
  tag: 'p',
  children: {
    arg: 0
  }
});
var bp5$7 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp4$8 = inferno.createBlueprint({
  tag: 'br'
});
var bp3$9 = inferno.createBlueprint({
  tag: 'p',
  children: {
    arg: 0
  }
});
var bp8$5 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp7$5 = inferno.createBlueprint({
  tag: 'br'
});
var bp6$7 = inferno.createBlueprint({
  tag: 'p',
  children: {
    arg: 0
  }
});
var bp10$5 = inferno.createBlueprint({
  tag: 'div',
  className: 'message',
  children: {
    arg: 0
  }
});
var bp9$5 = inferno.createBlueprint({
  tag: 'div',
  className: 'waiting',
  children: {
    arg: 0
  }
});
var Intermission = function Intermission(model) {
  var message = bp0$12(['Shutdown underway. ', bp1$11(), ' ', bp2$10(['You can safely unplug your Raspberry Pi in ', model.countdown, ' seconds.'])]);

  if (model.reboot) {
    message = bp3$9(['Reboot underway. ', bp4$8(), ' ', bp5$7(['Will refresh in ', model.countdown, ' seconds.'])]);
  }

  if (model.completed) {
    bp6$7(['Shutdown completed. ', bp7$5(), ' ', bp8$5('You can safely unplug your Raspberry Pi now.')]);
  }

  return bp9$5(bp10$5(message));
};

var bp2 = inferno.createBlueprint({
  tag: {
    arg: 0
  }
});
var bp1 = inferno.createBlueprint({
  tag: {
    arg: 0
  }
});
var bp0 = inferno.createBlueprint({
  tag: 'div',
  className: 'representation',
  children: {
    arg: 0
  }
});
var Main = function Main(model) {
  var mainContent = '';
  if (model.reboot || model.shutdown) {
    mainContent = Intermission(model);
  } else {
    mainContent = Tab(model);
  }

  return bp0([bp1(Header), mainContent, bp2(Footer)]);
};

function mainComponent(model) {
  return Main(model);
}

function display(representation) {
  var reprEl = document.getElementById('representation');
  if (reprEl) {
    infernoDom.render(representation, reprEl);
  }
}

function represent(model) {
  if (model.reboot || model.shutdown) {
    return model;
  }

  var currentState = model.tools.filter(function (t) {
    return t.active;
  }).map(function (t) {
    return {
      name: t.name,
      active: t.name === model.selectedTool,
      configuration: t.configuration,
      lastUpdated: new Date(model.lastUpdated).toString()
    };
  });

  currentState.alert = model.result;

  window.localStorage.setItem('currentState', JSON.stringify(currentState));
  return currentState;
}

function hasCountdownEnded(stateModel) {
  return stateModel.countdown === 0;
}

function isExecutingDeviceAction(stateModel) {
  return stateModel.reboot || stateModel.shutdown;
}

function nextAction(stateModel) {
  if (isExecutingDeviceAction(stateModel)) {
    if (hasCountdownEnded(stateModel)) {
      completeDeviceAction(stateModel);
    } else {
      stateModel.countdown -= 1;
      setTimeout(function () {
        render(stateModel);
      }, 1000);
    }
  }
}

function render(stateModel) {
  display(mainComponent(stateModel));
  nextAction(stateModel);
}

var cb = function cb(event) {
  fetch('/model').then(function (res) {
    return res.json();
  }).then(function (json) {
    render(represent(json));
  });
};

if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
  cb();
} else {
  document.addEventListener('DOMContentLoaded', cb);
}

}());
//# sourceMappingURL=bundle.js.map
