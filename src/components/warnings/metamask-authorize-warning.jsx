import React from 'react';

export function MetaMaskAuthorizeWarning(props) {
  return (
    <div className="alert alert-warning text-center">
      <p>You are not authorized. Unlock your account in MetaMask and restart the page to be able to sign transactions.</p>
    </div>
  );
}

export default MetaMaskAuthorizeWarning;
