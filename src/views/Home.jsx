import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Decks from './Decks';

const fakeDecks = [
  "ack",
  "aaa",
  "aaaaahnoo"
]

const Profile = ({...props}) => { 
  return (
    <div id="selection">
      <div id="overlay" className="row h-100 justify-content-around align-items-center">
        <Col id="opacity-layer" className="no-flex">
          <Row><h3 className="clickable" onClick={() => {console.log("TODO")}}>[WIP]Start a game</h3></Row>
          <hr/>
          <Row><span>Starting a game allows you to store life totals, cards, and special effects during a game of Magic: The Gathering</span></Row>
        </Col>
        <Col id="opacity-layer" className="no-flex">
          <Row><h3 className="clickable" onClick={() => props.setView("create")}>Create a deck</h3></Row>
          <hr/>
          <Row><span>Recent Decks:</span></Row>
          <Decks total="5"/>
          <Row><h5 className="clickable" onClick={() => props.setView("decks")}>View more {">"}</h5></Row>
        </Col>
      </div>
    </div>
  );
}

export default Profile;
