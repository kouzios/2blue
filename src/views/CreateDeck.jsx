import React, { useState, useEffect, useContext } from "react";
import {
  Tooltip,
  OverlayTrigger,
  Button,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import { IDContext } from "../scripts/id-context";
import MTGCardOverlay from "../components/MTGCardOverlay";
import errorHandling from "../scripts/errorHandling";

const CURRENT_CARD_DEFAULT = { name: "", quantity: "1", commander: false };
const CARDS_DEFAULT = new Map();

const CreateDeck = ({ openDecklist, ...props }) => {
  const [userID] = useContext(IDContext);
  const [cards, setCards] = useState(CARDS_DEFAULT);
  const [displayCards, setDisplayCards] = useState("");
  const [currentCard, setCurrentCard] = useState(CURRENT_CARD_DEFAULT);
  const [type, setType] = useState("EDH");
  const [name, setName] = useState("");
  const [addCardMessage, setAddCardMessage] = useState("");
  const [deckNameMessage, setDeckNameMessage] = useState("");
  const [commanderChecked, setCommanderChecked] = useState(false);

  useEffect(() => {
    setDisplayCards(cardsToPlaintext());
    //eslint-disable-next-line
  }, [cards]);

  useEffect(() => {
    setCurrentCard({
      name: currentCard.name,
      quantity: currentCard.quantity,
      commander: commanderChecked,
    });
    //eslint-disable-next-line
  }, [commanderChecked]);

  const deleteCard = (name) => {
    let clone = new Map([...cards]);
    clone.delete(name);
    setCards(clone);
  };

  const renderTooltip = (name, flipped) => (
    <Tooltip className="mtg-container">
      <MTGCardOverlay
        removeCard={() => deleteCard(name)}
        title={name}
        flipped={flipped}
      />
    </Tooltip>
  );

  const card = (cardName, index) => {
    if (cardName.includes("//")) {
      //If two faced card, seperate the card names for overlay
      const faces = cardName.split("//");
      return (
        <div>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(cardName, false)}
          >
            <span className="pl-1 ellipsis default">{faces[0]}</span>
          </OverlayTrigger>
          <span className="pl-1">//</span>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(cardName, true)}
          >
            <span className="pl-1 ellipsis default">{faces[1]}</span>
          </OverlayTrigger>
        </div>
      );
    }

    return (
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip(cardName)}
      >
        <span className="ellipsis default">{cardName}</span>
      </OverlayTrigger>
    );
  };

  const CardRow = (name, quantity, commander, index) => (
    <Row key={quantity + name + index}>
      <Col md="2" sm="3" xs="3">
        <Button variant="danger" onClick={() => deleteCard(name)}>
          DELETE
        </Button>
      </Col>
      <Col className="ellipsis quantity" md="1" sm="3" xs="3">
        {quantity}
      </Col>
      <Col className="ellipsis name" md="6" sm="3" xs="6">
        {card(name, index)}
      </Col>
      <Col className="ellipsis" md="2" sm="3" xs="2">
        {commander.toString()}
      </Col>
    </Row>
  );

  const cardsToPlaintext = () =>
    [...cards].map((card, index) =>
      CardRow(card[0], card[1].quantity, card[1].commander, index)
    );

  const addCard = async () => {
    const card = { ...currentCard };

    setAddCardMessage("");
    setCurrentCard(CURRENT_CARD_DEFAULT);
    setCommanderChecked(false);

    let cardName = card.name;
    cardName = cardName.trim();
    if (cardName && card.quantity > 0) {
      const res = await fetch("/api/cards?title=" + cardName.toLowerCase(), {
        method: "POST",
      });
      if (res.status !== 200) {
        errorHandling(res);
        return;
      }
      let cardInfo = await res.json();

      if (cardInfo.name) {
        if (cardInfo.legalities.commander !== "Legal") {
          //TODO: Variable format based on Deck Type
          setAddCardMessage("That card is not legal in the EDH format");
          return;
        }
        let clone = new Map([...cards]);
        cardInfo.quantity = card.quantity;
        cardInfo.commander = card.commander;
        clone.set(cardInfo.name, cardInfo);
        setCards(clone);
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
    const cardsArray = Array.from(cards); //Map to array
    let clone = cardsArray.map((card) => card[1]); //Map format to normal formatting

    const body = { name, cards: clone, type: "EDH" }; //Only allowing EDH right now
    if (name === "") {
      setDeckNameMessage("Please fill in deck name");
      return;
    }
    if (cards.length === 0) {
      setDeckNameMessage("Please add at least one card to your deck");
      return;
    }
    const res = await fetch("/api/decks?type=new&authID=" + userID, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      errorHandling(res);
      setDeckNameMessage("Unknown server error occured");
      return;
    }
    const data = await res.json();
    const id = data[0].id;

    if (!id) {
      setDeckNameMessage("Issue creating deck, cannot retrieve deck id");
      return;
    }

    openDecklist(id);
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
              <Form.Text id="cardHelpBlock" muted>
                EDH decks require a commander, so be sure to check the
                "commander" box on that card. For now, we don't validate if the
                commander is valid, or if they are split commanders.
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col} md={2} controlId="formDeckType">
              <Form.Label>Deck Type</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setType(e.target.value)}
                value={type}
                disabled
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
            <Form.Group as={Col} controlId="formCardname">
              <Form.Label>Card Name</Form.Label>
              <Form.Control
                type="text"
                onKeyPress={handleKeyPress}
                onChange={(e) =>
                  setCurrentCard({
                    name: e.target.value,
                    quantity: currentCard.quantity,
                    commander: currentCard.commander,
                  })
                }
                value={currentCard.name}
                autoComplete="off"
              />
              <Form.Text id="cardHelpBlock" muted>
                If adding a double faced card, please follow the format of:
                Frontname // Backname. For example, "Journey to Eternity //
                Atzal, Cave of Eternity"
              </Form.Text>
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
                    commander: currentCard.commander,
                  })
                }
                value={currentCard.quantity}
              />
            </Form.Group>
            <Form.Group as={Col} md={1} controlId="formCommander">
              <Form.Label>Commander?</Form.Label>
              <Form.Check
                name="Commander"
                checked={commanderChecked}
                onChange={(e) => setCommanderChecked(e.target.checked)}
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
                  <Col md="2" sm="3" xs="2">
                    Action
                  </Col>
                  <Col md="1" sm="3" xs="1">
                    #
                  </Col>
                  <Col md="6" sm="3" xs="6">
                    Card Name
                  </Col>
                  <Col md="2" sm="3" xs="2">
                    Commander?
                  </Col>
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
