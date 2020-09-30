import React, {useEffect, useState, useContext} from 'react';
import { IDContext } from '../scripts/id-context';

const Deck = ({...props}) => {
  const [userID] = useContext(IDContext);
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
    console.log(decksInfo)
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
      const res = await fetch('/api/decks?type=one&deckID=' + props.id+'&authID='+userID);
      const decks = await res.json();
      console.log(decks)
      setDecksInfo(decks);
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
