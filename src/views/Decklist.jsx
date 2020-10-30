import React, {useEffect, useState, useContext} from 'react';
import MTGCard from '../components/MTGCard';
import { IDContext } from '../scripts/id-context';
import { Tooltip, Col, Row, OverlayTrigger } from 'react-bootstrap';

const initialLoading = <span className="loading-content">Loading Cards...</span>;
const noDecks = <span className="loading-content">No Decks Found</span>;

const Deck = ({...props}) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState(initialLoading);

  useEffect(() => {
    loadDecks();
    //eslint-disable-next-line
  }, [userID]);

  useEffect(() => {
    loadDecks();
    //eslint-disable-next-line
  }, [props.id]);

  useEffect(() => {
      formatDecks();
      // eslint-disable-next-line
  }, [decksInfo]);

  const renderTooltip = (card) => (
    <Tooltip>
      <MTGCard title={card.name}/>
    </Tooltip>
  )

  const formatDecks = () => {
    let deck = [];
    if(decksInfo.id != null) {
      deck = JSON.parse(decksInfo.cards);
      let mapped = deck.map((card, index) => (
        <Row key={"card"+index}>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(card)}
          >
            <span className="default">{card.quantity}x {card.name}</span>
          </OverlayTrigger>
        </Row>
      ));
      setDisplay(mapped);
    } else {
      setDisplay(noDecks);
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
    <div id="selection">
      <div id="overlay" className="row h-100 justify-content-around align-items-center">
          <Col id="opacity-layer" className="no-flex pb-2">
              <Row><h3>{ decksInfo.id ? decksInfo.name : null }</h3></Row>
              <hr/>
              {display}
          </Col>
      </div>
    </div>
  );
}

export default Deck;
