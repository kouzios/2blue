const { base } = require('../../_config/airtable');
const formattedReturn = require('../../_config/formattedReturn');

const table = base("Users");

module.exports = async (fields) => {
    try {
        const user = await table.create([{ fields }]);
        return formattedReturn(200, {});
    } catch(err) {
        console.error(err);
        return formattedReturn(500, {});
    }
}