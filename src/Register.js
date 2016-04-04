import React from 'react';
import Dispatcher from './Dispatcher';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <div id="register">
        {this.props.error && <strong style={{color:'red'}}>{this.props.error}</strong>}
        <form className="register-form" onSubmit={e => this.handleSubmit(e)}>
          <div className="input-row">
            <label htmlFor="#register-host">Host</label>
            <input type="text" id="register-host" value={this.props.host}
                   autoFocus={true}
                   onChange={e => this.handleChange('host', e)} />
          </div>
          <div className="input-row">
            <label htmlFor="#register-username">Username</label>
            <input type="text" id="register-username" value={this.props.username}
                   autoFocus={true}
                   onChange={e => this.handleChange('username', e)} />
          </div>
          <div className="input-row">
            <label htmlFor="#register-password">Password</label>
            <input type="password" id="register-password" value={this.props.password} 
                   onChange={e => this.handleChange('password', e)} />
          </div>
          <div className="input-row">
            <label htmlFor="#register-password-confirmation">Password Confirmation</label>
            <input type="password" id="register-password-confirmation" value={this.props.passwordConfirmation}
                   onChange={e => this.handleChange('passwordConfirmation', e)} />
          </div>
          <div className="input-row">
            <button className="connect"  type="button" onClick={e => this.handleRegister(e)}>Connect Existing</button>
            <button className="register" type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    Dispatcher.dispatch('register');
  }

  handleChange(key, event) {
    Dispatcher.dispatch('update-registration', key, event.target.value);
  }

  handleRegister(e) {
    e.preventDefault();
    Dispatcher.dispatch('go-connect');
  }
}
