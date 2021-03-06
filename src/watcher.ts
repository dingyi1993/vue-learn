import Dep from './dep'
import Vud from './index'

export default class Watcher {
  value: any
  constructor(public vm: Vud, public exp: string, public cb: Function) {
    this.value = this.get() // 将自己添加到订阅器的操作
  }
  update() {
    console.log('update')
    this.run()
  }
  run() {
    console.log('run')
    const value = this.vm[this.exp]
    const oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  }
  get() {
    Dep.target = this // 缓存自己
    const value = this.vm[this.exp] // 强制执行监听器里的get函数
    Dep.target = null // 释放自己
    return value
  }
}
