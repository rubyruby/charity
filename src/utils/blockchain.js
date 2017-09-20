const PROPOSALS_LIMIT = 100;
const ACCOUNTS_LIMIT = 100;

import * as transactionStates from './transaction-states';
import * as contract from '../contracts/Charity.json';

export function Blockchain() {
  const MyContract = web3.eth.contract(contract.abi);
  this.contractInstance = MyContract.at(contract.address);
  this.address = web3.eth.coinbase;
};

Blockchain.prototype.getContractBalance = function () {
  return new Promise(function(resolve, reject) {
    web3.eth.getBalance(this.contractInstance.address, function(err, res) {
      err ? reject(err) : resolve(web3.fromWei(res).toNumber());
    });
  }.bind(this));
};

Blockchain.prototype.getCurrentAccountInfo = function() {
  const address = this.address;
  if (address == undefined) {
    return Promise.resolve({});
  }

  const balancePromise = new Promise(function(resolve, reject) {
    web3.eth.getBalance(address, function(err, res) {
      err ? reject(err) : resolve(web3.fromWei(res).toNumber());
    });
  });

  const authorizedPromise = new Promise(function(resolve, reject) {
    this.contractInstance.isMember(address, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  }.bind(this));

  return new Promise(function(resolve, reject) {
    Promise.all([balancePromise, authorizedPromise]).then(function(data) {
      resolve({
        address: address,
        balance: data[0],
        isMember: data[1]
      });
    });
  });
};

Blockchain.prototype.becomeMember = function() {
  return new Promise(function(resolve, reject) {
    this.contractInstance.addMember(this.address, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  }.bind(this));
};

Blockchain.prototype.getProposals = function() {
  function wrapProposal(p, index) {
    const dueTime = new Date(p[3].toNumber() * 1000);
    const votesCount = p[6].toNumber();
    const votesSum = p[7].toNumber();
    return {
      index: index,
      address: p[0],
      amount: web3.fromWei(p[1]).toNumber(),
      text: p[2],
      dueTime: dueTime,
      isFinished: p[4],
      isPassed: p[5],
      hasVoted: p[8].toNumber() != 0,
      yesCount: (votesCount + votesSum) / 2,
      noCount: (votesCount - votesSum) / 2
    };
  };

  const self = this;
  return new Promise(function(resolve, reject) {
    self.contractInstance.numProposals(function(err, res) {
      const count = res.toNumber();
      const to = count;
      const from = count > PROPOSALS_LIMIT ? count - PROPOSALS_LIMIT : 0;

      const proposalPromises = _.range(from, to).map(function(index) {
        return new Promise(function(resolve, reject) {
          self.contractInstance.getProposal(self.address, index, function(err, res) {
            err ? reject(err) : resolve(res);
          });
        });
      });
      Promise.all(proposalPromises).then(function(proposals) {
        let wrappedProposals = proposals.map(function(proposal, index) {
          return wrapProposal(proposal, index);
        });
        wrappedProposals = wrappedProposals.sort(function(a, b) { return a.index - b.index; }).reverse();

        resolve(wrappedProposals);
      });
    });
  });
};

Blockchain.prototype.getAccounts = function () {
  function wrapAccount(account, balance) {
    return {
      address: account,
      balance: web3.fromWei(balance).toNumber()
    };
  };

  const self = this;
  return new Promise(function(resolve, reject) {
    self.contractInstance.numMembers(function(err, res) {
      const count = res.toNumber();
      const to = count + 1;
      const from = count > ACCOUNTS_LIMIT ? count - ACCOUNTS_LIMIT + 1 : 1;

      const accountPromises = _.range(from, to).map(function(index) {
        return new Promise(function(resolve, reject) {
          self.contractInstance.members(index, function(err, res) {
            err ? reject(err) : resolve(res);
          });
        });
      });

      Promise.all(accountPromises).then(function(accounts) {
        const balancePromises = accounts.map(function(account) {
          return new Promise(function(resolve, reject) {
            web3.eth.getBalance(account, function(err, res) {
              err ? reject(err) : resolve(res);
            });
          });
        });

        Promise.all(balancePromises).then(function(balances) {
          const wrappedAccounts = accounts.map(function(account, index) {
            return wrapAccount(account, balances[index])
          });

          resolve(wrappedAccounts);
        });
      });
    });
  });
};

Blockchain.prototype.voteForProposal = function(proposalIndex, value) {
  return new Promise(function(resolve, reject) {
    this.contractInstance.vote(proposalIndex, value, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  }.bind(this));
};

Blockchain.prototype.finishProposal = function(proposalIndex) {
  return new Promise(function(resolve, reject) {
    this.contractInstance.executeProposal(proposalIndex, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  }.bind(this));
};

Blockchain.prototype.newProposal = function(params) {
  const weiAmount = web3.toWei(params.amount);
  return new Promise(function(resolve, reject) {
    this.contractInstance.newProposal(params.account, weiAmount, params.comment, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  }.bind(this));
};

Blockchain.prototype.checkTransaction = function(transaction) {
  const txPromise = new Promise(function(resolve, reject) {
    web3.eth.getTransaction(transaction.transactionHash, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  });

  const txReceiptPromise = new Promise(function(resolve, reject) {
    web3.eth.getTransactionReceipt(transaction.transactionHash, function(err, res) {
      err ? reject(err) : resolve(res);
    });
  });

  return new Promise(function(resolve, reject) {
    Promise.all([txPromise, txReceiptPromise]).then(function(res) {
      const tx = res[0];
      const txReceipt = res[1];
      const succeeded = txReceipt && txReceipt.blockNumber && txReceipt.gasUsed < tx.gas;
      const failed = txReceipt && txReceipt.blockNumber && txReceipt.gasUsed == tx.gas;

      let state = transactionStates.STATE_PENDING;
      if (succeeded) {
        state = transactionStates.STATE_SUCCEEDED;
      } else if (failed) {
        state = transactionStates.STATE_FAILED;
      }

      resolve(state);
    });
  });
};

export default Blockchain;
