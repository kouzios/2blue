import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Profile = ({...props}) => { 
  return (
    <div id="background">
      <div id="overlay" className="row h-100 justify-content-center align-items-center">
        <Col id="opacity-layer" className="no-flex">
          <Row>
            <img className="banner-logo-hero" src="logo_long.png" alt="Banner logo"/>
          </Row>
          <Row>
            <span>For however you play</span>
          </Row>
        </Col>
      </div>
    </div>
  );
}

export default Profile;
