import React, {useEffect, useState, useContext} from 'react';
import MTGCardOverlay from '../components/MTGCardOverlay';
import { IDContext } from '../scripts/id-context';
import { Container, Tooltip, Col, Row, OverlayTrigger } from 'react-bootstrap';
var Chart = require('chart.js');

const initialLoading = <span className="loading-content">Loading Cards...</span>;
const noDecks = <span className="loading-content">No Decks Found</span>;

const DEFAULT_COLORS = new Map([
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

const DEFAULT_CARDS_BY_TYPE = new Map([
  ["Land", []],
  ["Planeswalker", []],
  ["Creature", []],
  ["Artifact", []],
  ["Enchantment", []], 
  ["Instant", []],
  ["Sorcery", []],
  ["Tribal", []],
]);


const Deck = ({ ...props }) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState(initialLoading);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [stats, setStats] = useState(null);
  const [cardsByType, setCardsByType] = useState(DEFAULT_CARDS_BY_TYPE);


  useEffect(() => {
    setCardsByType(DEFAULT_CARDS_BY_TYPE);
    setDisplay(initialLoading);
    loadDecks();
    //eslint-disable-next-line
  }, [userID]);

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

  /* 
   * Method built to sort cards by type even if they have multiple types, with a set priority of:
   * land > planeswalker > creature > artifact > enchantment > instant > sorcery > tribal
   */
  const getType = (types) => {
    const categories =  Array.from(cardsByType.keys());
    for(let index = 0; index < categories.length; index++) {

      const category = categories[index];
      if(types.includes(category)) {
        return category;
      }
    }

    return null;
  }

  const mapExistingTypes = (types) => {
    let typesMap = new Map(DEFAULT_CARDS_BY_TYPE);
    let val;
    const keysIterator = typesMap.keys();
    //Iterate through all color keys to store their quantity
    while((val = keysIterator.next().value)) {
      const expression = new RegExp(val, 'g');
      typesMap.set(val, (types.match(expression) || []).length);
    }
    return typesMap;
  }

  const renderTooltip = (card, flipped) => (
    <Tooltip className="mtg-container">
      <MTGCardOverlay removeCard={()=>null} title={card.name} flipped={flipped}/>
    </Tooltip>
  )

  const renderUniqueTypes = (types) => (
    types.map((type)=>(
      type[0] + ": " + type[1] + "\n"
    ))
  )

  const loadDecks = async () => { 

    let deckID = props.id;
    if(!deckID)
      deckID = (window.location.search).substring(4);

    try {
      const res = await fetch('/api/decks?type=one&deckID=' + deckID +'&authID='+userID);
      let deck = await res.json();
      deck.cards = JSON.parse(deck.cards);

      let clone = new Map([...cardsByType]);
      deck.cards.forEach((card) => {//Sort cards by primary type
        const type = getType(card.types);
        const cardsInType = clone.get(type);
        clone.set(type, [card, ...cardsInType]);
      });

      setCardsByType(clone);
      setDecksInfo(deck);
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveStats = () => {//TODO: Combine action w/other mapping classes?
    const deck = decksInfo.cards;

    const quantity = deck.map((card)=>card.quantity).reduce((sum, current) => parseInt(sum) + parseInt(current));
    const CMC = deck.map((card)=>card.convertedManaCost).reduce((sum, current)=>sum+current);
    const AverageCMC = (CMC / quantity).toFixed(1);

    let types = mapExistingTypes(deck.map((card) => card.types).reduce((sum, current)=>sum+current).toString());
    const existingTypes = [...types.values()].filter((val)=>val>0);//Only keep types with cards in them
    console.log(existingTypes)
    setStats(
      <Row className="justify-content-around">
        <Col md="2">Number of Cards: {quantity}</Col>
        <Col md="2">Average CMC: {AverageCMC}</Col>
        <Col md="2">
          <OverlayTrigger
            delay={{ show: 250, hide: 400 }}
            placement="bottom"
            overlay={<Tooltip>{renderUniqueTypes([...types])}</Tooltip>}
          >
            <span>Number of Unique Types: {existingTypes.length}</span>
          </OverlayTrigger>
        </Col>
      </Row>
    )
  }

  const formatDecks = () => {
    let val;
    let formattedContent = [];
    const keysIterator = cardsByType.keys();
    const valueIterator = cardsByType.values();
    //Iterate through all categories
    while((val = valueIterator.next().value) !== undefined) {
      const key = keysIterator.next().value;
      if (val.length <= 0) //Skip category if empty
        continue;
      let mapped = val.map((card, index) => {
        const cardName = card.name;
        const quantity = card.quantity;
        card.type = getType(card.types);
        if(cardName.includes("//")) { //If two faced card, separate the card names for overlay
          const faces = cardName.split("//");
          return (
            <Row key={"card"+index+key}>
              <span>{quantity}x</span>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(card, false)}
              >
                <span className="pl-1 ellipsis default">{faces[0]}</span>
              </OverlayTrigger>
              <span className="pl-1">//</span>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(card, true)}
              >
                <span className="pl-1 ellipsis default">{faces[1]}</span>
              </OverlayTrigger>
            </Row>
          )
        }
        return (
          <Row key={"card"+index+key}>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip(card)}
            >
              <span className="ellipsis default">{quantity}x {cardName}</span>
            </OverlayTrigger>
          </Row>
        )
      });
      const categoryHeader = (
        <Row key={"category"+key}><h5>{key + " ("+mapped.length+")"}</h5></Row>
      )
      formattedContent.push([categoryHeader, ...mapped, <hr/>]);
    }
    
    setDisplay(formattedContent);
  }

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
    const clone = new Map(DEFAULT_COLORS);
    const deck = decksInfo.cards;

    //Map cards to only store their quantity, then summate them ex: W=>1, U=>2, B=>1, R=>0, G=>0 can become WUBU
    const cardColors = deck.map((card) => card.colors).reduce((sum, current)=>sum+current).toString();

    let val;
    const keysIterator = colors.keys();
    //Iterate through all color keys to store their quantity
    while((val = keysIterator.next().value)) {
      const expression = new RegExp(val, 'g');
      clone.set(val, (cardColors.match(expression) || []).length);
    }
    setColors(clone);
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
