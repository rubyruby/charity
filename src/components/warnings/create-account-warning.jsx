import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class CreateAccountWarning extends Component {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleClick'
    ]);
  }
  handleClick(e) {
    e.preventDefault();
    this.disableBtn();
    this.props.onCreateAccount();
  }
  disableBtn() {
    this.refs.btn.disabled = true;
  }
  render() {
    return (
      <div className="alert alert-warning text-center">
        <p>You don't have an account.</p>
        <button className="btn btn-warning authorize-btn" onClick={this.handleClick} ref="btn">Create an account</button>
      </div>
    );
  }
}

CreateAccountWarning.propTypes = {
  onCreateAccount: PropTypes.func.isRequired
};

export default CreateAccountWarning;
