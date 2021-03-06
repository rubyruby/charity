import React, { Component } from 'react';
import Web3 from 'web3';
import axios from 'axios';

import * as appVersions from '../utils/app-versions';

import App from './app';
import Header from './header';
import Disconnected from './disconnected';

import config from '../utils/config';

const API_ENDPOINT = config.apiEndpoint;

export class AppContainer extends Component {
  constructor(props) {
    super(props);

    const version = localStorage.getItem('charity-version') || appVersions.VERSION_RAILS_API;

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
    if (version == appVersions.VERSION_METAMASK) {
      this.initMetaMaskVersion();
    } else {
      this.initRailsApiVersion();
    }
  }
  initMetaMaskVersion() {
    this.onPageLoadAsync()
    .then(this.initializeWeb3)
    .then(this.checkNetwork)
    .then(function(networkId) {
      this.setState({
        isConnected: networkId == 3,
        isConnecting: false
      });
    }.bind(this))
    .catch(function() {
      this.setState({
        isConnected: false,
        isConnecting: false
      });
    }.bind(this));
  }
  initRailsApiVersion() {
    this.pingApi()
    .then(function(result) {
      this.setState({
        isConnected: result.success,
        isConnecting: false
      });
    }.bind(this));
  }
  onPageLoadAsync() {
    if (document.readyState === 'complete') {
      return Promise.resolve();
    }
    return new Promise(function(resolve, reject) {
      window.onload = resolve;
    });
  }
  initializeWeb3() {
    if (typeof web3 !== 'undefined') {
      const defaultAccount = web3.eth.defaultAccount;
      window.web3 = new Web3(web3.currentProvider);
      window.web3.eth.defaultAccount = defaultAccount;
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
  checkNetwork() {
    return new Promise(function(resolve, reject) {
      web3.version.getNetwork(function (err, netId) {
        err ? reject(err) : resolve(netId);
      });
    });
  }
  pingApi() {
    return new Promise(function(resolve, reject) {
      axios.get(API_ENDPOINT + '/ping')
      .then(function(response) {
        if (response.status == 200 && response.data.success) {
          resolve(response.data);
        } else {
          resolve({ success: false });
        }
      })
      .catch(function(error) {
        resolve({ success: false });
      });
    });
  }
  handleSwitchVersion() {
    const version = this.state.version == appVersions.VERSION_METAMASK ? appVersions.VERSION_RAILS_API : appVersions.VERSION_METAMASK;

    localStorage.setItem('charity-version', version);

    this.setState({
      version: version,
      isConnecting: true,
      isConnected: false
    });
  }
  render() {
    if (this.state.isConnecting) {
      return null;
    }

    if (this.state.isConnected) {
      return <App version={this.state.version}
                  onSwitchVersion={this.handleSwitchVersion} />;
    } else {
      return (
        <div className="app-container">
          <Header version={this.state.version}
                  onSwitchVersion={this.handleSwitchVersion} />
          <Disconnected version={this.state.version} />
        </div>
      );
    }
  }
}

export default AppContainer;
