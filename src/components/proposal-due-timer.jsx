import React, { Component } from 'react';

import Utils from '../utils/utils';

export class ProposalDueTimer extends Component {
  constructor(props) {
    super(props);

    this.state = { secondsLeft: 0 };

    _.bindAll(this, [
      'update'
    ]);
  }
  componentWillMount() {
    this.update();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.secondsLeft == 0 && prevState.secondsLeft > 0) {
      this.props.onTimePassed();
    }
  }
  update() {
    const now = new Date().getTime();
    const due = new Date(this.props.dueTime).getTime();
    const diff = Math.floor((due - now) / 1000);
    const secondsLeft = diff > 0 ? diff : 0;

    this.setState({
      secondsLeft: secondsLeft
    });

    if (secondsLeft > 0) {
      setTimeout(this.update, 1000);
    }
  }
  render() {
    const minutes = Math.floor(this.state.secondsLeft / 60);
    const seconds = this.state.secondsLeft - minutes * 60;

    return (
      <span className="text-muted">
        Finishes in {Utils.formatTimeNumber(minutes)}:{Utils.formatTimeNumber(seconds)}
      </span>
    );
  }
}

export default ProposalDueTimer;
