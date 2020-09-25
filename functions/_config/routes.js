const get  =  require('../_operations/get');
const add = require('../_operations/add');
const update = require('../_operations/update');
const del = require('../_operations/delete');
const formattedReturn = require('../_config/formattedReturn');

module.exports = async (event, table) => {
  if (event.httpMethod === 'GET') {
    return await get(event, table);
  } else if (event.httpMethod === 'POST') {
    return await add(event, table);
  } else if (event.httpMethod === 'PUT') {
    return await update(event, table);
  } else if (event.httpMethod === 'DELETE') {
    return await del(event, table);
  } else {
    return formattedReturn(405, {});
  }
};