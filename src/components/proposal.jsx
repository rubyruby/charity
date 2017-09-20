import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProposalDueTimer from './proposal-due-timer';

export class Proposal extends Component {
  constructor(props) {
    super(props);
    _.bindAll(this, [
      'handleYesClick',
      'handleNoClick',
      'handleFinishClick',
      'handleTimePassed',
    ]);
  }
  handleYesClick(e) {
    e.preventDefault();
    this.props.onVoteClick(this.props.index, true);
  }
  handleNoClick(e) {
    e.preventDefault();
    this.props.onVoteClick(this.props.index, false);
  }
  handleFinishClick(e) {
    e.preventDefault();
    this.props.onFinishClick(this.props.index);
  }
  handleTimePassed() {
    this.props.onTimePassed(this.props.index);
  }
  isActive() {
    const now = new Date().getTime();
    const due = new Date(this.props.dueTime).getTime();
    return (due - now) > 0;
  }
  renderVoteBtns() {
    if (this.props.isFinished || !this.isActive() || !this.props.isMember || this.props.hasVoted) {
      return null;
    }

    return (
      <div className="pull-right">
        <a href="#" className="text-success proposal-vote-link" onClick={this.handleYesClick}>yes</a>
        <a href="#" className="text-danger proposal-vote-link" onClick={this.handleNoClick}>no</a>
      </div>
    );
  }
  renderFinishBtn() {
    if (this.props.isFinished || this.isActive() || !this.props.isMember) {
      return null;
    }

    return (
      <button className="btn btn-danger proposal-footer-finish-btn"
              onClick={this.handleFinishClick}>Finish proposal</button>
    );
  }
  renderDueTime() {
    if (this.props.isFinished) {
      return <span className="text-muted">Finished at {this.props.dueTime.toString()}</span>
    } else {
      return <ProposalDueTimer dueTime={this.props.dueTime} onTimePassed={this.handleTimePassed} />;
    }
  }
  renderPassedStatus() {
    if (!this.props.isFinished) {
      return null;
    }

    const text = this.props.isPassed ? "Proposal has passed" : "Proposal hasn't passed";
    const classes = this.props.isPassed ? 'pull-right text-success' : 'pull-right text-danger';

    return <span className={classes}><strong>{text}</strong></span>;
  }
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.renderVoteBtns()}
          <h3 className="panel-title">
            <span className="proposal-votes">yes: {this.props.yesCount}</span>
            <span className="proposal-votes">no: {this.props.noCount}</span>
          </h3>
        </div>
        <div className="panel-body">
          <p>Transfer <strong>{this.props.amount} ether</strong> to <strong>{this.props.address}</strong></p>
          {this.props.text}

          <div className="proposal-footer">
            {this.renderDueTime()}
            {this.renderFinishBtn()}
            {this.renderPassedStatus()}
          </div>
        </div>
      </div>
    );
  }
}

Proposal.propTypes = {
  index: PropTypes.number.isRequired,
  dueTime: PropTypes.instanceOf(Date).isRequired,
  isFinished: PropTypes.bool.isRequired,
  isPassed: PropTypes.bool.isRequired,
  isMember: PropTypes.bool.isRequired,
  hasVoted: PropTypes.bool.isRequired,
  yesCount: PropTypes.number.isRequired,
  noCount: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onVoteClick: PropTypes.func.isRequired,
  onFinishClick: PropTypes.func.isRequired,
  onTimePassed: PropTypes.func.isRequired
};

export default Proposal;
