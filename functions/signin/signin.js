const formattedReturn = require('../_config/formattedReturn');
const verify = require('../_config/verify');
const add = require('./_operations/add');
const getOne = require('./_operations/getOne');

exports.handler =  async (event) => {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const auth_token = body.id_token;
        const user = body.user;

        const userid = await verify(auth_token);
        if(!userid) {
            return formattedReturn(401, {});
        }

        const exists = await getOne(userid);
        if(exists === true) {
            return formattedReturn(200, {});
        } else {
            return await add({userid, ...user})
        }
    } else {
        return formattedReturn(405, {});
    }
}
