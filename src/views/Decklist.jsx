import React, {useEffect, useState, useContext} from 'react';
import MTGCardOverlay from '../components/MTGCardOverlay';
import MTGCard from '../components/MTGCard';
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

const DEFAULT_CMC = new Map([
  ['0', 0],
  ['1', 0],
  ['2', 0],
  ['3', 0],
  ['4', 0],
  ['5', 0],
  ['6', 0],
  ['7', 0],
  ['8', 0],
  ['9', 0],
  ['10+', 0],
])


const Deck = ({ ...props }) => {
  const [userID] = useContext(IDContext);
  const [decksInfo, setDecksInfo] = useState({id: null, cards: null, uid: [], name: null});
  const [display, setDisplay] = useState(initialLoading);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [stats, setStats] = useState(null);
  const [cardsByType, setCardsByType] = useState(DEFAULT_CARDS_BY_TYPE);
  const [convertedManaCost, setConvertedManaCost] = useState(DEFAULT_CMC);
  const [commander, setCommander] = useState("");


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
      retrieveCMC();
      retrieveCommander();
    } else {
      setDisplay(noDecks);
    }
    // eslint-disable-next-line
  }, [decksInfo]);

  useEffect(() => {
    if(decksInfo.id != null)
      chartColors();
    // eslint-disable-next-line
  }, [colors]);

  useEffect(() => {
    if(decksInfo.id != null)
      chartCMC();
    // eslint-disable-next-line
  }, [convertedManaCost]);

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

    setStats(
      <Row className="justify-content-around">
        <Col md="4">Number of Cards: {quantity}</Col>
        <Col md="4">Average CMC: {AverageCMC}</Col>
        <Col md="4">
          <OverlayTrigger
            delay={{ show: 250, hide: 400 }}
            placement="bottom"
            overlay={<Tooltip>{renderUniqueTypes([...types])}</Tooltip>}
          >
            <span>Number of Unique Types: <span id="uniqueQuantity">{existingTypes.length}</span></span>
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
            <Row className="decklist-card" key={"card"+index+key}>
              <span className="ellipsis">
                {quantity}x
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip(card, false)}
                >
                  <span className="pl-1 default">{faces[0]}</span>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip(card, true)}
                >
                  <span className="pl-1 default flip">(Flip)</span>
                </OverlayTrigger>
              </span>
             
            </Row>
          )
        }
        return (
          <Row className="decklist-card"  key={"card"+index+key}>
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
  
  const retrieveCommander = () => {//TODO: Support multiple commanders
    const deck = decksInfo.cards;

    //Map cards to only store their commandernessity
    const commanders = deck.filter((card) => card.commander === true);
    const commander = commanders.length > 0 ? commanders[0].name : "";

    setCommander(commander);
  }

  const chartColors = () => {
    var ctx = document.getElementById('colorChart').getContext('2d');
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

    if(chart.data.length === 0) {
      chart.data = [0]
      chart.colorValues = ['rgba(255, 255, 255, 1)'];
      chart.labels = ["No Colors"];//TODO: Count colorless too
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
          fontSize: '22',
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

  const chartCMC = () => {
    var ctx = document.getElementById('CMCchart').getContext('2d');
    let chart = {data:[], labels: []};
    const deck = decksInfo.cards;

    const maxCMC = Math.max(...deck.map((card)=>card.convertedManaCost));

    let val;
    const keysIterator = convertedManaCost.keys();
    const valueIterator = convertedManaCost.values();
    //Iterate through all colors
    while((val = valueIterator.next().value) !== undefined) {
      const key = keysIterator.next().value;

      //Change edge string cmc to integer
      let cmc = key 
      if(key === "10+")
        cmc = 10;
      
        //Prevents storing empty CMC values past the max
      if(cmc > maxCMC) 
        continue; 
      chart.data.push(val);
      chart.labels.push(key)
    }
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chart.labels,
          datasets: [{
            label: "Number of Cards:",
            data: chart.data,
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }]
      },
      options: {
        title: {
          display: true,
          text: 'CMC',
          fontColor: 'white',
          fontStyle: 'bold',
          fontSize: '22',
        },
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true,
                  callback: (val) => {if(val%1===0) return val}//Only use integers on y scale
              }
          }]
      }
      }
    });
  }

  const retrieveCMC = () => {
    const clone = new Map([...DEFAULT_CMC]);
    const deck = decksInfo.cards;

    const CMC = deck.map((card)=>card.convertedManaCost);

    let val;
    const keysIterator = clone.keys();
    //Iterate through all mana costs, 
    while((val = keysIterator.next().value)) {

      const matchedManacosts = CMC.filter((cost)=> {
        if(cost >= 10) //If our card cost is large
          return (val === "10+");//Check to see if we're at our edge case
        return cost == val;//otherwise just return if we have a matching cmc
      });//Only ==, not === as val is a string and cost an int
      clone.set(val, matchedManacosts.length);
    }
    setConvertedManaCost(clone);
  }

  return (
    <Container id="selection">
       <Row id="title" className="h-100 justify-content-around align-items-center">
          <Col md="6" className="pb-2">
              <h3 className="embolden">{ decksInfo.id ? decksInfo.name : null }</h3>
          </Col>
      </Row>
      <Row id="overlay" className="h-100 justify-content-around align-items-center">
        <Col id="stats" md="8" className="opacity-layer pb-2">
            <Row><h3>Stats</h3></Row>
            {stats}
        </Col>
      </Row>
      <Row id="overlay" className="h-100 justify-content-around align-items-center">
        <Col id="cards" md="7" className="opacity-layer pb-2">
            <Row><h3>Cards</h3></Row>
            {display}
        </Col>
        <Col md="3" className="opacity-layer pb-2">
          <Row><h3>Command Zone</h3></Row>
          <Row className="justify-content-center"><MTGCard commander={true} title={commander}/></Row>
        </Col>
      </Row>
      <Row id="chart" className="opacity-layer pb-2">
          <Col md="5">
            <canvas id="colorChart"/>
          </Col>
          <Col md="5">
            <canvas id="CMCchart"/>
          </Col>
        </Row>
    </Container>
  );
}

export default Deck;
