import axios from 'axios';

const MINT_SERVICE_URL = 'https://ropsten-mint.rubyruby.ru/mint';

function MintService() {
}

MintService.prototype.mint = function (address) {
  return new Promise(function(resolve, reject) {
    axios.post(MINT_SERVICE_URL, { address: address })
    .then(function(response) {
      if (response.status == 200 && response.data.success) {
        resolve(response.data.tx);
      } else {
        reject(response.data.error);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

export default new MintService();
