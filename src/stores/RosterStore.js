import Dispatcher from '../Dispatcher';

export default class RosterStore {
  constructor() {
    Dispatcher.register('connection', connection => {
      this.connection = connection;
      this.connection.roster.registerCallback(this._rosterChanged.bind(this));
    });

    this.state = {
      items: []
    };

    this._changeHandlers = []
  }

  addContact(jid) {
    this.connection.roster.add(jid, jid.split('@')[0], [], () => {
      console.log('added contact', arguments);
      Dispatcher.dispatch('added-contact', jid);
    });
  }

  onChange(handler) {
    this._changeHandlers.push(handler);
  }

  _rosterChanged(items, ...rest) {
    console.log('ROSTER CHANGED', items, rest);
    this.setState({ items: items })
  }

  _changed() {
    this._changeHandlers.forEach(h => h());
  }
}
