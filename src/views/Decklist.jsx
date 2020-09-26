import React, {useEffect, useState} from 'react';

const Deck = ({...props}) => {
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState("<div/>");

  useEffect(() => {
    loadDecks();
    //eslint-disable-next-line
  }, [props.id]);

  useEffect(() => {
      formatDecks();
      // eslint-disable-next-line
  }, [decksInfo]);

  const formatDecks = () => {
    let deck = [];
    if(decksInfo.id != null) {
      deck = JSON.parse(decksInfo.cards);
      let mapped = deck.map((card, index) => (
          <div key={"card"+index}>
              {card.count}x {card.name}
          </div>
      ));
      setDisplay(mapped);
    }
  }

  const loadDecks = async () => { 
    try {
      console.log(props)
      const res = await fetch('/api/decks?type=one&id=' + props.id);
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
