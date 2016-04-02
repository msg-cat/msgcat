import React from 'react';
import Roster from './Roster';

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="sidebar">
        <Roster {...this.props.roster} />
      </div>
    );
  }
}
