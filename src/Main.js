import React from 'react';

import world from './world';
import SideBar from './SideBar';
import Chat from './Chat';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roster: world.roster.state
    };
    world.roster.onChange(() => this.setState({ roster: world.roster.state }));
  }

  render() {
    return (
      <div id="main">
        <SideBar {...this.state} />
        <Chat {...this.props} />
      </div>
    );
  }
}
