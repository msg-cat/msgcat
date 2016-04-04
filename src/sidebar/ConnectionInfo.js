import React from 'react';
import Dispatcher from '../Dispatcher';

export default class ConnectionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <div className="connection-info">
        <h3>{this.props.jid}</h3>
        <select onChange={e => this._updatePresence(e)} value={this.props.presence}>
          <option value="available">Available</option>
          <option value="away">Away</option>
        </select>
      </div>
    );
  }

  _updatePresence(e) {
    Dispatcher.dispatch('set-my-presence', e.target.value);
  }
}
