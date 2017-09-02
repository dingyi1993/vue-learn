export default class VNode {
  template: string
  constructor(public node) {
    this.node = node
    this.template = node.textContent
  }
}
