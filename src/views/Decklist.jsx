import React, {useEffect, useState, useContext} from 'react';
import { IDContext } from '../scripts/id-context';

const Deck = ({...props}) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState("<div/>");

  useEffect(() => {
    loadDecks();
  }, [userID]);

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
              {card.quantity}x {card.name}
          </div>
      ));
      setDisplay(mapped);
    }
  }

  const loadDecks = async () => { 
    let deckID = props.id;
    if(!deckID) {
      deckID = (window.location.search).substring(4);
    }
    try {
      const res = await fetch('/api/decks?type=one&deckID=' + deckID +'&authID='+userID);
      const decks = await res.json();
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
