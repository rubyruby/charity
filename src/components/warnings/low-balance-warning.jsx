import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class LowBalanceWarning extends Component {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleClick'
    ]);
  }
  handleClick(e) {
    e.preventDefault();
    this.disableBtn();
    this.props.onMint();
  }
  disableBtn() {
    this.refs.btn.disabled = true;
  }
  render() {
    return (
      <div className="alert alert-warning text-center">
        <p>Balance of your account is too low.</p>
        <button className="btn btn-warning authorize-btn" onClick={this.handleClick} ref="btn">Mint Ether</button>
      </div>
    );
  }
}

LowBalanceWarning.propTypes = {
  onMint: PropTypes.func.isRequired
};

export default LowBalanceWarning;
