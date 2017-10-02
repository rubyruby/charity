import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TransactionsList from './transactions-list';

export class TransactionsContainer extends Component {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleHideTransactionsClick'
    ]);
  }
  handleHideTransactionsClick(e) {
    e.preventDefault();
    this.props.onHideTransactions();
  }
  render() {
    if (this.props.transactions.length == 0) {
      return null;
    }

    return (
      <div className="row transactions-container">
        <div className="col-md-8">
          <TransactionsList transactions={this.props.transactions} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-default" onClick={this.handleHideTransactionsClick}>
            Hide pending transactions
          </button>
        </div>
      </div>
    );
  }
}

TransactionsContainer.propTypes = {
  transactions: PropTypes.array.isRequired,
  onHideTransactions: PropTypes.func.isRequired
};

export default TransactionsContainer;
