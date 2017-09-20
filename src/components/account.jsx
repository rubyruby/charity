import React from 'react';
import PropTypes from 'prop-types';

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

Account.propTypes = {
  address: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  isCurrent: PropTypes.bool.isRequired
};

export default Account;
