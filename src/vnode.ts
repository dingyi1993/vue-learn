export default class VNode {
  template: string
  constructor(public node: Node) {
    this.node = node
    this.template = node.textContent
  }
}
