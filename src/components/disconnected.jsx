import React from 'react';

export function Disconnected(props) {
  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2 well well-lg text-center disconnected-panel">
        <div>
          <h2>Cannot connect to the blockchain.</h2>
          <h3>Check your connection to Ropsten Test Network.</h3>
        </div>
      </div>
    </div>
  );
}

export default Disconnected;
