import React, {useEffect, useState, useContext} from 'react';
import MTGCardOverlay from '../components/MTGCardOverlay';
import { IDContext } from '../scripts/id-context';
import { Container, Tooltip, Col, Row, OverlayTrigger } from 'react-bootstrap';
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

const colorLabels = {
  'W':'rgba(255, 255, 255, 1)',
  'U': 'rgba(52, 135, 203, 1)',
  'B': 'rgba(0, 0, 0, 1)',
  'R': 'rgba(224, 0, 0, 1)',
  'G': 'rgba(0, 138, 14, 1)',
}

const Deck = ({ ...props }) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState(initialLoading);
  const [colors, setColors] = useState(defaultColors);
  const [stats, setStats] = useState(null);

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
      retrieveStats();
    } else {
      setDisplay(noDecks);
    }
    // eslint-disable-next-line
  }, [decksInfo]);

  useEffect(() => {
    chartColors();
    // eslint-disable-next-line
  }, [colors]);

  const renderTooltip = (card) => (
    <Tooltip className="mtg-container">
      <MTGCardOverlay title={card.name}/>
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
    var ctx = document.getElementById('myChart').getContext('2d');
    let chart = {data:[], labels: [], colorValues: []};

    let val;
    const keysIterator = colors.keys();
    const valueIterator = colors.values();
    //Iterate through all colors
    while((val = valueIterator.next().value) !== undefined) {
      const key = keysIterator.next().value;
      if (val <= 0) //Ensure we only store active colors (at least 1 card of the color)
        continue;
      chart.data.push(val);
      chart.labels.push(key)
      chart.colorValues.push(colorLabels[key]);
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
          labels: chart.labels,
          datasets: [{
            data: chart.data,
            backgroundColor: chart.colorValues,
            borderColor: chart.colorValues,
            borderWidth: 1,
          }]
      },
      options: {
        title: {
          display: true,
          text: 'Card Colors',
          fontColor: 'white',
          fontStyle: 'bold',
          fontSize: '28',
        }
      }
  });
  }

  const retrieveColors = () => {
    const clone = new Map(defaultColors);
    const deck = decksInfo.cards;

    //TODO: Fix double sided cards acting as the second side
    //Map cards to only store their quantity, then summate them ex: W=>1, U=>2, B=>1, R=>0, G=>0 can become WUBU
    const cardColors = deck.map((card) => card.colors).reduce((sum, current)=>sum+current).toString();

    let val;
    const keysIterator = colors.keys();
    //Iterate through all color keys to store their quantity
    while(val = keysIterator.next().value) {
      const expression = new RegExp(val, 'g');
      clone.set(val, (cardColors.match(expression) || []).length);
    }
    setColors(clone);
  }

  const retrieveStats = () => {//TODO: Combine action w/retrieveColors?
    const deck = decksInfo.cards;

    const quantity = deck.map((card)=>card.quantity).reduce((sum, current) => parseInt(sum) + parseInt(current));
    const CMC = deck.map((card)=>card.convertedManaCost).reduce((sum, current)=>sum+current);
    const AverageCMC = (CMC / quantity).toFixed(1);

    setStats(
      <Row className="justify-content-around">
        <Col md="2">Number of Cards: {quantity}</Col>
        <Col md="2">Average CMC: {AverageCMC}</Col>
        <Col md="4">
          <Col>White Cards: {colors.get("W")}</Col>
          <Col>Blue Cards: {colors.get("U")}</Col>
          <Col>Black Cards: {colors.get("B")}</Col>
          <Col>Red Cards: {colors.get("R")}</Col>
          <Col>Green Cards: {colors.get("G")}</Col>
        </Col>
      </Row>
    )
  }

  return (
    <Container id="selection">
       <Row id="title" className="h-100 justify-content-around align-items-center">
          <Col md="6" className="pb-2">
              <h3 className="embolden">{ decksInfo.id ? decksInfo.name : null }</h3>
          </Col>
      </Row>
      <Row id="overlay" className="h-100 justify-content-around align-items-center">
        <Col id="cards" md="8" className="opacity-layer pb-2">
            <Row><h3>Stats</h3></Row>
            {stats}
        </Col>
      </Row>
      <Row id="overlay" className="h-100 justify-content-around align-items-center">
        <Col id="cards" md="4" className="opacity-layer pb-2">
            <Row><h3>Cards</h3></Row>
            {display}
        </Col>
        <Col id="chart" md="4" className="opacity-layer pb-2">
          <canvas id="myChart" width="200" height="200"/>
        </Col>
      </Row>
    </Container>
  );
}

export default Deck;
