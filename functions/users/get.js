const { table } = require('../airtable');
const formattedReturn = require('../formattedReturn');

module.exports = async (event) => {
  try {
    const users = await table.select().firstPage();
    const formattedUsers = users.map((user) => ({
      id: user.id,
      ...user.fields
    }));
    return formattedReturn(200, formattedUsers);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};