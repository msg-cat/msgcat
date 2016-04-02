import strophe from 'strophe';

export default class Client {
  constructor(config) {
    this.config = config;
    this.state = {
      credentials: {
        jid: '',
        password: ''
      }
    };
    this.changeHandlers = [];
  }

  getState() {
    return this.state;
  }

  connect() {
    if(this.conn) {
      this.conn.close();
    }
  }

  update(update) {
    for(let key in update) {
      let parts = key.split('.');
      let prefix = parts.slice(0, parts.length - 1), k = parts.slice(-1)[0];
      let target = prefix.reduce((o, k) => o[k], this.state);
      target[k] = update[key];
    }
    this._changed();
  }

  onChange(handler) {
    this.changeHandlers.push(handler);
  }

  _changed() {
    this.changeHandlers.forEach(h => h(this.state));
  }
}
