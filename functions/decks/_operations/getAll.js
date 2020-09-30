const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (table, userID) => {
  const filterByFormula = "AND({userid}='"+userID+"')";
  try {
    const all = await table.select({filterByFormula}).firstPage();
    const formatted = all.map((entry) => ({
      id: entry.id,
      ...entry.fields
    }));
    return formattedReturn(200, formatted);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};