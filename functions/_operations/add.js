const formattedReturn = require('../_config/formattedReturn');

module.exports = async (event, table) => {
  const fields = JSON.parse(event.body);
  try {
    const created = await table.create([{ fields }]);
    return formattedReturn(200, created);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};