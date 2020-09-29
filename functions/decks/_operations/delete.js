const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table) => {
  const { id } = JSON.parse(event.body);
  try {
    const deleted = await table.destroy(id);
    return formattedReturn(200, deleted);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};