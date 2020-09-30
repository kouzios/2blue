const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table, userID) => {
  const fields = JSON.parse(event.body);
  try {
    const created = await table.create([{ userid:userID, ...fields }]);
    return formattedReturn(200, created);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};