var handlers = {};
var dispatching = false;

export default {
  register(type, handler) {
    if(!handlers[type]) {
      handlers[type] = [];
    }
    handlers[type].push(handler);
  },

  dispatch(type, ...args) {
    if(dispatching) {
      throw new Error("Dispatching within dispatch!");
    }
    dispatching = true;
    if(handlers[type]) {
      try {
        handlers[type].forEach(h => h(...args));
      } catch(exc) {
        console.error(exc);
      }
    }
    dispatching = false;
  },

  dispatchLater(...args) {
    setTimeout(() => this.dispatch(...args));
  }
}
