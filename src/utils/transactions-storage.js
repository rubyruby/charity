import * as transactionStates from './transaction-states';

const PREFIX = 'charity-tx-';

export function TransactionsStorage(blockchain) {
  this.blockchain = blockchain;
};

TransactionsStorage.prototype.addTransaction = function (tx) {
  tx.state = transactionStates.STATE_PENDING;
  localStorage.setItem(PREFIX + tx.transactionHash, JSON.stringify(tx));
};

TransactionsStorage.prototype.getTransactions = function () {
  const transactionKeys = Object.keys(localStorage).filter(function(key) {
    return key.indexOf(PREFIX) == 0;
  });

  return transactionKeys.map(function(key) {
    return JSON.parse(localStorage.getItem(key));
  });
};

TransactionsStorage.prototype.getPendingTransactions = function () {
  return this.getTransactions().filter(function(tx) {
    return tx && tx.state == transactionStates.STATE_PENDING;
  });
};

TransactionsStorage.prototype.startChecker = function(updateCallback) {
  this.updateCallback = updateCallback;

  this.interval = setInterval(function() {
    this.checkTransactions();
  }.bind(this), 5000);
};

TransactionsStorage.prototype.stopChecker = function() {
  clearInterval(this.interval);
};

TransactionsStorage.prototype.checkTransactions = function () {
  const self = this;

  const pendingTransactions = this.getPendingTransactions();
  _.each(pendingTransactions, function(tx) {
    self.blockchain.checkTransaction(tx).then(function(state) {
      if (state == transactionStates.STATE_SUCCEEDED || state == transactionStates.STATE_FAILED) {
        tx.state = state;
        self.updateTransaction(tx);
      }
    });
  });
};

TransactionsStorage.prototype.updateTransaction = function(transaction) {
  localStorage.setItem(PREFIX + transaction.transactionHash, JSON.stringify(transaction));

  this.updateCallback();
};

export default TransactionsStorage;
