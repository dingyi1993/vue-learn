export default class Dep {
  constructor() {
    this.stack = []
  }
  addSub(target) {
    this.stack.push(target)
  }
  notify() {
    for (let i = 0; i < this.stack.length; i++) {
      this.stack[i].update()
    }
  }
}
