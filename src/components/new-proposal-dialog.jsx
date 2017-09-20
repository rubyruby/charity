import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

export class NewProposalDialog extends Component {
  constructor(props) {
    super(props);
    _.bindAll(this, [
      'handleSubmit',
      'initDialog'
    ]);
  }
  componentDidMount() {
    this.initDialog();
  }
  componentWillUpdate(nextProps) {
    this.defaultAmountValue = 0.2;
    this.defaultAccountValue = nextProps.userAddress;
    this.defaultCommentValue = '';
  }
  handleSubmit(e) {
    e.preventDefault();

    const params = {
      amount: this.refs.amount.value,
      account: this.refs.account.value,
      comment: this.refs.comment.value
    };
    this.props.onSubmit(params);
    this.closeDialog();
  }
  initDialog() {
    $(this.refs.modal).on('show.bs.modal', function () {
      this.refs.amount.value = this.defaultAmountValue;
      this.refs.account.value = this.defaultAccountValue;
      this.refs.comment.value = this.defaultCommentValue;
    }.bind(this));
  }
  closeDialog() {
    $(this.refs.modal).modal('hide');
  }
  renderAccountOptions() {
    if (this.props.accounts.length == 0) {
      return null;
    }

    const currentAccount = _.find(this.props.accounts, { address: this.props.userAddress });
    const orderedAccounts = _.orderBy(this.props.accounts, function(account) {
      return account == currentAccount ? 0 : 1;
    });

    return orderedAccounts.map(function(account) {
      const text = account == currentAccount ? account.address + ' - your account' : account.address;

      return <option key={account.address} value={account.address}>{text}</option>;
    });
  }
  render() {
    return (
      <div className="modal fade" id="create-proposal-modal" ref="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
              <h4 className="modal-title">Create proposal</h4>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="amount">Amount</label> <small><em>(max 2 ether)</em></small>
                  <input type="number" id="amount" name="amount" className="form-control" step="0.01" min="0" max="2" ref="amount" />
                </div>
                <div className="form-group">
                  <label htmlFor="account">Account</label> <small><em>(where to send ether)</em></small>
                  <select id="account" name="account" className="form-control" ref="account">
                    {this.renderAccountOptions()}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="comment">Comment</label> <small><em>(optional)</em></small>
                  <textarea id="comment" name="comment" className="form-control" ref="comment"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

NewProposalDialog.propTypes = {
  accounts: PropTypes.array.isRequired,
  userAddress: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
};

export default NewProposalDialog;
