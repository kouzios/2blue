const { base } = require('../../_config/airtable');
const table = base("Users");

module.exports = async (userid) => {
    const user = (await table.select({filterByFormula: `OR(userid = '${userid}')` }).firstPage())[0];
    return user !== undefined;
};