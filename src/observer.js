var observer = function(data) {
  return new Observer(data)
}
Observer = function(data) {
  this.data = data

  var dep = new Dep()
  // var value = data.a
  Object.keys(data).forEach(function(item) {
    defineReactive(data, item, data[item])
  })
}
var defineReactive = function(data, key, val) {
  var dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log('get value: ' + val)
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set: function(newVal) {
      if (newVal === val) {
        return
      }
      console.log('new val is :' + newVal)
      val = newVal
      dep.notify()
    },
  })
}
