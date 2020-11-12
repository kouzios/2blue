const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (param, cards) => {
  const cardName = param.title;

  try {
    let card = cards[cardName];
    
    if(card && card.length > 0) {//If valid card
      if(card.length > 1) {//If dual sided card, pick first side else just use the card
        card = cards[cardName][1];
      } else {
        card = cards[cardName][0]; 
      }
      return formattedReturn(200, card);
    } else {
      return formattedReturn(400, {});
    }
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};