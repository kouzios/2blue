import React, {useEffect, useState} from 'react';

const Deck = () => {
  const [decksInfo, setDecksInfo] = useState([]);
  const [display, setDisplay] = useState("<div/>");

  useEffect(() => {
    loadDecks();
  }, []);

  useEffect(() => {
      formatDecks();
  }, [decksInfo]);

  const formatDecks = () => {
    let deck = [];
    if(decksInfo.length > 0) {
        deck = JSON.parse(decksInfo[0].cards);
        let mapped = deck.map((card, index) => (
            <div>
                {card.count}x {card.name}
            </div>
        ));
        setDisplay(mapped);
    }
  }

  const loadDecks = async () => { //TODO: Only ask for a specific deck
    try {
      const res = await fetch('/api/decks');
      const decksInfo = await res.json();
      setDecksInfo(decksInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
        {display}
    </div>
  );
}

export default Deck;
