export default class BasicStore {
  constructor(initialState, key) {
    this.initialState = initialState;
    this.state = initialState;
    this.key = key;
    this._changeHandlers = [];
    if(key) {
      this._loadState();
    }
  }

  // Installs a handler to be called whenever this store's state changes.
  // This is to be used by components that are interested in this store's
  // state.
  onChange(handler) {
    this._changeHandlers.push(handler);
  }

  removeChangeHandler(handler) {
    this._changeHandlers = this._changeHandlers.filter(h => h !== handler);
  }

  purgeAndReset() {
    if(this.key) {
      delete sessionStorage[this.key];
    }
    this._changeHandlers = [];
    this.state = this.initialState;
  }

  // Called by subclasses, after this.state was modified to notify listeners.
  _changed() {
    if(this.key) {
      this._saveState();
    }
    this._changeHandlers.forEach(h => h());
  }

  _loadState() {
    let data;
    try {
      data = JSON.parse(sessionStorage[this.key]);
    } catch(e) { /* ignore */ }
    if(data) {
      this.state = data;
    }
  }

  _saveState() {
    sessionStorage[this.key] = JSON.stringify(this.state);
  }
}
