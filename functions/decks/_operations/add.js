const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table, userid) => {
  let fields = JSON.parse(event.body);
  try {
    const created = await table.create([{ 
      "fields": {
        "name": fields.name,
        "cards": JSON.stringify(fields.cards).toString(),
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