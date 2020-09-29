const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table, id) => {
  try {
    const single = await table.find(id);
    const formatted = {
      id: single.id,
      ...single.fields
    };
    return formattedReturn(200, formatted);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};