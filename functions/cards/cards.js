const routes = require('./routes');
const atomic = require('../../cards/AtomicCards.json');

exports.handler =  async (event) => {
  //Convert object keys to lowercase for consistent card pulling
  const data = atomic.data;
  const alteredData = {}; //Used to store data with lowercase keys
  for (const [key, value] of Object.entries(data)) {
    alteredData[key.toLowerCase()] = value;
  }
  return routes(event, alteredData);
}
