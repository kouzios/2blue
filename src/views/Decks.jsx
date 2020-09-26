import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';

const Deck = () => {
  const [decksInfo, setDecksInfo] = useState([]);
  const [display, setDisplay] = useState("<div/>");
  const [toDeck, setToDeck] = useState({go:false,id:null});

  useEffect(() => {
    loadDecks();
  }, []);

  useEffect(() => {
      formatDecks();
      //eslint-disable-next-line
  }, [decksInfo]);

  const formatDecks = () => {
      if(decksInfo.length > 0) {
        let mapped = decksInfo.map((deck, index) => (
            <div onClick={() => setToDeck({go:true,id:deck.id})} key={"deck"+index} id={deck.id} className="clickable">
                {deck.name}
            </div>
        ));
        setDisplay(mapped);
      }
  }

  const loadDecks = async () => { 
    try {
      const res = await fetch('/api/decks?type=all');
      const decksInfo = await res.json()
      console.log(decksInfo)
      setDecksInfo(decksInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
        {toDeck.go ? <Redirect to={"/decklist?id="+toDeck.id}/> : null}
        {display}
    </div>
  );
}

export default Deck;
