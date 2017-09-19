import React, { Component } from 'react';

export class Header extends Component {
  constructor(props) {
    super(props);
    _.bindAll(this, [
      'handleSwitchVersionClick'
    ]);
  }
  handleSwitchVersionClick(e) {
    e.preventDefault();
    this.props.onSwitchVersion();
  }
  render() {
    const versionText = this.props.version == 'MetaMask' ? 'MetaMask' : 'Rails Api';
    const switchText = this.props.version == 'MetaMask' ? 'Rails Api' : 'MetaMask';

    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">Charity {versionText}</a>

            <ul className="nav navbar-nav">
              <li>
                <p className="navbar-text">
                  <a href="#" onClick={this.handleSwitchVersionClick}>switch to {switchText} version</a>
                </p>
              </li>
            </ul>
          </div>
          <div className="navbar-collapse collapse">
            {this.props.children}
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
