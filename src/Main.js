import React from 'react';
import SideBar from './SideBar';
import Chat from './Chat';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="main">
        <SideBar />
        <Chat />
      </div>
    );
  }
}
