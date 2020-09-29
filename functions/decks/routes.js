const getAll  =  require('./_operations/getAll');
const getOne = require('./_operations/getOne');
const add = require('./_operations/add');
const update = require('./_operations/update');
const del = require('./_operations/delete');
const formattedReturn = require('../_config/formattedReturn');
// const { endpointUrl } = require('airtable');

module.exports = async (event, table) => {
  if (event.httpMethod === 'GET') {
    const param = event.queryStringParameters;
    if (param.type === 'all') {
      return await getAll(event, table);
    } else if(param.type === 'one' && param.id){
      return await getOne(event, table, param.id);
    } else {
      console.log(param)
      return formattedReturn(405, {});
    }
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