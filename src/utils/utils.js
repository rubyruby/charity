export default {
  formatAddress: function(address) {
    return address.substr(0, 10) + "...";
  },
  formatTimeNumber: function(value) {
    return value < 10 ? '0' + value : value;
  }
}
