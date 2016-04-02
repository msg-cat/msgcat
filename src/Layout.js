import React from 'react';
import _ from 'strophe';

import Main from './Main';
import Register from './Register';
import Connect from './Connect';

import Dispatcher from './Dispatcher';

const Strophe = window.Strophe;

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      connection: {
        boshService: props.server,
        jid: '',
        password: ''
      },
      chat: {
        messages: []
      },
      state: undefined,
      draft: '',
      recipient: '',
      roster: {}
    };

    this.restoreState();

    Dispatcher.register('update-connection', (key, value) => {
      let conn = this.state.connection;
      conn[key] = value;
      this.setState({ connection: conn })
    });

    Dispatcher.register('connect', () => {
      this.connection = new Strophe.Connection(this.state.connection.boshService);
      this.connection.connect(this.state.connection.jid,
                              this.state.connection.password,
                              status => this.updateStatus(status));
    });

    Dispatcher.register('update-draft', body => this.setState({ draft: body }));
    Dispatcher.register('update-recipient', recipient => this.setState({ recipient: recipient }));
    Dispatcher.register('commit-draft', body => {
      let msg = $msg({
        to: this.state.recipient,
        body: body,
        type: 'chat',
        id: generateMessageId()
      })
      this.connection.send(msg);
      this.addMessage(msg);
    });
  }

  render() {
    this.saveState();
    switch(this.state.connection.status) {
    case Strophe.Status.ERROR:
      return <Connect {...this.state} error={"Something went wrong. Not sure what."} />;
    case Strophe.Status.CONNECTING:
      return <em>Connecting...</em>;
    case Strophe.Status.AUTHENTICATING:
      return <em>Authenticasting...</em>;
    case Strophe.Status.AUTHFAIL:
      return <Connect {...this.state} error={"Authentication failed!"} />;
    case Strophe.Status.CONNECTED:
      return <Main {...this.state} />
    case Strophe.Status.DISCONNECTED:
    case Strophe.Status.DISCONNECTING:
    case undefined:
      return <Connect {...this.state} />
    default:
      return <strong>Not sure: {this.state.connection.status}</strong>;
    }
    // if(this.state.connected) {
    //   return <Main {...this.state} />
    // } else {
    
    // }
  }

  updateStatus(status) {
    Dispatcher.dispatch('update-connection', 'status', status);
  }

  saveState() {
    sessionStorage.msgcatState = JSON.stringify(this.state);
  }

  restoreState() {
    try {
      this.state = JSON.parse(sessionStorage.msgcatState)
    } catch(e) { /* ignore */ }

    if(this.state.connection.status == Strophe.Status.CONNECTED) {
      Dispatcher.dispatchLater('connect');
    }
  }

  addMessage(msg) {
    let chat = this.state.chat;
    chat.messages = chat.messages.concat([msg]);
    this.setState({ chat: chat });
  }
}

function generateMessageId() {
  return `msgcat-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
}
