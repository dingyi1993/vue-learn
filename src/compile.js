import Watcher from './watcher';
import VNode from './vnode';

export default class Compile {
  constructor(el, vm) {
    this.el = el
    this.vm = vm
    this.init()
  }
  init() {
    if (this.el) {
      this.fragment = this.nodeTofragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.error('dom元素不存在')
    }
  }
  nodeTofragment(el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child);
      child = el.firstChild
    }
    return fragment;
  }
  compileElement(el) {
    const childNodes = el.childNodes
    childNodes.forEach((item) => {
      const reg = /\{\{(.*)\}\}/;
      const text = item.textContent;
      const vnode = new VNode(item)
      switch (item.nodeType) {
        case Node.ELEMENT_NODE:
        this.compileDirective(item)
        if (item.childNodes && item.childNodes.length) {
          this.compileElement(item)
        }
        break;

        case Node.TEXT_NODE:
        if (reg.test(text)) {
          this.compileText(vnode, reg.exec(text))
        }
        break;

        default:
        break;
      }
    })
    return el
  }
  compileText(vnode, regResult) {
    const exp = regResult[1].trim()
    this.updateText(vnode, regResult[0], this.vm[exp]); // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, (val, oldVal) => { // 生成订阅器并绑定更新函数
      this.updateText(vnode, regResult[0], val);
    });
  }
  updateText(vnode, template, value) {
    console.log('textContent:' + vnode.template);
    vnode.node.textContent = vnode.template.replace(new RegExp(template, 'g'), value);
  }

  // 编译指令
  compileDirective(node) {
    const removeAttrs = []
    console.log(node.attributes);
    Array.prototype.forEach.call(node.attributes, (item) => {
      const attrName = item.name
      if (this.isEventDirective(attrName)) { // on:xxx
        const exp = item.value
        const dir = attrName.substring(3)
        if (dir && this.vm.methods) {
          node.addEventListener(dir, () => {
            this.vm.methods[exp].call(this.vm)
          })
        }
        removeAttrs.push(attrName)
      } else if (this.isDirective(attrName)) { // v-xxx
        const exp = item.value
        const dir = attrName.substring(2)
        if (dir === 'model') {
          node.value = this.vm[exp]
          node.addEventListener('input', (e) => {
            const newVal = e.target.value
            if (newVal === this.vm[exp]) {
              return
            }
            this.vm[exp] = newVal
          })
          removeAttrs.push(attrName)
          new Watcher(this.vm, exp, (val, oldVal) => {
            node.value = val
          })
        }
      }
    })
    removeAttrs.forEach((item) => {
      node.removeAttribute(item)
    })
  }
  isDirective(attrName) {
    return /^v-/.test(attrName)
  }
  isEventDirective(attrName) {
    return /^on:/.test(attrName)
  }
}
