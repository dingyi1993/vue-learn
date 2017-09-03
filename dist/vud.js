/*!
 * Vud.js v1.0.0
 * (c) 2017-2017 dingyi1993
 * Just imitate vue for learning.
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vud = factory());
}(this, (function () { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty$1 = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$1, __esModule: true };
});

var _Object$defineProperty = unwrapExports(defineProperty);

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys$1 = _core.Object.keys;

var keys = createCommonjsModule(function (module) {
module.exports = { "default": keys$1, __esModule: true };
});

var _Object$keys = unwrapExports(keys);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

var _global$2 = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core$2 = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _isObject$2 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject$2 = function (it) {
  if (!_isObject$2(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails$2 = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors$2 = !_fails$2(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$2 = _global$2.document;
// typeof document.createElement is 'object' in old IE
var is$1 = _isObject$2(document$2) && _isObject$2(document$2.createElement);
var _domCreate$2 = function (it) {
  return is$1 ? document$2.createElement(it) : {};
};

var _ie8DomDefine$2 = !_descriptors$2 && !_fails$2(function () {
  return Object.defineProperty(_domCreate$2('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive$2 = function (it, S) {
  if (!_isObject$2(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$2 = Object.defineProperty;

var f$1 = _descriptors$2 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject$2(O);
  P = _toPrimitive$2(P, true);
  _anObject$2(Attributes);
  if (_ie8DomDefine$2) try {
    return dP$2(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp$2 = {
	f: f$1
};

var _propertyDesc$2 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide$2 = _descriptors$2 ? function (object, key, value) {
  return _objectDp$2.f(object, key, _propertyDesc$2(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty$1 = {}.hasOwnProperty;
var _has$2 = function (it, key) {
  return hasOwnProperty$1.call(it, key);
};

var id$1 = 0;
var px$1 = Math.random();
var _uid$2 = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px$1).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid$2('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_core$2.inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has$2(val, 'name') || _hide$2(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has$2(val, SRC) || _hide$2(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global$2) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide$2(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide$2(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
});

var _aFunction$2 = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx$2 = function (fn, that, length) {
  _aFunction$2(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE$1 = 'prototype';

var $export$2 = function (type, name, source) {
  var IS_FORCED = type & $export$2.F;
  var IS_GLOBAL = type & $export$2.G;
  var IS_STATIC = type & $export$2.S;
  var IS_PROTO = type & $export$2.P;
  var IS_BIND = type & $export$2.B;
  var target = IS_GLOBAL ? _global$2 : IS_STATIC ? _global$2[name] || (_global$2[name] = {}) : (_global$2[name] || {})[PROTOTYPE$1];
  var exports = IS_GLOBAL ? _core$2 : _core$2[name] || (_core$2[name] = {});
  var expProto = exports[PROTOTYPE$1] || (exports[PROTOTYPE$1] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx$2(out, _global$2) : IS_PROTO && typeof out == 'function' ? _ctx$2(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export$2.U);
    // export
    if (exports[key] != out) _hide$2(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global$2.core = _core$2;
// type bitmap
$export$2.F = 1;   // forced
$export$2.G = 2;   // global
$export$2.S = 4;   // static
$export$2.P = 8;   // proto
$export$2.B = 16;  // bind
$export$2.W = 32;  // wrap
$export$2.U = 64;  // safe
$export$2.R = 128; // real proto method for `library`
var _export$2 = $export$2;

var toString$1 = {}.toString;

var _cof$2 = function (it) {
  return toString$1.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject$2 = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof$2(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined$2 = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject$2 = function (it) {
  return Object(_defined$2(it));
};

// 7.1.4 ToInteger
var ceil$1 = Math.ceil;
var floor$1 = Math.floor;
var _toInteger$2 = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor$1 : ceil$1)(it);
};

// 7.1.15 ToLength

var min$2 = Math.min;
var _toLength$2 = function (it) {
  return it > 0 ? min$2(_toInteger$2(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof$2(arg) == 'Array';
};

var SHARED$1 = '__core-js_shared__';
var store$1 = _global$2[SHARED$1] || (_global$2[SHARED$1] = {});
var _shared$2 = function (key) {
  return store$1[key] || (store$1[key] = {});
};

var _wks = createCommonjsModule(function (module) {
var store = _shared$2('wks');

var Symbol = _global$2.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid$2)('Symbol.' + name));
};

$exports.store = store;
});

var SPECIES = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject$2(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject$2($this);
    var self = _iobject$2(O);
    var f = _ctx$2(callbackfn, that, 3);
    var length = _toLength$2(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide$2(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $find = _arrayMethods(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
_export$2(_export$2.P + _export$2.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY);

var Dep = function () {
    function Dep() {
        _classCallCheck(this, Dep);

        this.stack = [];
    }

    _createClass(Dep, [{
        key: "addSub",
        value: function addSub(target) {
            this.stack.push(target);
        }
    }, {
        key: "notify",
        value: function notify() {
            for (var i = 0; i < this.stack.length; i++) {
                this.stack[i].update();
            }
        }
    }]);

    return Dep;
}();

var Observer = function () {
    function Observer(data) {
        _classCallCheck(this, Observer);

        this.data = data;
        var dep = new Dep();
        // const value = data.a
        _Object$keys(data).forEach(function (item) {
            Observer.defineReactive(data, item, data[item]);
        });
    }

    _createClass(Observer, null, [{
        key: 'defineReactive',
        value: function defineReactive(data, key, val) {
            var dep = new Dep();
            _Object$defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get: function get() {
                    console.log('get value: ' + val);
                    if (Dep.target) {
                        dep.addSub(Dep.target);
                    }
                    return val;
                },
                set: function set(newVal) {
                    if (newVal === val) {
                        return;
                    }
                    console.log('new val is :' + newVal);
                    // tslint:disable-next-line:no-param-reassign
                    val = newVal;
                    dep.notify();
                }
            });
        }
    }]);

    return Observer;
}();

var observer = function observer(data) {
    return new Observer(data);
};

var Watcher = function () {
    function Watcher(vm, exp, cb) {
        _classCallCheck(this, Watcher);

        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.value = this.get(); // 将自己添加到订阅器的操作
    }

    _createClass(Watcher, [{
        key: 'update',
        value: function update() {
            console.log('update');
            this.run();
        }
    }, {
        key: 'run',
        value: function run() {
            console.log('run');
            var value = this.vm[this.exp];
            var oldVal = this.value;
            if (value !== oldVal) {
                this.value = value;
                this.cb.call(this.vm, value, oldVal);
            }
        }
    }, {
        key: 'get',
        value: function get() {
            Dep.target = this; // 缓存自己
            var value = this.vm[this.exp]; // 强制执行监听器里的get函数
            Dep.target = null; // 释放自己
            return value;
        }
    }]);

    return Watcher;
}();

var VNode = function VNode(node) {
    _classCallCheck(this, VNode);

    this.node = node;
    this.node = node;
    this.template = node.textContent;
};

var Compile = function () {
    function Compile(el, vm) {
        _classCallCheck(this, Compile);

        this.el = el;
        this.vm = vm;
        this.el = el;
        this.vm = vm;
        this.init();
    }

    _createClass(Compile, [{
        key: 'init',
        value: function init() {
            if (this.el) {
                this.fragment = Compile.nodeTofragment(this.el);
                this.compileElement(this.fragment);
                this.el.appendChild(this.fragment);
            } else {
                console.error('dom元素不存在');
            }
        }
    }, {
        key: 'compileElement',
        value: function compileElement(el) {
            var _this = this;

            var childNodes = el.childNodes;
            childNodes.forEach(function (item) {
                var reg = /\{\{(.*)\}\}/;
                var text = item.textContent;
                var vnode = new VNode(item);
                switch (item.nodeType) {
                    case Node.ELEMENT_NODE:
                        _this.compileDirective(item);
                        if (item.childNodes && item.childNodes.length) {
                            _this.compileElement(item);
                        }
                        break;
                    case Node.TEXT_NODE:
                        if (reg.test(text)) {
                            _this.compileText(vnode, reg.exec(text));
                        }
                        break;
                    default:
                        break;
                }
            });
            return el;
        }
    }, {
        key: 'compileText',
        value: function compileText(vnode, regResult) {
            var exp = regResult[1].trim();
            Compile.updateText(vnode, regResult[0], this.vm[exp]); // 将初始化的数据初始化到视图中
            new Watcher(this.vm, exp, function (val, oldVal) {
                Compile.updateText(vnode, regResult[0], val);
            });
        }
    }, {
        key: 'compileDirective',

        // 编译指令
        value: function compileDirective(node) {
            var _this2 = this;

            var removeAttrs = [];
            console.log(node.attributes);
            Array.prototype.forEach.call(node.attributes, function (item) {
                var attrName = item.name;
                if (Compile.isEventDirective(attrName)) {
                    var exp = item.value;
                    var dir = attrName.substring(3);
                    if (dir && _this2.vm.methods) {
                        node.addEventListener(dir, function () {
                            _this2.vm.methods[exp].call(_this2.vm);
                        });
                    }
                    removeAttrs.push(attrName);
                } else if (Compile.isDirective(attrName)) {
                    var _exp = item.value;
                    var _dir = attrName.substring(2);
                    if (_dir === 'model') {
                        node.value = _this2.vm[_exp];
                        node.addEventListener('input', function (e) {
                            var newVal = e.target.value;
                            if (newVal === _this2.vm[_exp]) {
                                return;
                            }
                            _this2.vm[_exp] = newVal;
                        });
                        removeAttrs.push(attrName);
                        new Watcher(_this2.vm, _exp, function (val, oldVal) {
                            node.value = val;
                        });
                    }
                }
            });
            removeAttrs.forEach(function (item) {
                node.removeAttribute(item);
            });
        }
    }], [{
        key: 'nodeTofragment',
        value: function nodeTofragment(el) {
            var fragment = document.createDocumentFragment();
            var child = el.firstChild;
            while (child) {
                // 将Dom元素移入fragment中
                fragment.appendChild(child);
                child = el.firstChild;
            }
            return fragment;
        }
    }, {
        key: 'updateText',
        value: function updateText(vnode, template, value) {
            console.log('textContent:' + vnode.template);
            vnode.node.textContent = vnode.template.replace(new RegExp(template, 'g'), value);
        }
    }, {
        key: 'isDirective',
        value: function isDirective(attrName) {
            return (/^v-/.test(attrName)
            );
        }
    }, {
        key: 'isEventDirective',
        value: function isEventDirective(attrName) {
            return (/^on:/.test(attrName)
            );
        }
    }]);

    return Compile;
}();

var add = function add(a, b) {
  return a + b;
};

// import add from 'lodash/add'
var abc = ['qwe', 'asd', 'zxc'];
console.log(abc.find(function (item) {
    return item.length === 3;
}));
console.log(add, add(2, 2));

var Vud = function () {
    function Vud(options) {
        var _this = this;

        _classCallCheck(this, Vud);

        this.vm = this;
        this.data = options.data;
        this.methods = options.methods;
        // 代理 vm.xxx => vm.data.xxx
        _Object$keys(options.data).forEach(function (item) {
            _this.proxyKeys(item);
        });
        observer(options.data);
        new Compile(options.el, this.vm);
        return this;
    }

    _createClass(Vud, [{
        key: 'proxyKeys',
        value: function proxyKeys(key) {
            _Object$defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get: function get() {
                    console.log('get');
                    return this.data[key];
                },
                set: function set(newVal) {
                    if (this.data[key] === newVal) {
                        return;
                    }
                    console.log('set');
                    this.data[key] = newVal;
                }
            });
        }
    }]);

    return Vud;
}();

return Vud;

})));
//# sourceMappingURL=vud.js.map
