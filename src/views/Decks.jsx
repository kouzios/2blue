import React, {useEffect, useState, useContext} from 'react';
import { IDContext } from '../scripts/id-context';

const Deck = ({...props}) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState([]);
  const [display, setDisplay] = useState("<div/>");
  const [toDeck, setToDeck] = useState({go:false,id:null});

  useEffect(() => {
    loadDecks();
  }, [userID]);

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
      const res = await fetch('/api/decks?type=all&authID='+userID);
      const decksInfo = await res.json()
      setDecksInfo(decksInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
        {toDeck.go ? <div onClick={props.openDecklist(toDeck.id)}/> : null}
        {display}
    </div>
  );
}

export default Deck;
