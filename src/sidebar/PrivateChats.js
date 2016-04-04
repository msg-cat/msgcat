import React from 'react';
import util from '../util';
import Dispatcher from '../Dispatcher';

export default class PrivateChats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      add: false
    };
  }

  render() {
    return (
      <div className="private-chats">
        <h3>
          Private Chats
          <a className="add-contact" onClick={() => this.setState({ add: true })}
             title="Add Contact" />
        </h3>
        {this.state.add && this._renderSubscribeForm()}
        <ul className="channel-list">
          {this.props.items.map(item => this._renderItem(item))}
        </ul>
      </div>
    );
  }

  _renderItem(item) {
    return (
      <li className="channel channel-private"
          data-subscription={item.subscription}
          data-presence={this._jidPresence(item.jid)}
          key={item.jid} title={item.jid}
          data-selected={this.props.selected === item.jid}
          onClick={() => Dispatcher.dispatch('switch-to', util.bareJID(item.jid))}>
        <span className="presence-icon" />
        {item.name ? item.name : item.jid}
      </li>
    );
  }

  _renderSubscribeForm() {
    return (
      <form className="subscribe-form" onSubmit={e => this._handleSubmit(e)}>
        <input type="text" ref="addContactInput" autoComplete="off" />
        <button type="submit">Subscribe</button>
      </form>
    );
  }

  _handleSubmit(e) {
    e.preventDefault();
    let jid = this.refs.addContactInput.value;
    this.setState({ add: false });
    Dispatcher.dispatch('subscribe-contact', jid);
  }

  _jidPresence(jid) {
    let pres = this.props.presence[util.bareJID(jid)];
    let show = pres ? pres.show : 'unavailable';
    return show;
  }
}
