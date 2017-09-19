import React from 'react';

import Utils from '../utils/utils';

export function Account(props) {
  const addressStr = Utils.formatAddress(props.address);
  const addressClasses = props.isCurrent ? 'account-address account-address_active' : 'account-address';
  const balanceClasses = props.isCurrent ? 'account-balance account-balance_active' : 'account-balance';

  return (
    <tr>
      <td>
        <span className={addressClasses} title={props.address}>{addressStr}</span>
      </td>
      <td className="text-right">
        <span className={balanceClasses}>{props.balance}</span>
      </td>
    </tr>
  );
}

export default Account;
