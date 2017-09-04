export default class VNode {
  template: string
  constructor(public node: Node) {
    this.template = node.textContent
  }
}
