import React from 'react';
import world from './world';

import PrivateChats from './sidebar/PrivateChats';
import Subscriptions from './sidebar/Subscriptions';
import ConnectionInfo from './sidebar/ConnectionInfo';

export default class SideBar extends React.Component {
  render() {
    let roster = this.props.roster;
    return (
      <div id="sidebar">
        <ConnectionInfo {...roster.me} />
        <PrivateChats items={roster.privateChats}
                      presence={roster.presence}
                      selected={roster.selected} />
        <Subscriptions items={roster.subscriptions} />
      </div>
    );
  }
}
