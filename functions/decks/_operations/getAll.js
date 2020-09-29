const formattedReturn = require('../_config/formattedReturn');

module.exports = async (event, table) => {
  try {
    const all = await table.select().firstPage();
    const formatted = all.map((user) => ({
      id: user.id,
      ...user.fields
    }));
    return formattedReturn(200, formatted);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};