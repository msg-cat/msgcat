import React from 'react';
import RosterStore from './stores/RosterStore';

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
        {this.state.items.map((item, i) => <div key={i}>ROSTER ITEM: {JSON.stringify(item)}</div>)}
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

  _handleAddSubmit(e) {
    e.preventDefault();
    let jid = this.refs.addContactInput.value;
    this.store.addContact(jid);
  }
}
