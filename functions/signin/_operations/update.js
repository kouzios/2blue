const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (id, fields, table) => {
  try {
    const updated = (await table.update([{id, fields}]))[0];//[0] as the server ensures no duplicates
    return formattedReturn(200, {...updated.fields});
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};