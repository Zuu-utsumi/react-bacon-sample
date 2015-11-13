var busCache = {}
var Dispatcher = function() {
  this.stream = function(name) {
    return bus(name)
  }

  this.push = function(name, value) {
    bus(name).push(value)
  }

  this.plug = function(name, value) {
    bus(name).plug(value)
  }

  function bus(name) {
    return busCache[name] = busCache[name] || new Bacon.Bus()
  }
}
