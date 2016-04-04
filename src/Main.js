import React from 'react';

import world from './world';
import SideBar from './SideBar';
import Conversation from './Conversation';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roster: world.roster.state,
      privateChats: world.privateChats
    };
    world.roster.onChange(() => this.setState({ roster: world.roster.state }));
  }

  render() {
    let chat = world.privateChats.getChat(world.roster.selected);
    return (
      <div id="main">
        <SideBar {...this.state} />
        {chat && <Conversation {...chat} />}
      </div>
    );
  }
}
