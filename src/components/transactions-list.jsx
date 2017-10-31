import React from 'react';
import PropTypes from 'prop-types';

import Transaction from './transaction';

export function TransactionsList(props) {
  return props.transactions.map(function(t) {
    return <Transaction key={t.transactionHash}
                        address={t.transactionHash}
                        type={t.type} />
  });
}

TransactionsList.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default TransactionsList;
