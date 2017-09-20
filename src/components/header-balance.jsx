import React from 'react';
import PropTypes from 'prop-types';

export function HeaderBalance(props) {
  return (
    <ul className="nav navbar-nav header-balance">
      <li>
        <p className="navbar-text">
          <span>Charity contract balance </span>
          <strong>{props.balance} eth</strong>
        </p>
      </li>
    </ul>
  );
}

HeaderBalance.propTypes = {
  balance: PropTypes.number
};

export default HeaderBalance;
