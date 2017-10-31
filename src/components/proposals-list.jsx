import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Proposal from './proposal';

export class ProposalsList extends Component {
  renderProposals() {
    return this.props.proposals.map(function(p, idx) {
      return <Proposal key={p.index}
                       index={p.index}
                       yesCount={p.yesCount}
                       noCount={p.noCount}
                       address={p.address}
                       amount={p.amount}
                       text={p.text}
                       dueTime={p.dueTime}
                       hasVoted={p.hasVoted}
                       isFinished={p.isFinished}
                       isPassed={p.isPassed}
                       isMember={this.props.isMember}
                       onVoteClick={this.props.onVoteForProposal}
                       onFinishClick={this.props.onFinishProposal}
                       onTimePassed={this.props.onProposalTimePassed} />;
    }.bind(this));
  }
  render() {
    if (this.props.proposals.length == 0) {
      return <p>There are no proposals yet.</p>
    }

    return this.renderProposals();
  }
}

ProposalsList.propTypes = {
  proposals: PropTypes.array.isRequired,
  isMember: PropTypes.bool,
  onVoteForProposal: PropTypes.func.isRequired,
  onFinishProposal: PropTypes.func.isRequired,
  onProposalTimePassed: PropTypes.func.isRequired,
};

export default ProposalsList;
