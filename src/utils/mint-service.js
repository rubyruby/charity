import axios from 'axios';

import config from './config';

const MINT_SERVICE_URL = config.mintServiceUrl;

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
