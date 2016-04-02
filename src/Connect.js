import React from 'react';
import Dispatcher from './Dispatcher';

export default class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <div id="connect">
        <h2>Connect</h2>
        {this.props.error && <strong style={{color:'red'}}>{this.props.error}</strong>}
        <form className="connect-form" onSubmit={e => this.handleSubmit(e)}>
          <div className="input-row">
            <label htmlFor="#connect-jid">JID</label>
            <input type="email" id="connect-jid" value={this.props.connection.jid}
                   onChange={e => this.handleChange('jid', e)} />
          </div>
          <div className="input-row">
            <label htmlFor="#connect-password">Password</label>
            <input type="password" id="connect-password" value={this.props.connection.password} 
                   onChange={e => this.handleChange('password', e)} />
          </div>
          <div className="input-row">
            <button type="submit">Connect</button>
          </div>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    Dispatcher.dispatch('connect');
  }

  handleChange(key, event) {
    Dispatcher.dispatch('update-connection', key, event.target.value);
  }
}