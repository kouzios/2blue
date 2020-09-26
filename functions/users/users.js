const { base } = require('../_config/airtable');
const routes = require('../_config/routes');

const table = base("Users");
exports.handler =  async (event) => {
  return routes(event, table);
}