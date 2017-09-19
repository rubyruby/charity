import React, { Component } from 'react';

export class LowBalanceWarning extends Component {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleClick'
    ]);
  }
  handleClick(e) {
    e.preventDefault();
    this.props.onMint();
  }
  render() {
    return (
      <div className="alert alert-warning text-center">
        <p>Balance of your account is too low.</p>
        <button className="btn btn-warning authorize-btn" onClick={this.handleClick}>Mint Ether</button>
      </div>
    );
  }
}

export default LowBalanceWarning;
