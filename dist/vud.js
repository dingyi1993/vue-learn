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

var babelHelpers = {};




var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();











































babelHelpers;

var Dep = function () {
  function Dep() {
    classCallCheck(this, Dep);

    this.stack = [];
  }

  createClass(Dep, [{
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

var Observer = function Observer(data) {
  classCallCheck(this, Observer);

  this.data = data;

  var dep = new Dep();
  // const value = data.a
  Object.keys(data).forEach(function (item) {
    defineReactive(data, item, data[item]);
  });
};

var defineReactive = function defineReactive(data, key, val) {
  var dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function get$$1() {
      console.log('get value: ' + val);
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set: function set$$1(newVal) {
      if (newVal === val) {
        return;
      }
      console.log('new val is :' + newVal);
      val = newVal;
      dep.notify();
    }
  });
};

var observer = function observer(data) {
  return new Observer(data);
};

var Watcher = function () {
  function Watcher(vm, exp, cb) {
    classCallCheck(this, Watcher);

    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get(); // 将自己添加到订阅器的操作
  }

  createClass(Watcher, [{
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
    value: function get$$1() {
      Dep.target = this; // 缓存自己
      var value = this.vm[this.exp]; // 强制执行监听器里的get函数
      Dep.target = null; // 释放自己
      return value;
    }
  }]);
  return Watcher;
}();

var VNode = function VNode(node) {
  classCallCheck(this, VNode);

  this.node = node;
  this.template = node.textContent;
};

var Compile = function () {
  function Compile(el, vm) {
    classCallCheck(this, Compile);

    this.el = el;
    this.vm = vm;
    this.init();
  }

  createClass(Compile, [{
    key: 'init',
    value: function init() {
      if (this.el) {
        this.fragment = this.nodeTofragment(this.el);
        this.compileElement(this.fragment);
        this.el.appendChild(this.fragment);
      } else {
        console.error('dom元素不存在');
      }
    }
  }, {
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
      var _this2 = this;

      var exp = regResult[1].trim();
      this.updateText(vnode, regResult[0], this.vm[exp]); // 将初始化的数据初始化到视图中
      new Watcher(this.vm, exp, function (val, oldVal) {
        // 生成订阅器并绑定更新函数
        _this2.updateText(vnode, regResult[0], val);
      });
    }
  }, {
    key: 'updateText',
    value: function updateText(vnode, template, value) {
      console.log('textContent:' + vnode.template);
      vnode.node.textContent = vnode.template.replace(new RegExp(template, 'g'), value);
    }

    // 编译指令

  }, {
    key: 'compileDirective',
    value: function compileDirective(node) {
      var _this3 = this;

      var removeAttrs = [];
      console.log(node.attributes);
      Array.prototype.forEach.call(node.attributes, function (item) {
        var attrName = item.name;
        if (_this3.isEventDirective(attrName)) {
          // on:xxx
          var exp = item.value;
          var dir = attrName.substring(3);
          if (dir && _this3.vm.methods) {
            node.addEventListener(dir, function () {
              _this3.vm.methods[exp].call(_this3.vm);
            });
          }
          removeAttrs.push(attrName);
        } else if (_this3.isDirective(attrName)) {
          // v-xxx
          var _exp = item.value;
          var _dir = attrName.substring(2);
          if (_dir === 'model') {
            node.value = _this3.vm[_exp];
            node.addEventListener('input', function (e) {
              var newVal = e.target.value;
              if (newVal === _this3.vm[_exp]) {
                return;
              }
              _this3.vm[_exp] = newVal;
            });
            removeAttrs.push(attrName);
            new Watcher(_this3.vm, _exp, function (val, oldVal) {
              node.value = val;
            });
          }
        }
      });
      removeAttrs.forEach(function (item) {
        node.removeAttribute(item);
      });
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

var Vud = function () {
  function Vud(options) {
    var _this = this;

    classCallCheck(this, Vud);

    this.vm = this;
    this.data = options.data;
    this.methods = options.methods;

    // 代理 vm.xxx => vm.data.xxx
    Object.keys(options.data).forEach(function (item) {
      _this.proxyKeys(item);
    });
    observer(options.data);
    new Compile(options.el, this.vm);
    return this;
  }

  createClass(Vud, [{
    key: 'proxyKeys',
    value: function proxyKeys(key) {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: function get$$1() {
          console.log('get');
          return this.data[key];
        },
        set: function set$$1(newVal) {
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
