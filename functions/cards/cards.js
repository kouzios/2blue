const routes = require('./routes');
const atomic = require('../../cards/AtomicCards.json');

exports.handler =  async (event) => {
  return routes(event, atomic.data);
}
