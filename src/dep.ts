import Watcher from './watcher'

export default class Dep {
  static target: Watcher
  stack: Array<Watcher>
  constructor() {
    this.stack = []
  }
  addSub(target: Watcher) {
    this.stack.push(target)
  }
  notify() {
    for (let i = 0; i < this.stack.length; i++) {
      this.stack[i].update()
    }
  }
}
