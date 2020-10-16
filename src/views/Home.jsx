import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Profile = ({...props}) => { 
  return (
    <div id="selection">
      <div id="overlay" className="row h-100 justify-content-center align-items-center">
        <Col id="opacity-layer" className="no-flex">
          <Row><div className="clickable" onClick={() => {console.log("TODO")}}>[WIP]Start a game</div></Row>
          <Row><div className="clickable" onClick={() => props.setView("decks")}>View list of decks here</div></Row>
          <Row><div className="clickable" onClick={() => props.setView("create")}>Create a deck here</div></Row>
        </Col>
      </div>
    </div>
  );
}

export default Profile;
