import React from 'react';

export function Disconnected(props) {
  const connectingState = (
    <h2>Connecting to the blockchain...</h2>
  );
  const disconnectedState = (
    <div>
      <h2>Cannot connect to the blockchain.</h2>
      <h3>Check your connection to Ropsten Test Network.</h3>
    </div>
  );

  if (props.isConnecting) {
    return null;
  }

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2 well well-lg text-center disconnected-panel">
        { props.isConnecting ? connectingState : disconnectedState }
      </div>
    </div>
  );
}

export default Disconnected;
