import React from 'react';
import MessageDraft from './MessageDraft';
import ChatMessage from './ChatMessage';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let presenceHint;
    switch(this.props.presence.show) {
    case 'unavailable':
      presenceHint = 'Disconnected';
      break;
    case 'away':
      presenceHint = 'Away';
      break;
    }
    return (
      <div id="chat">
        <h3>
          {this.props.jid}
          {presenceHint && <div className="presence-hint">{presenceHint}</div>}
        </h3>
        <div className="backlog">
          {this.props.messages.forEach((m, i) => <ChatMessage {...m} key={i} />)}
        </div>
        <MessageDraft draft={this.props.draft} />
      </div>
    );
  }
}
