import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import LimitedDecks from "../components/LimitedDecks";

const gameText =
  "Starting a game allows you to cards on the board and in players graveyards during a game of Magic: The Gathering";

const Profile = ({ openDecklist, setView, ...props }) => {
  return (
    <Container id="selection">
      <div
        id="overlay"
        className="row h-100 justify-content-around align-items-center"
      >
        <Col md="4" className="opacity-layer no-flex">
          <Row>
            <h3 className="clickable" onClick={() => setView("game")}>
              Start a game
            </h3>
          </Row>
          <hr />
          <Row className="mb-2">
            <span>{gameText}</span>
          </Row>
        </Col>
        <Col md="4" className="opacity-layer no-flex">
          <Row>
            <h3 className="clickable" onClick={() => setView("create")}>
              Create
            </h3>
            <h3 className="muted">&nbsp;/&nbsp;</h3>
            <h3 className="clickable" onClick={() => setView("import")}>
              Import
            </h3>
            <h3 className="muted">&nbsp;a deck</h3>
          </Row>
          <hr />
          <Row>
            <span>Recent Decks:</span>
          </Row>
          <LimitedDecks openDecklist={openDecklist} total="5" />
          <Row>
            <h5 className="clickable" onClick={() => setView("decks")}>
              View more {">"}
            </h5>
          </Row>
        </Col>
      </div>
    </Container>
  );
};

export default Profile;
