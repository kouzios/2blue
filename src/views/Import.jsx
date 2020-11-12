import React from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';

const Import = ({...props}) => { 
  const importTappedOut = () => {
    alert("Import from tapped out: TBD");
  }

  const importGoldfish = () => {
    alert("Import from MTG Goldfish: TBD");
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
    </Container>
  );
}

export default Import;
