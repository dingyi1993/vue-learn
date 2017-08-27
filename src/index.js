function Vud(options) {
  var self = this
  this.vm = this
  this.data = options.data
  this.methods = options.methods

  // 代理 vm.xxx => vm.data.xxx
  Object.keys(options.data).forEach(function(item) {
    self.proxyKeys(item)
  })
  observer(options.data)
  new Compile(options.el, this.vm)
  return this
}

Vud.prototype = {
  proxyKeys: function(key) {
    var self = this
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        console.log('get');
        return self.data[key]
      },
      set: function(newVal) {
        if (self.data[key] === newVal) {
          return
        }
        console.log('set');
        self.data[key] = newVal
      },
    })
  }
}