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
    this.props.onCreateAccount();
  }
  render() {
    return (
      <div className="alert alert-warning text-center">
        <p>You don't have an account.</p>
        <button className="btn btn-warning authorize-btn" onClick={this.handleClick}>Create an account</button>
      </div>
    );
  }
}

CreateAccountWarning.propTypes = {
  onCreateAccount: PropTypes.func.isRequired
};

export default CreateAccountWarning;
