import React from 'react';
import { Form } from 'react-bootstrap';

const CreateDeck = ({...props}) => {
  return (
    <div className="container mt-5">
        <h2>Create a deck</h2>
        <Form>
            <Form.Group controlId="formDeckName">
                <Form.Label>Deck Name</Form.Label>
                <Form.Control type="text" placeholder="Enter deck name"/>
            </Form.Group>
            <Form.Group controlId="formDeckType">
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
            <Form.Group controlId="formCardname">
                <Form.Label>Card Name</Form.Label>
                <Form.Control type="text" placeholder="Enter card name"/>
            </Form.Group>
            <Form.Group controlId="formCardArea">
                <Form.Label>Your cards:</Form.Label>
                <Form.Control as="textarea" rows="10"/>
            </Form.Group>
        </Form>
    </div>
  );
}

export default CreateDeck;
