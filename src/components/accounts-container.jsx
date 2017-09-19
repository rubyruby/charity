import React, { Component } from 'react';

import AccountsList from './accounts-list';

export function AccountsContainer(props) {
  return (
    <div className="accounts-container">
      <div className="panel-header">
        <h2>Accounts</h2>
      </div>
      <AccountsList accounts={props.accounts}
                    userAddress={props.userAddress} />
    </div>
  );
}

export default AccountsContainer;
