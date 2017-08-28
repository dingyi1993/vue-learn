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

function Dep() {
  this.stack = [];
}
Dep.prototype = {
  addSub: function(target) {
    this.stack.push(target);
  },
  notify: function() {
    for (var i = 0; i < this.stack.length; i++) {
      this.stack[i].update();
    }
  },
};

var observer = function(data) {
  return new Observer(data)
};
function Observer(data) {
  this.data = data;

  var dep = new Dep();
  // var value = data.a
  Object.keys(data).forEach(function(item) {
    defineReactive(data, item, data[item]);
  });
}
var defineReactive = function(data, key, val) {
  var dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log('get value: ' + val);
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val
    },
    set: function(newVal) {
      if (newVal === val) {
        return
      }
      console.log('new val is :' + newVal);
      val = newVal;
      dep.notify();
    },
  });
};

function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  this.value = this.get(); // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function() {
    console.log('update');
    this.run();
  },
  run: function() {
    console.log('run');
    var value = this.vm[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get: function() {
    Dep.target = this; // 缓存自己
    var value = this.vm[this.exp]; // 强制执行监听器里的get函数
    Dep.target = null; // 释放自己
    return value;
  }
};

function VNode(node) {
  this.node = node;
  this.template = node.textContent;
}

function Compile(el, vm) {
  this.el = el;
  this.vm = vm;
  this.init();
}
Compile.prototype = {
  init: function() {
    if (this.el) {
      this.fragment = this.nodeTofragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else {
      console.error('dom元素不存在');
    }
  },
  nodeTofragment: function(el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  compileElement: function(el) {
    var childNodes = el.childNodes;
    var self = this;
    childNodes.forEach(function(item) {
      var reg = /\{\{(.*)\}\}/;
      var text = item.textContent;
      var vnode = new VNode(item);
      switch (item.nodeType) {
        case Node.ELEMENT_NODE:
        self.compileDirective(item);
        if (item.childNodes && item.childNodes.length) {
          self.compileElement(item);
        }
        break;

        case Node.TEXT_NODE:
        if (reg.test(text)) {
          self.compileText(vnode, reg.exec(text));
        }
        break;

        default:
        break;
      }
    });
    return el
  },
  compileText: function(vnode, regResult) {
    var self = this;
    var exp = regResult[1].trim();
    this.updateText(vnode, regResult[0], this.vm[exp]); // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function(val, oldVal) { // 生成订阅器并绑定更新函数
      self.updateText(vnode, regResult[0], val);
    });
  },
  updateText: function(vnode, template, value) {
    console.log('textContent:' + vnode.template);
    vnode.node.textContent = vnode.template.replace(new RegExp(template, 'g'), value);
  },

  // 编译指令
  compileDirective: function(node) {
    var self = this;
    var removeAttrs = [];
    console.log(node.attributes);
    Array.prototype.forEach.call(node.attributes, function(item) {
      var attrName = item.name;
      if (self.isEventDirective(attrName)) { // on:xxx
        var exp = item.value;
        var dir = attrName.substring(3);
        if (dir && self.vm.methods) {
          node.addEventListener(dir, function() {
            self.vm.methods[exp].call(self.vm);
          });
        }
        removeAttrs.push(attrName);
      } else if (self.isDirective(attrName)) { // v-xxx
        var exp = item.value;
        var dir = attrName.substring(2);
        if (dir === 'model') {
          node.value = self.vm[exp];
          node.addEventListener('input', function(e) {
            var newVal = e.target.value;
            if (newVal === self.vm[exp]) {
              return
            }
            self.vm[exp] = newVal;
          });
          removeAttrs.push(attrName);
          new Watcher(self.vm, exp, function(val, oldVal) {
            node.value = val;
          });
        }
      }
    });
    removeAttrs.forEach(function(item) {
      node.removeAttribute(item);
    });
  },
  isDirective: function(attrName) {
    return /^v-/.test(attrName)
  },
  isEventDirective: function(attrName) {
    return /^on:/.test(attrName)
  },
};

function Vud(options) {
  var self = this;
  this.vm = this;
  this.data = options.data;
  this.methods = options.methods;

  // 代理 vm.xxx => vm.data.xxx
  Object.keys(options.data).forEach(function(item) {
    self.proxyKeys(item);
  });
  observer(options.data);
  new Compile(options.el, this.vm);
  return this
}

Vud.prototype = {
  proxyKeys: function(key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        console.log('get');
        return self.data[key]
      },
      set: function(newVal) {
        if (self.data[key] === newVal) {
          return
        }
        console.log('set');
        self.data[key] = newVal;
      },
    });
  }
};

return Vud;

})));
