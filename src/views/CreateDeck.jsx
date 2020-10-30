import React, { useState, useEffect, useContext } from "react";
import { Tooltip, OverlayTrigger, Button, Form, Col, Row } from "react-bootstrap";
import { IDContext } from "../scripts/id-context";
import MTGCard from '../components/MTGCard';


const CURRENT_CARD_DEFAULT = { name: "", quantity: "1" };
const CARDS_DEFAULT = new Map();

const CreateDeck = ({ ...props }) => {
  const [userID] = useContext(IDContext);
  const [cards, setCards] = useState(CARDS_DEFAULT);
  const [displayCards, setDisplayCards] = useState("");
  const [currentCard, setCurrentCard] = useState(CURRENT_CARD_DEFAULT);
  const [type, setType] = useState("EDH");
  const [name, setName] = useState("");
  const [addCardMessage, setAddCardMessage] = useState("");
  const [deckNameMessage, setDeckNameMessage] = useState("");

  useEffect(() => {
    setDisplayCards(cardsToPlaintext());
    //eslint-disable-next-line
  }, [cards]);

  const deleteCard = (name) => {
    let clone = new Map([...cards]);
    clone.delete(name);
    setCards(clone);
	};
	
	const renderTooltip = (name) => (
    <Tooltip>
      <MTGCard title={name}/>
    </Tooltip>
  )

  const CardRow = (name, quantity, index) => (
    <Row key={quantity + name + index}>
      <Col md="2">
        <Button variant="danger" onClick={() => deleteCard(name)}>
          DELETE
        </Button>
      </Col>
      <Col className="quantity" md="1">
        {quantity}
      </Col>
      <Col className="name">
				<OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(name)}
          >
						<span className="default">{name}</span>
				</OverlayTrigger>
			</Col>
    </Row>
  );

  const cardsToPlaintext = () =>
    [...cards].map((card, index) => CardRow(card[0], card[1], index));

  //Our JSON object for MTG cards requires a format such as "Sol Ring" not "sol ring", so we convert it thusly
  const capitalizeEachFirstLetter = (phrase) => {
    let words = phrase.toLowerCase();
    words = words.split(" ");
    words = words.map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1)
    );
    return words.join(" ");
  };

  const addCard = async () => {
    setAddCardMessage("");
    if (currentCard.name && currentCard.quantity > 0) {
      const res = await fetch(
        "/api/cards?title=" + capitalizeEachFirstLetter(currentCard.name),
        { method: "POST" }
      );
      const cardInfo = await res.json();

      if (cardInfo.name) {
        let clone = new Map([...cards]);
        clone.set(cardInfo.name, currentCard.quantity);
        setCards(clone);
        setCurrentCard(CURRENT_CARD_DEFAULT);
      } else {
        setAddCardMessage("Card not found");
      }
    }
  };

  const handleForm = (event) => {
    event.preventDefault(); //Prevent form submission
  };

  const createDeck = async (event) => {
    setDeckNameMessage("");
    const body = { name, cards, type };
    if (name === "") {
      setDeckNameMessage("Please fill in deck name");
      return;
    }
    await fetch("/api/decks?authID=" + userID, {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addCard();
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center">
      <Col md={8} sm={12}>
        <h2 className="embolden">Create a deck</h2>
        <Form onSubmit={(e) => handleForm(e)}>
          <Form.Row>
            <Form.Group as={Col} md={10} controlId="formDeckName">
              <Form.Label>Deck Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter deck name"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group as={Col} md={2} controlId="formDeckType">
              <Form.Label>Deck Type</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <option>EDH</option>
                <option>Brawl</option>
                <option>Standard</option>
                <option>Modern</option>
                <option>Legacy</option>
                <option>Vintage</option>
                <option>Pauper</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md={10} controlId="formCardText">
              <Form.Text className="badMessage">{deckNameMessage}</Form.Text>
            </Form.Group>
          </Form.Row>

          <hr />

          <Form.Row>
            <Form.Group as={Col} md={10} controlId="formCardname">
              <Form.Label>Card Name</Form.Label>
              <Form.Control
                type="text"
                onKeyPress={handleKeyPress}
                onChange={(e) =>
                  setCurrentCard({
                    name: e.target.value,
                    quantity: currentCard.quantity,
                  })
                }
                value={currentCard.name}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group as={Col} md={2} controlId="formCardnum">
              <Form.Label>How Many?</Form.Label>
              <Form.Control
                type="number"
                onKeyPress={handleKeyPress}
                onChange={(e) =>
                  setCurrentCard({
                    name: currentCard.name,
                    quantity: e.target.value,
                  })
                }
                value={currentCard.quantity}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Button variant="secondary" onClick={() => addCard()}>
                Add Card
              </Button>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md={10} controlId="formCardText">
              <Form.Text className="badMessage">{addCardMessage}</Form.Text>
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formCardArea">
            <Form.Label>Deck List ({[...cards].length})</Form.Label>
            <div id="displayContainer">
              <div id="displayHeader">
                <Row className="embolden">
                  <Col md="2">Action</Col>
                  <Col md="1">#</Col>
                  <Col>Card Name</Col>
                </Row>
              </div>

              <div id="displayCards">{displayCards}</div>
            </div>
          </Form.Group>

          <hr />

          <Button variant="primary" onClick={createDeck}>
            Create Deck
          </Button>
        </Form>
      </Col>
    </div>
  );
};

export default CreateDeck;
