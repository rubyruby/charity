import axios from 'axios';
import BigNumber from 'bignumber.js';

import * as transactionStates from './transaction-states';
import config from './config';

const API_ENDPOINT = config.apiEndpoint;

export function Blockchain() {
  const token = localStorage.getItem('charity-auth-token');
  axios.defaults.headers.common['Authorization'] = "Token token=" + token;
};

Blockchain.prototype.getContractBalance = function() {
  return new Promise(function(resolve, reject) {
    axios.get(API_ENDPOINT + '/contract_balance')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(new BigNumber(response.data.balance).toNumber());
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.getCurrentAccountInfo = function() {
  return new Promise(function(resolve, reject) {
    axios.get(API_ENDPOINT + '/accounts/current')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        // const balance = response.data.balance ? new BigNumber(response.data.balance).toNumber() : 0;
        resolve({
          address: response.data.address,
          balance: response.data.balance ? new BigNumber(response.data.balance).toNumber() : 0,
          isMember: response.data.isMember
        });
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.createAccount = function() {
  return new Promise(function(resolve, reject) {
    axios.post(API_ENDPOINT + '/accounts')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
}

Blockchain.prototype.becomeMember = function() {
  return new Promise(function(resolve, reject) {
    axios.post(API_ENDPOINT + '/accounts/become_member')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(response.data.txHash);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.getProposals = function() {
  function wrapProposal(proposal) {
    return {
      ...proposal,
      amount: new BigNumber(proposal.amount).toNumber(),
      dueTime: new Date(proposal.dueTime)
    };
  };

  return new Promise(function(resolve, reject) {
    axios.get(API_ENDPOINT + '/proposals')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        const wrappedProposals = response.data.proposals.map(function(proposal) {
          return wrapProposal(proposal);
        });
        resolve(wrappedProposals);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.getAccounts = function () {
  function wrapAccount(account) {
    return {
      ...account,
      balance: new BigNumber(account.balance).toNumber()
    };
  };

  return new Promise(function(resolve, reject) {
    axios.get(API_ENDPOINT + '/accounts')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        const wrappedAccounts = response.data.accounts.map(function(account) {
          return wrapAccount(account);
        });
        resolve(wrappedAccounts);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.newProposal = function(params) {
  return new Promise(function(resolve, reject) {
    axios.post(API_ENDPOINT + '/proposals', params)
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(response.data.txHash);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.voteForProposal = function(proposalIndex, value) {
  return new Promise(function(resolve, reject) {
    axios.post(API_ENDPOINT + '/proposals/' + proposalIndex + '/vote', { value: value })
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(response.data.txHash);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.finishProposal = function(proposalIndex) {
  return new Promise(function(resolve, reject) {
    axios.post(API_ENDPOINT + '/proposals/' + proposalIndex + '/finish')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(response.data.txHash);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

Blockchain.prototype.checkTransaction = function(transaction) {
  return new Promise(function(resolve, reject) {
    axios.get(API_ENDPOINT + '/transactions/' + transaction.transactionHash + '/status')
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        let state = transactionStates.STATE_PENDING;
        if (response.data.status.succeeded) {
          state = transactionStates.STATE_SUCCEEDED;
        } else if (response.data.status.failed) {
          state = transactionStates.STATE_FAILED;
        }

        resolve(state);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

export default Blockchain;
