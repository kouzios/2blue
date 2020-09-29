const {OAuth2Client} = require('google-auth-library');
const { base } = require('../_config/airtable');
const formattedReturn = require('../_config/formattedReturn');

const CLIENT_ID = "461948227597-46gn0e30e3deei7nfnfml771fs7t1a9e.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const table = base("Users");

const findUser = async (userid) => {
    const user = (await table.select({filterByFormula: `OR(userid = '${userid}')` }).firstPage())[0];
    return user !== undefined;
  };

const verify = async (token, fields) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        const userExists = await findUser(userid);

        if(userExists) {
            return formattedReturn(200, {});
        }
        const user = await table.create([{ fields: {userid, ...fields} }]);
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
        return verify(auth_token, user);
    } else {
        return formattedReturn(405, {});
    }
}
