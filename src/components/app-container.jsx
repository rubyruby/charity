import React, { Component } from 'react';
import Web3 from 'web3';

import App from './app';
import Header from './header';
import Disconnected from './disconnected';

export class AppContainer extends Component {
  constructor(props) {
    super(props);

    const version = localStorage.getItem('charity-version') || 'MetaMask';

    this.state = {
      version: version,
      isConnecting: true,
      isConnected: false
    };

    _.bindAll(this, [
      'handleSwitchVersion'
    ]);
  }
  componentWillMount() {
    this.init(this.state.version);
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.version != this.state.version) {
      this.init(nextState.version);
    }
  }
  init(version) {
    if (version == 'MetaMask') {
      this.onPageLoadAsync()
      // .then(this.delay)
      .then(this.initializeWeb3)
      .then(this.checkNetwork)
      .then(function(networkId) {
        this.setState({
          isConnected: networkId == 3,
          isConnecting: false
        });
      }.bind(this));
    } else {
      this.setState({
        isConnected: true,
        isConnecting: false
      });
    }
  }
  onPageLoadAsync() {
    if (document.readyState === 'complete') {
      return Promise.resolve();
    }
    return new Promise(function(resolve, reject) {
      window.onload = resolve;
    });
  }
  delay() {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, 1500);
    });
  }
  initializeWeb3() {
    if (typeof web3 !== 'undefined') {
      const defaultAccount = web3.eth.defaultAccount;
      window.web3 = new Web3(web3.currentProvider);
      window.web3.eth.defaultAccount = defaultAccount;
    } else {
      window.web3 = new Web3(new Web3.providers.HttpProvider("localhost:8545"));
    }
  }
  checkNetwork() {
    return new Promise(function(resolve, reject) {
      web3.version.getNetwork(function (err, netId) {
        err ? reject(err) : resolve(netId);
      });
    });
  }
  handleSwitchVersion() {
    const version = this.state.version == 'MetaMask' ? 'RailsApi' : 'MetaMask';

    localStorage.setItem('charity-version', version);

    this.setState({
      version: version,
      isConnecting: true,
      isConnected: false
    });
  }
  render() {
    if (this.state.isConnected) {
      return <App version={this.state.version}
                  onSwitchVersion={this.handleSwitchVersion} />;
    } else {
      return (
        <div className="app-container">
          <Header version={this.state.version}
                  onSwitchVersion={this.handleSwitchVersion} />
          <Disconnected isConnecting={this.state.isConnecting} />
        </div>
      );
    }
  }
}

export default AppContainer;
