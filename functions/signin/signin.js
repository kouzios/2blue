const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "461948227597-46gn0e30e3deei7nfnfml771fs7t1a9e.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const formattedReturn = require('../_config/formattedReturn');

async function verify(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return formattedReturn(200, {});
    } catch(err) {
        console.error(err);
        return formattedReturn(500, {});
    }
}

exports.handler =  async (event) => {
    if (event.httpMethod === 'POST') {
        const id_token = event.body;
        return verify(id_token);
    } else {
        return formattedReturn(405, {});
    }
}
