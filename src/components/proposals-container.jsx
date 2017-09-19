import React, { Component } from 'react';

import ProposalsList from './proposals-list';
import NewProposalDialog from './new-proposal-dialog';

export class ProposalsContainer extends Component {
  renderCreateBtn() {
    if (!this.props.isMember) {
      return null;
    }

    return (
      <button data-toggle="modal" data-target="#create-proposal-modal" className="btn btn-link pull-right">
        Create new proposal
      </button>
    );
  }
  render() {
    return (
      <div className="proposals-container">
        <div className="panel-header">
          {this.renderCreateBtn()}
          <h2>Proposals</h2>
        </div>
        <ProposalsList proposals={this.props.proposals}
                       isMember={this.props.isMember}
                       onVoteForProposal={this.props.onVoteForProposal}
                       onFinishProposal={this.props.onFinishProposal}
                       onProposalTimePassed={this.props.onProposalTimePassed} />
        <NewProposalDialog accounts={this.props.accounts}
                           userAddress={this.props.userAddress}
                           onSubmit={this.props.onNewProposal} />
      </div>
    );
  }
}

export default ProposalsContainer;
