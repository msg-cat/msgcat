import React from 'react';
import MessageDraft from './MessageDraft';
import ChatMessage from './ChatMessage';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="chat">
        {this.props.chat.messages.forEach((m, i) => <ChatMessage {...m} key={i} />)}
        <MessageDraft {...this.props} />
      </div>
    );
  }
}
