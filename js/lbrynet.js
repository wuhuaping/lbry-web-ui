import jsonrpc from './jsonrpc.js';

const connectionString = 'http://localhost:5279/lbryapi';

const lbrynet = new Proxy({}, {
  get: function(target, name) {
    return function(params={}) {
      return new Promise((resolve, reject) => {
        jsonrpc.call(connectionString, name, [params], resolve, reject, reject);
      });
    };
  },
});

export default lbrynet;
