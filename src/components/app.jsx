import React, { Component } from 'react';

import Blockchain from '../utils/blockchain';
import BlockchainApi from '../utils/blockchain-api';
import TransactionsStorage from '../utils/transactions-storage';
import MintService from '../utils/mint-service';

import Header from './header';
import HeaderAccount from './header-account';
import HeaderBalance from './header-balance';
import TransactionsList from './transactions-list';
import ProposalsContainer from './proposals-container';
import AccountsContainer from './accounts-container';

import CreateAccountWarning from './warnings/create-account-warning';
import BecomeMemberWarning from './warnings/become-member-warning';
import LowBalanceWarning from './warnings/low-balance-warning';

const USER_BALANCE_LIMIT = 0.05;

export class App extends Component {
  constructor(props) {
    super(props);

    this.initBlockchain();

    this.state = {
      proposals: [],
      accounts: [],
      transactions: [],
      currentAccountLoaded: false
    };

    _.bindAll(this, [
      'handleVoteForProposal',
      'handleFinishProposal',
      'handleProposalTimePassed',
      'handleCreateAccount',
      'handleBecomeMember',
      'handleMint',
      'handleNewProposal'
    ]);
  }
  componentWillMount() {
    this.transactionsStorage.startChecker(function() {
      this.updateData();
    }.bind(this));

    this.updateData();
  }
  componentWillUnmount() {
    this.transactionsStorage.stopChecker();
  }
  initBlockchain() {
    if (this.props.version == 'MetaMask') {
      this.blockchain = new Blockchain();
    } else {
      this.blockchain = new BlockchainApi();
    }

    this.transactionsStorage = new TransactionsStorage(this.blockchain);
  }
  updateData() {
    this.blockchain.getContractBalance().then(function(balance) {
      this.setState({ balance: balance });
    }.bind(this));

    this.blockchain.getCurrentAccountInfo()
    .then(function(data) {
      this.setState({
        userAddress: data.address,
        userBalance: data.balance,
        isMember: data.isMember,
        currentAccountLoaded: true
      });
    }.bind(this))
    .catch(function(error) {
      console.error(error);
    });

    this.blockchain.getProposals().then(function(proposals) {
      this.setState({ proposals: proposals });
    }.bind(this));

    this.blockchain.getAccounts().then(function(accounts) {
      this.setState({ accounts: accounts });
    }.bind(this));

    this.updateTransactions();
  }
  updateTransactions() {
    this.setState({ transactions: this.transactionsStorage.getPendingTransactions() });
  }
  handleVoteForProposal(proposalIndex, value) {
    this.blockchain.voteForProposal(proposalIndex, value)
    .then(function(txHash) {
      const tx = {
        transactionHash: txHash,
        type: 'Vote'
      };
      this.transactionsStorage.addTransaction(tx);
      this.updateTransactions();
    }.bind(this))
    .catch(function(error) {
      console.error(error)
    });
  }
  handleFinishProposal(proposalIndex) {
    this.blockchain.finishProposal(proposalIndex)
    .then(function(txHash) {
      const tx = {
        transactionHash: txHash,
        type: 'FinishProposal'
      };
      this.transactionsStorage.addTransaction(tx);
      this.updateTransactions();
    }.bind(this))
    .catch(function(error) {
      console.error(error)
    });
  }
  handleCreateAccount() {
    this.blockchain.createAccount()
    .then(function(data) {
      localStorage.setItem('charity-auth-token', data.token);
      this.initBlockchain();
      this.updateData();
    }.bind(this));
  }
  handleBecomeMember() {
    this.blockchain.becomeMember()
    .then(function(txHash) {
      const tx = {
        transactionHash: txHash,
        type: 'BecomeMember'
      };
      this.transactionsStorage.addTransaction(tx);
      this.updateTransactions();
    }.bind(this))
    .catch(function(error) {
      console.error(error);
    });
  }
  handleMint() {
    MintService.mint(this.state.userAddress)
    .then(function(txHash) {
      const tx = {
        transactionHash: txHash,
        type: 'Mint'
      };
      this.transactionsStorage.addTransaction(tx);
      this.updateTransactions();
    }.bind(this))
    .catch(function(error) {
      console.error(error);
    });
  }
  handleNewProposal(params) {
    this.blockchain.newProposal(params)
    .then(function(txHash) {
      const tx = {
        transactionHash: txHash,
        type: 'CreateProposal'
      };
      this.transactionsStorage.addTransaction(tx);
      this.updateTransactions();
    }.bind(this))
    .catch(function(error) {
      console.error(error);
    });
  }
  handleProposalTimePassed(proposalIndex) {
    this.updateData();
  }
  renderWarnings() {
    if (!this.state.currentAccountLoaded) {
      return null;
    }

    if (!this.state.userAddress) {
      return <CreateAccountWarning onCreateAccount={this.handleCreateAccount} />;
    } else if (this.state.userBalance < USER_BALANCE_LIMIT) {
      return <LowBalanceWarning onMint={this.handleMint} />;
    } else if (this.state.userAddress && !this.state.isMember) {
      return <BecomeMemberWarning onBecomeMember={this.handleBecomeMember} />;
    }
  }
  render() {
    return (
      <div className="app">
        <Header version={this.props.version}
                onSwitchVersion={this.props.onSwitchVersion}>
          <HeaderAccount address={this.state.userAddress} balance={this.state.userBalance} />
          <HeaderBalance balance={this.state.balance} />
        </Header>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {this.renderWarnings()}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <TransactionsList transactions={this.state.transactions} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <ProposalsContainer proposals={this.state.proposals}
                                  accounts={this.state.accounts}
                                  userAddress={this.state.userAddress}
                                  isMember={this.state.isMember}
                                  onVoteForProposal={this.handleVoteForProposal}
                                  onFinishProposal={this.handleFinishProposal}
                                  onProposalTimePassed={this.handleProposalTimePassed}
                                  onNewProposal={this.handleNewProposal} />
            </div>
            <div className="col-md-4">
              <AccountsContainer accounts={this.state.accounts}
                                 userAddress={this.state.userAddress} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
