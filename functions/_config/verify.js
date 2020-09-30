const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "461948227597-46gn0e30e3deei7nfnfml771fs7t1a9e.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

module.exports  = async (token) => {
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