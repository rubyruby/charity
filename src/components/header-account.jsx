import React from 'react';

import Utils from '../utils/utils';

export function HeaderAccount(props) {
  if (!props.address) {
    return null;
  }

  const addressStr = Utils.formatAddress(props.address);

  return (
    <ul className="nav navbar-nav navbar-right header-account">
      <li>
        <p className="navbar-text">
          <span title={props.address}>{addressStr}</span>
          <strong className="header-account-balance">{props.balance} eth</strong>
        </p>
      </li>
    </ul>
  )
}

export default HeaderAccount;
