const formattedReturn = require('../../_config/formattedReturn');

module.exports = async (param, cards) => {
  const cardName = param.title;

  try {
    const cardInfo = cards[cardName][0];
    if(cardInfo) {
      return formattedReturn(200, cardInfo);
    } else {
      return formattedReturn(400, {});
    }
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};