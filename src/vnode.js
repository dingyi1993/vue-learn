function VNode(node) {
  this.node = node
  this.template = node.textContent
}

export default VNode