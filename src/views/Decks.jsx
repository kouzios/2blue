import React, { useEffect, useState, useContext } from "react";
import { IDContext } from "../scripts/id-context";
import { Container, Col, Row } from "react-bootstrap";
import errorHandling from "../scripts/errorHandling";

const initialLoading = (
  <span className="loading-content">Loading Decks...</span>
);
const noDecks = <span className="loading-content">No Decks Found</span>;

const Deck = ({ openDecklist, ...props }) => {
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
    if (decksInfo.length > 0) {
      let mapped = decksInfo.map((deck, index) => (
        <Row
          onClick={() => openDecklist(deck.id)}
          key={"deck" + index}
          id={deck.id}
          className="clickable"
        >
          {deck.name}
        </Row>
      ));
      setDisplay(mapped);
    } else {
      setDisplay(noDecks);
    }
  };

  const loadDecks = async () => {
    try {
      const res = await fetch("/api/decks?type=all&authID=" + userID);
      if (res.status !== 200) {
        errorHandling(res);
        return;
      }
      const decksInfo = await res.json();
      setDecksInfo(decksInfo);
    } catch (error) {
      errorHandling(error);
    }
  };

  return (
    <Container id="selection">
      <div
        id="overlay"
        className="row h-100 justify-content-around align-items-center"
      >
        <Col md="4" className="opacity-layer no-flex">
          <Row>
            <h3>Decklists</h3>
          </Row>
          <hr />
          {display}
        </Col>
      </div>
    </Container>
  );
};

export default Deck;
