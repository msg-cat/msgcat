import React from 'react';

import world from './world';
import SideBar from './SideBar';
import Chat from './Chat';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roster: world.roster.state,
      privateChats: world.privateChats
    };

    this._updateRoster = this._updateRoster.bind(this);
  }

  componentDidMount() {
    world.roster.onChange(this._updateRoster);
  }

  componentWillUnmount() {
    world.roster.removeChangeHandler(this._updateRoster)
  }

  render() {
    let chat = world.privateChats.getChat(this.state.roster.selected);
    let peerPresence = chat && this._getPresence(chat.jid);
    return (
      <div id="main">
        <SideBar {...this.state} />
        {chat && <Chat {...chat} presence={peerPresence} />}
      </div>
    );
  }

  _updateRoster() {
    this.setState({ roster: world.roster.state })
  }

  _getPresence(jid) {
    return this.state.roster.presence[jid] || { show: 'unavailable' };
  }
}
