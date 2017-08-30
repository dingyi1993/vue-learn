export default class VNode {
  constructor(node) {
    this.node = node
    this.template = node.textContent
  }
}
