const getAll  =  require('./_operations/getAll');
const getOne = require('./_operations/getOne');
const add = require('./_operations/add');
const update = require('./_operations/update');
const del = require('./_operations/delete');
const formattedReturn = require('../_config/formattedReturn');
const verify = require('../_config/verify');
// const { endpointUrl } = require('airtable');

module.exports = async (event, table) => {
  const param = event.queryStringParameters;
  const userID = await verify(param.authID);
  if(!userID) {
    return formattedReturn(401, {});
  }

  if (event.httpMethod === 'GET') {
    if (param.type === 'all') {
      return await getAll(table, userID);
    } else if(param.type === 'one' && param.deckID){
      return await getOne(table, param.deckID, userID);
    } else {
      return formattedReturn(405, {});
    }
  } else if (event.httpMethod === 'POST') {
    return await add(event, table, userID);
  } else if (event.httpMethod === 'PUT') {
    return await update(event, table);
  } else if (event.httpMethod === 'DELETE') {
    return await del(event, table);
  } else {
    return formattedReturn(405, {});
  }
};