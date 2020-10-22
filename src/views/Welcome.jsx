import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Profile = ({...props}) => { 
  return (
    <div id="background">
      <div id="overlay" className="row h-100 align-items-center">
        <Col id="opacity-layer">
          <Row>
            <Col className="d-flex justify-content-end" md="4">
              <img className="logo-hero" src="logo.png" alt="Homepage site logo"/>
            </Col>
            <Col className="d-flex align-items-center">
              <span id="slogan"><span className="embolden">Simplified</span> deck building</span>
            </Col>
          </Row>
        </Col>
      </div>
    </div>
  );
}

export default Profile;
