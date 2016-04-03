import Dispatcher from '../Dispatcher';

import BasicStore from './BasicStore';
import RosterStore from './RosterStore';

export default class ConnectionStore extends BasicStore {
  constructor(config) {
    super({
      connection: {
        boshService: config.server,
        jid: '',
        password: '',
        status: undefined
      }
    }, 'connection-store');

    this.roster = new RosterStore();

    if(this.state.connection.status == Strophe.Status.CONNECTED) {
      Dispatcher.dispatchLater('connect');
    }

    Dispatcher.register('update-connection', (key, value) => {
      this.state.connection[key] = value;
      this._changed();
    });

    Dispatcher.register('connect', (key, value) => {
      this.connection = new Strophe.Connection(this.state.connection.boshService);
      this.connection.addHandler(stanza => {
        console.log('stanza', stanza);
        return true;
      });
      this.connection.connect(
        this.state.connection.jid,
        this.state.connection.password,
        status => this._updateStatus(status)
      );
    });
  }

  _updateStatus(status) {
    Dispatcher.dispatch('update-connection', 'status', status);
    if(status == Strophe.Status.CONNECTED) {
      this.connection.send($pres());
      this.roster.setConnection(this.connection);
    }
  }

}
