import React, {useEffect, useState, useContext} from 'react';
import MTGCard from '../components/MTGCard';
import { IDContext } from '../scripts/id-context';
import { Tooltip, Col, Row, OverlayTrigger } from 'react-bootstrap';
var Chart = require('chart.js');

const initialLoading = <span className="loading-content">Loading Cards...</span>;
const noDecks = <span className="loading-content">No Decks Found</span>;

const defaultColors = new Map([
  ['W', 0],
  ['U', 0],
  ['B', 0],
  ['R', 0],
  ['G', 0],
]);

const WUBRGcolors = [
  'rgba(255, 255, 255, 1)',
  'rgba(52, 135, 203, 1)',
  'rgba(0, 0, 0, 1)',
  'rgba(224, 0, 0, 1)',
  'rgba(0, 138, 14, 1)',
];

const labels = ['White', 'Blue', 'Black', 'Red', 'Green'];

const Deck = ({...props}) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState(initialLoading);
  const [colors, setColors] = useState(defaultColors);

  useEffect(() => {
    loadDecks();
    //eslint-disable-next-line
  }, [userID]);

  useEffect(() => {
    loadDecks();
    //eslint-disable-next-line
  }, [props.id]);

  useEffect(() => {
    if(decksInfo.id != null) {
      formatDecks();
      retrieveColors();
    } else {
      setDisplay(noDecks);
    }
      // eslint-disable-next-line
  }, [decksInfo]);

  useEffect(() => {
    chartColors();
  }, [colors]);

  const renderTooltip = (card) => (
    <Tooltip>
      <MTGCard title={card.name}/>
    </Tooltip>
  )

  const formatDecks = () => {
    const deck = decksInfo.cards
    let mapped = deck.map((card, index) => (
      <Row key={"card"+index}>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(card)}
        >
          <span className="ellipsis default">{card.quantity}x {card.name}</span>
        </OverlayTrigger>
      </Row>
    ));
    setDisplay(mapped);
  }

  const loadDecks = async () => { 
    let deckID = props.id;
    if(!deckID) {
      deckID = (window.location.search).substring(4);
    }
    try {
      const res = await fetch('/api/decks?type=one&deckID=' + deckID +'&authID='+userID);
      let deck = await res.json();
      deck.cards = JSON.parse(deck.cards);
      setDecksInfo(deck);
    } catch (error) {
      console.error(error);
    }
  };

  const chartColors = () => {
    const colorArray = Array.from(colors);
    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
          labels,
          datasets: [{
              label: '# of Votes',
              data: [colorArray[0][1], colorArray[1][1], colorArray[2][1], colorArray[3][1], colorArray[4][1]],
              backgroundColor: WUBRGcolors,
              borderColor: WUBRGcolors,
              borderWidth: 1
          }]
      },
      options: {}
  });
  }

  const retrieveColors = () => {
    const clone = new Map(defaultColors);
    const deck = decksInfo.cards

    const cardColors = deck.map((card) => {
      let colors = card.colors;
      if(colors.length === 0) {
        colors = card.colorIdentity; //Two-faced cards have no color thus need color identity, a mtgjson error
      }
      return colors;
    });

    cardColors.forEach((cardColor) => {
      cardColor.forEach((color) => {
        const colorQuantity = clone.get(color);
        clone.set(color, colorQuantity + 1)
      })
    })
    setColors(clone);
  }

  return (
    <div id="selection">
       <div id="title" className="row h-100 justify-content-around align-items-center">
          <Col md="6" className="pb-2">
              <h3 className="embolden">{ decksInfo.id ? decksInfo.name : null }</h3>
          </Col>
      </div>
      <div id="overlay" className="row h-100 justify-content-around align-items-center">
        <Col id="cards" md="4" className="opacity-layer pb-2">
            {display}
        </Col>
        <Col id="chart" md="4" className="opacity-layer pb-2">
          <canvas id="myChart" width="200" height="200"/>
        </Col>
      </div>
    </div>
  );
}

export default Deck;
