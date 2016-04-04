import Dispatcher from '../Dispatcher';

import BasicStore from './BasicStore';
import RosterStore from './RosterStore';
import ChannelsStore from './ChannelsStore';
import PrivateChatsStore from './PrivateChatsStore';

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

    this._setupSubStores();

    // TODO: dispatch this from the real "world" (which controls the layout)!
    if(this.state.connection.status == Strophe.Status.CONNECTED ||
       this.state.connection.status == Strophe.Status.CONNECTING) {
      this.state.connection.status = Strophe.Status.CONNECTING;
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

    Dispatcher.register('disconnect', () => {
      this.state.connection.jid = '';
      this.state.connection.password = '';
      this._changed();
      this.roster.purgeAndReset();
      this.channels.purgeAndReset();
      this.privateChats.purgeAndReset();
      this.connection.disconnect();
    });
  }

  _updateStatus(status) {
    Dispatcher.dispatchLater('update-connection', 'status', status);
    if(status == Strophe.Status.CONNECTED) {
      this.connection.send($pres());
      this.roster.setConnection(this.connection);
      this.channels.setConnection(this.connection);
      this.privateChats.setConnection(this.connection);
    } else if(status == Strophe.Status.DISCONNECTED) {
      this._setupSubStores();
    }
  }

  _setupSubStores() {
    this.roster = new RosterStore(this);
    this.channels = new ChannelsStore(this);
    this.privateChats = new PrivateChatsStore(this);
  }
}
