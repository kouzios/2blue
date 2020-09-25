const { base } = require('../_config/airtable');
const routes = require('../_config/routes');

const table = base("Decks");
exports.handler =  async (event) => {
  return routes(event, table);
}
