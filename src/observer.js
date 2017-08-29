import Dep from './dep';

class Observer {
  constructor(data) {
    this.data = data

    const dep = new Dep()
    // const value = data.a
    Object.keys(data).forEach((item) => {
      defineReactive(data, item, data[item])
    })
  }
}

const defineReactive = (data, key, val) => {
  const dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('get value: ' + val)
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      console.log('new val is :' + newVal)
      val = newVal
      dep.notify()
    },
  })
}

export const observer = (data) => {
  return new Observer(data)
}
