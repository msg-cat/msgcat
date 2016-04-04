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

    if(this.state.register && this.state.register.error) {
      delete this.state.register.error;
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

    Dispatcher.register('go-register', () => {
      this.state.register = {
        host: 'localhost',
        username: '',
        password: '',
        passwordConfirmation: ''
      };
      this._changed();
    });

    Dispatcher.register('go-connect', () => {
      this.state.register = undefined;
      this._changed();
    });

    Dispatcher.register('update-registration', (key, value) => {
      this.state.register[key] = value;
      this._changed();
    });

    Dispatcher.register('register', () => {
      let reg = this.state.register;
      if(reg.password !== reg.passwordConfirmation) {
        reg.error = "Password does not match confirmation";
        this._changed();
        return;
      }
      this.connection = new Strophe.Connection(this.state.connection.boshService);
      this.connection.addHandler((stanza) => {
        console.log('reg stanza', stanza);
        return true;
      });
      this.connection.register.connect(reg.host, status => {
        console.log('reg status', toStatusString(status));
        let error;
        if(status === Strophe.Status.REGISTER) {
          this.connection.register.fields.username = reg.username;
          this.connection.register.fields.password = reg.password;
          this.connection.register.submit();
        } else if(status === Strophe.Status.REGISTERED) {
          this.state.connection.jid = `${reg.username}@${reg.host}`;
          this.state.connection.error = '';
          this.state.register = undefined;
          this._changed();
        } else if(status === Strophe.Status.REGIFAIL) {
          error = "Registration failed";
        } else if(status === Strophe.Status.CONFLICT) {
          error = "The username is already taken!";
        } else if(status === Strophe.Status.NOTACCEPTABLE) {
          error = "Server does not accept this";
        }
        if(error) {
          reg.error = error;
          this.connection.disconnect();
          delete this.connection;
          this._changed();
        }
      });
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
    } else if(status == Strophe.Status.REGISTERED) {
      console.log('NOW REGISTERED');
    }
  }

  _setupSubStores() {
    this.roster = new RosterStore(this);
    this.channels = new ChannelsStore(this);
    this.privateChats = new PrivateChatsStore(this);
  }
}

function toStatusString(status) {
  for(let name in Strophe.Status) {
    if(Strophe.Status[name] === status) {
      return name;
    }
  }
  return 'UNKNOWN(' + status + ')';
}
