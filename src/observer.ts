import Dep from './dep'

export default class Observer {
  constructor(public data: any) {
    const dep = new Dep()
    // const value = data.a
    Object.keys(data).forEach((item: string) => {
      Observer.defineReactive(data, item, data[item])
    })
  }
  static defineReactive(data: any, key: string, val) {
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
        // tslint:disable-next-line:no-param-reassign
        val = newVal
        dep.notify()
      },
    })
  }
}

export const observer = data => new Observer(data)
