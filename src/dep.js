function Dep() {
  this.stack = []
}
Dep.prototype = {
  addSub: function(target) {
    this.stack.push(target)
  },
  notify: function() {
    for (var i = 0; i < this.stack.length; i++) {
      this.stack[i].update()
    }
  },
}
export default Dep
