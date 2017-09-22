import React from 'react';
import PropTypes from 'prop-types';

import * as appVersions from '../utils/app-versions';

export function Disconnected(props) {
  const metamaskError = (
    <div>
      <h2>Cannot connect to the blockchain.</h2>
      <h3>Check your MetaMask plugin and connection to the<br/> Ropsten Test Network.</h3>
    </div>
  );

  const railsApiError = (
    <div>
      <h2>Cannot connect to the Rails API.</h2>
      <h3>We are working on this problem, now you can try the MetaMask version.</h3>
    </div>
  );

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2 well well-lg text-center disconnected-panel">
        {props.version == appVersions.VERSION_METAMASK ? metamaskError : railsApiError}
      </div>
    </div>
  );
}

Disconnected.propTypes = {
  version: PropTypes.oneOf(_.values(appVersions)).isRequired
};

export default Disconnected;
