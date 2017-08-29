import { observer } from './observer';
import Compile from './compile';
// import add from 'lodash/add';

// console.log(add);

export default class Vud {
  constructor(options) {
    this.vm = this
    this.data = options.data
    this.methods = options.methods

    // 代理 vm.xxx => vm.data.xxx
    Object.keys(options.data).forEach((item) => {
      this.proxyKeys(item)
    })
    observer(options.data)
    new Compile(options.el, this.vm)
    return this
  }
  proxyKeys(key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log('get');
        return this.data[key]
      },
      set(newVal) {
        if (this.data[key] === newVal) {
          return
        }
        console.log('set');
        this.data[key] = newVal
      },
    })
  }
}
