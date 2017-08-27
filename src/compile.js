function Compile(el, vm) {
  this.el = el
  this.vm = vm
  this.init()
}
Compile.prototype = {
  init: function() {
    if (this.el) {
      this.fragment = this.nodeTofragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.error('dom元素不存在')
    }
  },
  nodeTofragment: function(el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child);
      child = el.firstChild
    }
    return fragment;
  },
  compileElement: function(el) {
    var childNodes = el.childNodes
    var self = this
    childNodes.forEach(function(item) {
      var reg = /\{\{(.*)\}\}/;
      var text = item.textContent;
      var vnode = new VNode(item)
      if (item.nodeType === Node.TEXT_NODE) {
        if (reg.test(text)) {
          self.compileText(vnode, reg.exec(text))
        }
      } else {
        self.compileDirective(item)
        if (item.childNodes && item.childNodes.length) {
          self.compileElement(item)
        }
      }
      // } else
    })
    return el
  },
  compileText: function(vnode, regResult) {
    var self = this;
    var exp = regResult[1].trim()
    // var initText = node.textContent.replace(new RegExp(regResult[0], 'g'), this.vm[exp]);
    this.updateText(vnode, regResult[0], this.vm[exp]); // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function(val, oldVal) { // 生成订阅器并绑定更新函数
      self.updateText(vnode, regResult[0], val);
    });
  },
  updateText: function(vnode, template, value) {
    console.log('textContent:' + vnode.template);
    vnode.node.textContent = vnode.template.replace(new RegExp(template, 'g'), value);
    // node.textContent = typeof value == 'undefined' ? '' : value;
  },
  compileDirective: function(node) {
    var self = this
    var removeAttrs = []
    console.log(node.attributes);
    Array.prototype.forEach.call(node.attributes, function(item) {
      var attrName = item.name
      if (self.isEventDirective(attrName)) {
        var exp = item.value
        var dir = attrName.substring(3)
        node.addEventListener(dir, function() {
          self.vm.methods[exp].call(self.vm)
        })
        removeAttrs.push(attrName)
      } else if (self.isDirective(attrName)) {
        var exp = item.value
        var dir = attrName.substring(2)
        if (dir === 'model') {
          node.value = self.vm[exp]
          node.addEventListener('input', function() {
            self.vm[exp] = this.value
          })
          removeAttrs.push(attrName)
          new Watcher(self.vm, exp, function(val, oldVal) {
            node.value = val
          })
        }
      }
    })
    removeAttrs.forEach(function(item) {
      node.removeAttribute(item)
    })
    // node.attributes.forEach(function(item) {
    //   console.log(item)
    // })
  },
  isDirective: function(attrName) {
    return /^v-/.test(attrName)
  },
  isEventDirective: function(attrName) {
    return /^on:/.test(attrName)
  },
}
