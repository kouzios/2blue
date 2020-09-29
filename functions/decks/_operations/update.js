const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table) => {
  const { id, ...fields } = JSON.parse(event.body);
  try {
    const updated = await table.update([{ id, fields }]);
    return formattedReturn(200, updated);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};