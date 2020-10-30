import React, {useEffect, useState, useContext} from 'react';
import { IDContext } from '../scripts/id-context';

const initialLoading = <span className="loading-content">Loading Decks...</span>;
const noDecks = <span className="loading-content">No Decks Found</span>;

const Deck = ({total, openDecklist, ...props}) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState([]);
  const [display, setDisplay] = useState(initialLoading);

  useEffect(() => {
    loadDecks();
    //eslint-disable-next-line
  }, [userID]);

  useEffect(() => {
      formatDecks();
      //eslint-disable-next-line
  }, [decksInfo]);

  const formatDecks = () => {
      if(decksInfo.length > 0) {
        let mapped = decksInfo.map((deck, index) => {
          //Limit displayed deck number to specified total
          if(index < total) {
            return (
              <div onClick={() => openDecklist(deck.id)} key={"deck"+index} id={deck.id} className="clickable">
                  {deck.name}
              </div>
            )
          } else {
            return null
          }
        });
        setDisplay(mapped);
        console.log(mapped)
      } else {
        setDisplay(noDecks);
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
    <div>
        {display}
    </div>
  );
}

export default Deck;
