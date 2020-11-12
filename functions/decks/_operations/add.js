const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table, userid) => {
  let fields = JSON.parse(event.body);

  //Used to curate the information we store, to save on storage space as airtable cannot handle columns with too much information
  let cards = (fields.cards).map((card) => ({
    name:  card.name,
		types: card.types,
		colors: card.colors,
		convertedManaCost: card.convertedManaCost,
		commander: card.commander,
		quantity: card.quantity,
  }));

  try {
    const created = await table.create([{ 
      "fields": {
        "name": fields.name,
        "cards": JSON.stringify(cards),
        "userid": userid,
        "type": fields.type
      }
     }]);
    return formattedReturn(200, created);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};