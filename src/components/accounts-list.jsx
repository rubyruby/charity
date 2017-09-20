import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Account from './account';

export class AccountsList extends Component {
  renderAccounts() {
    const currentAccount = _.find(this.props.accounts, { address: this.props.userAddress });

    const orderedAccounts = _.orderBy(this.props.accounts, function(account) {
      return account == currentAccount ? 0 : 1;
    });

    return orderedAccounts.map(function(account, idx) {
      return <Account key={account.address}
                      address={account.address}
                      balance={account.balance}
                      isCurrent={account == currentAccount} />;
    });
  }
  render() {
    if (this.props.accounts.length == 0) {
      return <p>There are no accounts yet.</p>
    }

    return (
      <table className="table">
        <tbody>
          {this.renderAccounts()}
        </tbody>
      </table>
    );
  }
}

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  userAddress: PropTypes.string
};

export default AccountsList;
