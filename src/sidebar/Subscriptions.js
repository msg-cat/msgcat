import React from 'react';
import Dispatcher from '../Dispatcher';

export default class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    if(this.props.items.length === 0) {
      return <div/>;
    }
    return (
      <div className="subscriptions">
        <h3>Contact Requests</h3>
        <table>
          <tbody>
            {this.props.items.map(sub => this._renderSub(sub))}
          </tbody>
        </table>
      </div>
    );
  }


  _renderSub(sub) {
    return (
      <tr key={sub.from}>
        <td>{sub.from}</td>
        <td><button onClick={() => this._acceptSub(sub.from)}>Accept</button></td>
        <td><button onClick={() => this._rejectSub(sub.from)}>Reject</button></td>
      </tr>
    );
  }

  _acceptSub(jid) {
    Dispatcher.dispatch('accept-subscription', jid);
  }

  _rejectSub(jid) {
    Dispatcher.dispatch('reject-subscription', jid);
  }

}
