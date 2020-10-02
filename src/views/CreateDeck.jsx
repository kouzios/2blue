import React, {useState, useEffect} from 'react';
import { Button, Form, Col, InputGroup} from 'react-bootstrap';

const CURRENT_CARD_DEFAULT = {name:"", quantity:1};

const CreateDeck = ({...props}) => {
    const [cards, setCards] = useState([]); //TODO: Removable entries
    const [displayCards, setDisplayCards] = useState("");
    const [currentCard, setCurrentCard] = useState(CURRENT_CARD_DEFAULT);

    useEffect(() => {
        setDisplayCards(cardsToPlaintext());
    }, [cards])

    const cardsToPlaintext = () => {
        return (
            cards.map((card)=>(card.quantity+"x "+card.name)).join("\n")
        )
    }

    const addCard = () => { //TODO: Validation message
        if(currentCard.name && currentCard.quantity > 0) {
            let clone = [...cards];
            clone.push(currentCard);
            setCards(clone);
            setCurrentCard(CURRENT_CARD_DEFAULT);
        }
        
    }

    const handleForm = (event) => {
        event.preventDefault(); //Prevent form submission
        //TODO
    }

    return (
        <div className="container mt-5">
            <h2>Create a deck</h2>
            <Form onSubmit={(e) => handleForm(e)}>
                <Form.Row>

                    <Form.Group as={Col} md={10} controlId="formDeckName">
                        <Form.Label>Deck Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter deck name"/>
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="formDeckType">
                        <Form.Label>Deck Type</Form.Label>
                        <Form.Control as="select">
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

                <hr/>

                <Form.Row>
                    <Form.Group as={Col} md={10} controlId="formCardname">
                        <Form.Label>Card Name</Form.Label>
                        <Form.Control type="text" onChange={(e)=>setCurrentCard({name:e.target.value, quantity:currentCard.quantity})} value={currentCard.name} />
                        <Button variant="secondary" onClick={()=>addCard()}> Add Card</Button>
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="formCardnum">
                        <Form.Label>How Many?</Form.Label>
                        <Form.Control type="number" onChange={(e)=>setCurrentCard({name:currentCard.name, quantity:e.target.value})} value={currentCard.quantity}/>
                    </Form.Group>
                </Form.Row>
                
                <Form.Group controlId="formCardArea">
                    <Form.Label>Deck List ({cards.length})</Form.Label>
                    <Form.Control className="disabled" disabled as="textarea" rows="10" onChange={() => console.log("Unable to update textarea, disabled")} value={displayCards}/> 
                </Form.Group>

                <hr/>

                <Button variant="primary" type="submit">
                    Create Deck
                </Button>
            </Form>
        </div>
    );
}

export default CreateDeck;
