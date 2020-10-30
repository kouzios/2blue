import React, {useState, useEffect, useContext} from 'react';
import { Button, Form, Col} from 'react-bootstrap';
import { IDContext } from '../scripts/id-context';

const CURRENT_CARD_DEFAULT = {name:"", quantity:'1'};

const CreateDeck = ({...props}) => {
    const [userID] = useContext(IDContext);
    const [cards, setCards] = useState([]); //TODO: Removable entries
    const [displayCards, setDisplayCards] = useState("");
    const [currentCard, setCurrentCard] = useState(CURRENT_CARD_DEFAULT);
    const [type, setType] = useState("EDH");
    const [name, setName] = useState("");
    const [addCardMessage, setAddCardMessage] = useState("");
    const [deckNameMessage, setDeckNameMessage] = useState("");

    useEffect(() => {
        setDisplayCards(cardsToPlaintext());
        //eslint-disable-next-line
    }, [cards])

    const cardsToPlaintext = () => {
        return (
            cards.map((card)=>(card.quantity+"x "+card.name)).join("\n")
        )
    }

    const addCard = async () => {
        setAddCardMessage("");
        if(currentCard.name && currentCard.quantity > 0) {
            const res = await fetch("/api/cards?title=" + currentCard.name, {method: "POST"});
            const cardInfo = await res.json();
            if(cardInfo.name) {
                let clone = [...cards];
                clone.push({name: cardInfo.name, quantity: currentCard.quantity});
                setCards(clone);
                setCurrentCard(CURRENT_CARD_DEFAULT);
            } else {
                setAddCardMessage("Card not found");
            }
        }
        
    }

    const handleForm = (event) => {
        event.preventDefault(); //Prevent form submission
    }

    const createDeck = async (event) => {
        setDeckNameMessage("");
        const body = { name, cards, type };
        if(name === "") {
            setDeckNameMessage("Please fill in deck name");
            return;
        }
        await fetch('/api/decks?authID='+userID, {method:'POST', body:JSON.stringify(body)});
    }

    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center">
            <Col md={8} sm={12}>
                <h2>Create a deck</h2>
                <Form onSubmit={(e) => handleForm(e)}>
                    <Form.Row>
                        <Form.Group as={Col} md={10} controlId="formDeckName">
                            <Form.Label>Deck Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter deck name" autoComplete="off"/>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="formDeckType">
                            <Form.Label>Deck Type</Form.Label>
                            <Form.Control as="select" onChange={(e)=>setType(e.target.value)} value={type}>
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
                            <Form.Text className="badMessage">
                                {deckNameMessage}
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>

                    <hr/>

                    <Form.Row>
                        <Form.Group as={Col} md={10} controlId="formCardname">
                            <Form.Label>Card Name</Form.Label>
                            <Form.Control type="text" onChange={(e)=>setCurrentCard({name:e.target.value, quantity:currentCard.quantity})} value={currentCard.name} autoComplete="off"/>
                            <Button variant="secondary" onClick={()=>addCard()}> Add Card</Button>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="formCardnum">
                            <Form.Label>How Many?</Form.Label>
                            <Form.Control type="number" onChange={(e)=>setCurrentCard({name:currentCard.name, quantity:e.target.value})} value={currentCard.quantity}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} md={10} controlId="formCardText">
                            <Form.Text className="badMessage">
                                {addCardMessage}
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>

                    
                    
                    <Form.Group controlId="formCardArea">
                        <Form.Label>Deck List ({cards.length})</Form.Label>
                        <Form.Control className="disabled" disabled as="textarea" rows="10" onChange={() => console.log("Unable to update textarea, disabled")} value={displayCards}/> 
                    </Form.Group>

                    <hr/>

                    <Button variant="primary" onClick={createDeck}>
                        Create Deck
                    </Button>
                </Form>
            </Col>
        </div>
    );
}

export default CreateDeck;
