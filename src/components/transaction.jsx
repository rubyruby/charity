import React from 'react';
import PropTypes from 'prop-types';

import * as types from '../utils/transaction-types';

export function Transaction(props) {
  let txName = ''
  switch (props.type) {
    case types.TYPE_BECOME_MEMBER: txName = 'Become a member transaction'; break;
    case types.TYPE_CREATE_PROPOSAL: txName = 'Create proposal transaction'; break;
    case types.TYPE_FINISH_PROPOSAL: txName = 'Finish proposal transaction'; break;
    case types.TYPE_VOTE: txName = 'Vote transaction'; break;
    case types.TYPE_MINT: txName = 'Mint Ether transaction'; break;
  }

  return (
    <div className="panel panel-info">
      <div className="panel-body">
        {txName} - <a href={"https://ropsten.etherscan.io/tx/" + props.address} target="_blank">{props.address}</a>
      </div>
    </div>
  );
}

Transaction.propTypes = {
  type: PropTypes.oneOf(_.values(types)).isRequired,
  address: PropTypes.string.isRequired
};

export default Transaction;
