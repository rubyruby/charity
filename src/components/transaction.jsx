import React from 'react';

export function Transaction(props) {
  const TYPES = {
    'BecomeMember': 'Become a member transaction',
    'CreateProposal': 'Create proposal transaction',
    'FinishProposal': 'Finish proposal transaction',
    'Vote': 'Vote transaction',
    'Mint': 'Mint Ether transaction'
  }

  const txName = TYPES[props.type];

  return (
    <div className="panel panel-info">
      <div className="panel-body">
        {txName} - <a href={"https://ropsten.etherscan.io/tx/" + props.address} target="_blank">{props.address}</a>
      </div>
    </div>
  );
}

export default Transaction;
