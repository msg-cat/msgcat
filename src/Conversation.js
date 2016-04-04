import React from 'react';
import MessageDraft from './MessageDraft';
import ChatMessage from './ChatMessage';

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('got chat', this.props);
    return (
      <div id="chat">
        <h3>{this.props.jid}</h3>
        {this.props.messages.forEach((m, i) => <ChatMessage {...m} key={i} />)}
        <MessageDraft draft={this.props.draft} />
      </div>
    );
  }
}
