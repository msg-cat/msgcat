import React from 'react';

export default class ChatMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <div className="chat-message">
        <div className="from">{this.props.from}</div>
        <div className="body">{this.props.body}</div>
      </div>
    );
  }
}
