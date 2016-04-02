import React from 'react';
import Dispatcher from './Dispatcher';

export default class MessageDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <div className="message-draft">
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" autoComplete="off" value={this.props.draft.body} onChange={e => this.handleChange(e)} />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    Dispatcher.dispatch('commit-draft');
  }

  handleChange(e) {
    Dispatcher.dispatch('update-draft', e.target.value);
  }
}
