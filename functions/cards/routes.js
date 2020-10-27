const getOne = require('./_operations/getOne');
const getImage = require('./_operations/getImage');
const formattedReturn = require('../_config/formattedReturn');

module.exports = async (event, cards) => {
  const param = event.queryStringParameters;

  if (event.httpMethod === 'GET') {
    return await getImage(param);
  } else {
    return formattedReturn(405, {});
  }
};