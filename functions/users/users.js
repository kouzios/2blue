const  getUsers  =  require('./get');
const addUser = require('./add');
const updateUser = require('./update');
const deleteUser = require('./delete');
const formattedReturn = require('../formattedReturn');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return await getUsers(event);
  } else if (event.httpMethod === 'POST') {
    return await addUser(event);
  } else if (event.httpMethod === 'PUT') {
    return await updateUser(event);
  } else if (event.httpMethod === 'DELETE') {
    return await deleteUser(event);
  } else {
    return formattedReturn(405, {});
  }
};