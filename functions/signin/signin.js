const {OAuth2Client} = require('google-auth-library');
const { base } = require('../_config/airtable');
const formattedReturn = require('../_config/formattedReturn');

const CLIENT_ID = "461948227597-46gn0e30e3deei7nfnfml771fs7t1a9e.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const table = base("Users");

const userExists = async (userid) => {
    const user = (await table.select({filterByFormula: `OR(userid = '${userid}')` }).firstPage())[0];
    return user !== undefined;
  };

const verify = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload['sub'];;
    } catch(err) {
        console.error(err);
        return null;
    }
}

const create = async (fields) => {
    try {
        const user = await table.create([{ fields }]);
        return formattedReturn(200, {});
    } catch(err) {
        console.error(err);
        return formattedReturn(500, {});
    }
}

exports.handler =  async (event) => {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const auth_token = body.id_token;
        const user = body.user;
        const userid = await verify(auth_token);

        if(!userid) {
            return formattedReturn(401, {});
        }

        if(userExists() === true) {
            return formattedReturn(200, {});
        } else {
            return await create({userid, ...user})
        }
    } else {
        return formattedReturn(405, {});
    }
}
