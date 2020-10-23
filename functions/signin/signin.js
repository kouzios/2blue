const formattedReturn = require('../_config/formattedReturn');
const verify = require('../_config/verify');
const add = require('./_operations/add');
const getOne = require('./_operations/getOne');
const update = require('./_operations/update');
const { base } = require('../_config/airtable');
const airtable = require('../_config/airtable');
const table = base("Users");

exports.handler =  async (event) => {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const auth_token = body.id_token;
        const user = body.user;

        const userid = await verify(auth_token);
        if(!userid) {
            return formattedReturn(401, {});
        }

        const airtableUser = await getOne(userid, table);
        //If user exists already sign in, else store them - then sign in
        if(airtableUser !== undefined) {
            const body = {...airtableUser.fields}
            return formattedReturn(200, body);
        } else {
            return await add({userid, ...user}, table)
        }
    } else if(event.httpMethod === 'PUT') {
        const fields = JSON.parse(event.body);
        const airtableUser = await getOne(fields.userid, table);
        return await update(airtableUser.id, fields, table);
    } else {
        return formattedReturn(405, {});
    }
}
