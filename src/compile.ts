import Watcher from './watcher'
import VNode from './vnode'
import Vud from './index'

export default class Compile {
  fragment: DocumentFragment
  constructor(public el: HTMLElement, public vm: Vud) {
    this.init()
  }
  init() {
    if (this.el) {
      this.fragment = Compile.nodeTofragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.error('dom元素不存在')
    }
  }
  static nodeTofragment(el: HTMLElement): DocumentFragment {
    const fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }
  compileElement(el: Node): Node {
    const childNodes = el.childNodes
    childNodes.forEach((item) => {
      const reg = /\{\{(.*)\}\}/
      const text = item.textContent
      const vnode = new VNode(item)
      switch (item.nodeType) {
        case Node.ELEMENT_NODE:
          this.compileDirective(<Element>item)
          if (item.childNodes && item.childNodes.length) {
            this.compileElement(item)
          }
          break

        case Node.TEXT_NODE:
          if (reg.test(text)) {
            this.compileText(vnode, reg.exec(text))
          }
          break

        default:
          break
      }
    })
    return el
  }
  compileText(vnode: VNode, regResult: RegExpExecArray) {
    const exp = regResult[1].trim()
    Compile.updateText(vnode, regResult[0], this.vm[exp]) // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, (val: string, oldVal: string) => { // 生成订阅器并绑定更新函数
      Compile.updateText(vnode, regResult[0], val)
    })
  }
  static updateText(vnode: VNode, template: string, value: string) {
    console.log('textContent:' + vnode.template)
    vnode.node.textContent = vnode.template.replace(new RegExp(template, 'g'), value)
  }

  // 编译指令
  compileDirective(node: Element) {
    const removeAttrs = []
    console.log(node.attributes)
    Array.prototype.forEach.call(node.attributes, (item: Attr) => {
      const attrName = item.name
      if (Compile.isEventDirective(attrName)) { // on:xxx
        const exp = item.value
        const dir = attrName.substring(3)
        if (dir && this.vm.methods) {
          node.addEventListener(dir, () => {
            this.vm.methods[exp].call(this.vm)
          })
        }
        removeAttrs.push(attrName)
      } else if (Compile.isDirective(attrName)) { // v-xxx
        const exp = item.value
        const dir = attrName.substring(2)
        if (dir === 'model') {
          (<HTMLInputElement>node).value = this.vm[exp]
          node.addEventListener('input', (e: any) => {
            const newVal = e.target.value
            if (newVal === this.vm[exp]) {
              return
            }
            this.vm[exp] = newVal
          })
          removeAttrs.push(attrName)
          new Watcher(this.vm, exp, (val, oldVal) => {
            (<HTMLInputElement>node).value = val
          })
        }
      }
    })
    removeAttrs.forEach((item: string) => {
      node.removeAttribute(item)
    })
  }
  static isDirective(attrName: string) {
    return /^v-/.test(attrName)
  }
  static isEventDirective(attrName: string) {
    return /^on:/.test(attrName)
  }
}
