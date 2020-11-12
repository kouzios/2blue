const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (event, table, userid, cards) => {
	let fields = JSON.parse(event.body);
	let invalidCards = [];
	const importedCards = fields.cards;

	const formattedCards = importedCards.map((card) => {
		const quantity = card.substr(0, card.indexOf('x'));
		let curatedCard = {};

		let cardName = card.substr(card.indexOf('x')+1)
		cardName = cardName.toLowerCase().trim();

		let commander = cardName.substr(0, cardName.indexOf('*cmdr*'));
		commander = commander.trim();

		if(commander !== "") { //If our card is a commander
			cardName = commander;
			commander = true;
		} else {
			commander = false;
		}

		let cardInfo = cards[cardName];

		if(!cardInfo) {
			invalidCards.push(cardName);
			return null;
		}

		if(cardInfo.length > 1) {//If dual sided card, pick first side else just use the card
			cardInfo = cardInfo[1];
		} else {
			cardInfo = cardInfo[0]; 
		}

		//Used to curate the information we store, to save on storage space as airtable cannot handle columns with too much information
		curatedCard.name = cardInfo.name;
		curatedCard.types = cardInfo.types;
		curatedCard.colors = cardInfo.colors;
		curatedCard.convertedManaCost = cardInfo.convertedManaCost;
		curatedCard.commander = commander;
		curatedCard.quantity = quantity;

		
		return curatedCard;
	})

	if(invalidCards.length > 0) {//TODO: Flip cards are invalid because they have no //
		//TODO: Different import for mtggolfish
		console.log(invalidCards);
		return formattedReturn(500, {invalid: invalidCards});
	}

  try {
    const created = await table.create([{ 
      "fields": {
        "name": fields.name,
        "cards": JSON.stringify(formattedCards),
        "userid": userid,
        "type": fields.type
      }
     }]);
    return formattedReturn(200, created);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};