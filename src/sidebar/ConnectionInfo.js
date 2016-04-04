import React from 'react';
import Dispatcher from '../Dispatcher';

export default class ConnectionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: false
    };
  }

  render() {
    return (
      <div className="connection-info" data-dropdown={this.state.dropdown}>
        <h3>
          {this.props.presence === 'away' ? '(' + this.props.jid + ')' : this.props.jid}
          <span className="dropdown-control" onClick={() => this.setState({
            dropdown: !this.state.dropdown })} />
        </h3>
        {this.state.dropdown && this._renderDropdown()}
      </div>
    );
  }

  _renderDropdown() {
    return (
      <div className="dropdown">
        {this._renderSetAwayItem()}
        {this._renderDisconnectItem()}
      </div>
    );
  }

  _renderSetAwayItem() {
    let label, value;
    if(this.props.presence === 'away') {
      label = "Set myself available";
      value = "available";
    } else {
      label = "Set myself away";
      value = "away";
    }
    return (
      <div className="dropdown-item" onClick={this._itemHandler('set-my-presence', value)}>
        {label}
      </div>
    );
  }

  _renderDisconnectItem() {
    return (
      <div className="dropdown-item" onClick={this._itemHandler('disconnect')}>
        Disconnect
      </div>
    );
  }

  _itemHandler(action, ...args) {
    return () => {
      this.setState({ dropdown: false });
      Dispatcher.dispatch(action, ...args);
    };
  }
}
