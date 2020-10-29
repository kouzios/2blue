const formattedReturn = require('../../_config/formattedReturn');
const fetch = require("node-fetch");

module.exports = async (param) => {
    const cardName = param.title;

    try {
        const res = await fetch('https://api.scryfall.com/cards/named?exact=' + cardName);
        if(res.status !== 200 ){
            return formattedReturn(res.status, {});
        }
        const json = await res.json();
        const faces = json.card_faces;
        let image = null;
        if(faces) {//TODO: Allow flipping
            image = json.card_faces[0].image_uris.small;
        } else {
            image = json.image_uris.small
        }
        return formattedReturn(200, image);
    } catch (error) {
        console.log(error);
        return formattedReturn(500, {});
    }
};