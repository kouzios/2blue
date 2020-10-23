module.exports = async (userid, table) => (
    (await table.select({filterByFormula: `OR(userid = '${userid}')` }).firstPage())[0]
)