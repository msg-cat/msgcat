import React from 'react';
import RosterStore from './stores/RosterStore';
import util from './util';

export default class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.store = new RosterStore();
    this.state = this.store.state;
    this.store.onChange(() => this.setState(this.store.state));
  }

  render() {
    return (
      <div className="roster">
        <h3>Contacts</h3>
        {this._renderAddForm()}
        <ul className="channel-list">
          {this.state.items.map(item => this._renderItem(item))}
        </ul>
        {this.state.subscriptions.length > 0 && this._renderSubscriptions()}
      </div>
    );
  }

  _renderAddForm() {
    return (
      <form onSubmit={e => this._handleAddSubmit(e)}>
        <input type="text" ref="addContactInput" autoComplete="off" />
        <button type="submit">Add</button>
      </form>
    );
  }

  _renderItem(item) {
    return (
      <li className="channel channel-private"
          data-subscription={item.subscription}
          data-presence={this._jidPresence(item.jid)}
          key={item.jid} title={item.jid}>
        <span className="presence-icon">●</span>
        {item.name ? item.name : item.jid}
      </li>
    );
  }

  _renderSubscriptions() {
    return (
      <div className="subscriptions">
        <h3>Contact Requests</h3>
        <table>
          <tbody>
            {this.state.subscriptions.map(sub => this._renderSub(sub))}
          </tbody>
        </table>
      </div>
    );
  }

  _renderSub(sub) {
    return (
      <tr key={sub.from}>
        <td>{sub.from}</td>
        <td><button onClick={() => this._acceptSub(sub.from)}>Accept</button></td>
        <td><button onClick={() => this._rejectSub(sub.from)}>Reject</button></td>
      </tr>
    );
  }

  _handleAddSubmit(e) {
    e.preventDefault();
    let jid = this.refs.addContactInput.value;
    this.store.addContact(jid);
  }

  _jidPresence(jid) {
    let pres = this.state.presence[util.bareJID(jid)];
    return pres ? pres.type : '(n/a)';
  }

  _acceptSub(jid) {
    this.store.acceptSubscription(jid);
  }

  _rejectSub(jid) {
    this.store.rejectSubscription(jid);
  }
}
