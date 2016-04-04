import React from 'react';
import _ from 'strophe';

import Main from './Main';
import Register from './Register';
import Connect from './Connect';

import Dispatcher from './Dispatcher';

import world from './world';

const Strophe = window.Strophe;

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = world.state;

    world.onChange(() => this.setState(world.state));

    window.addEventListener('resize', () => this.setState({ windowSize: this._determineSize() }));
    this.state.windowSize = this._determineSize();
  }

  render() {
    return (
      <div>
        <style>{this._css()}</style>
        {this._render()}
      </div>
    );
  }

  _render() {
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
  }

  updateStatus(status) {
    Dispatcher.dispatch('update-connection', 'status', status);
    if(status == Strophe.Status.CONNECTED) {
      this.connection.send($pres());
      Dispatcher.dispatch('connection', this.connection);
    }
  }

  addMessage(msg) {
    let chat = this.state.chat;
    chat.messages = chat.messages.concat([msg]);
    this.setState({ chat: chat });
  }

  // returns current size of the app
  // (this is equal to the window size, but may change in
  //  the future to account for browser quirks)
  _determineSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  // returns dynamic CSS declarations
  _css() {
    let { height, width } = this.state.windowSize;
    return [
      `#sidebar { height: ${height}px; }`,
      `#chat { height: ${height}px; }`,
      `#connect { margin-top: ${(height/2) - 160}px; }`
    ].join('\n');
  }
}

function generateMessageId() {
  return `msgcat-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
}
