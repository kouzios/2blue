const getOne = require('./_operations/getOne');
const formattedReturn = require('../_config/formattedReturn');

module.exports = async (event, cards) => {
  const param = event.queryStringParameters;

  if (event.httpMethod === 'GET') {
    return await getOne(param, cards);
  } else {
    return formattedReturn(405, {});
  }
};