import React from 'react';
import Main from './Main';
import Register from './Register';
import Login from './Login';

export default class Layout {
  constructor(props) {
    super(props)
    let client = props.client;
    this.state = client.getState();
    client.onChange(state => { this.setState(state) });
  }

  render() {
    if(this.state.loggedIn) {
      return <Main />
    } else if(this.state.register) {
      return <Register />
    } else {
      return <Login />
    }
  }
}
