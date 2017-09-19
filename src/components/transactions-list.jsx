import React from 'react';

import Transaction from './transaction';

export function TransactionsList(props) {
  return (
    <div>
      {props.transactions.map(function(t) {
        return <Transaction key={t.transactionHash}
                            address={t.transactionHash}
                            type={t.type} />
      })}
    </div>
  );
}

export default TransactionsList;
