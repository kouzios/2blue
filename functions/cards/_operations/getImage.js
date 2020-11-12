const formattedReturn = require('../../_config/formattedReturn');
const fetch = require("node-fetch");

const images = new Map();

module.exports = async (param) => {
    let cardName = param.title;
    cardName = cardName.replace(" // ", "");

    try {
        const storedImage = images.get(cardName);
        if(storedImage) { //Check to see if we have the image stored
            console.log("Retrieving Stored: " + storedImage);
            return formattedReturn(200, storedImage);
        }

        const res = await fetch('https://api.scryfall.com/cards/named?exact=' + cardName);
        if(res.status !== 200 ){
            return formattedReturn(res.status, {});
        }
        const json = await res.json();
        const faces = json.card_faces;
        let image = [];
        if(faces && faces[0].image_uris) {//If multiple faces, and it's a flip card
            image.push(faces[0].image_uris.normal);
            image.push(faces[1].image_uris.normal);
        } else {
            image.push(json.image_uris.normal);
        }
        images.set(cardName, image);
        console.log("Retrieving New: " + image)
        return formattedReturn(200, image);
    } catch (error) {
        console.log(error);
        return formattedReturn(500, {});
    }
};