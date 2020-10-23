const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (fields, table) => {
    try {
        const user = await table.create([{ fields }]);
        return formattedReturn(200, {user});
    } catch(err) {
        console.error(err);
        return formattedReturn(500, {});
    }
}