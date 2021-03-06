const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (table, deckID, userID) => {
  const filterByFormula = "AND({userid}='"+userID+"', {id}='"+deckID+"')";

  try {
    const single = (await table.select({maxRecords: 1, filterByFormula, }).firstPage())[0];
    return formattedReturn(200, {...single.fields});
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};