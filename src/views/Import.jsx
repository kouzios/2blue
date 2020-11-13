import React, { useState, useEffect, useContext } from 'react';
import { IDContext } from "../scripts/id-context";
import { Button, Row, Col, Container, Modal, InputGroup, FormControl } from 'react-bootstrap';
import errorHandling from '../scripts/errorHandling';

const Import = ({setView, openDecklist, ...props}) => { 
  const [userID] = useContext(IDContext);
  const [show, setShow] = useState(false);
  const [site, setSite] = useState("");
  const [decklist, setDecklist] = useState("");
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    setSite("")
  }
  const handleShow = (site) => {setShow(true); setSite(site)}

  const importTappedOut = () => {
    handleShow("TappedOut")
  }

  const importGoldfish = () => {
    handleShow("MTGGoldfish")
  }

  const uploadDeck = async () => {//TODO: Handle the cards to be consistent and all that
    const body = {
      name: 'Temporary deck name',
      cards: decklist.split("\n"),
      type: 'EDH'
    };
    
    const res = await fetch("/api/decks?type=import&authID=" + userID, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if(json.invalid) {
      setMessage("Could not import deck, invalid cards: " + JSON.stringify(json.invalid));
      return;
    }
    
    if(res.status !== 200) {
      errorHandling(res);
      setMessage("Unknown server error occured");
      return;
    }

    if(!json[0].id) {
      setMessage("Issue creating deck, cannot retrieve deck id");
      return;
    }

    handleClose();
    openDecklist(json[0].id);
  }
  
  return (
    <Container>
      <div id="overlay" className="row h-100 justify-content-around align-items-center">
        <Col md="4" className="opacity-layer no-flex">
          <Row><h3>From WHENCE shall you import?</h3></Row>
          <Row className="justify-content-around">
              <Button onClick={()=>importTappedOut()}>TappedOut</Button>
              <Button onClick={()=>importGoldfish()}>MTGoldfish</Button>
          </Row>
        </Col>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import from: {site}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className="badMessage">{message}</span>
          <InputGroup>
            <FormControl id="import" as="textarea" aria-label="With textarea" defaultValue={""} onChange={(e)=>setDecklist(e.target.value)}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={uploadDeck}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Import;
