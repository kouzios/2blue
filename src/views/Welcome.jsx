import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Profile = ({...props}) => { 
  return (
    <div id="background">
      <div id="overlay" className="row h-100 justify-content-center align-items-center">
        <Col id="opacity-layer">
          <Row>
            <img className="banner-logo-hero" src="logo_long.png" alt="Banner logo"/>
          </Row>
          <Row>
            <span>For however you want to play</span>
          </Row>
        </Col>
      </div>
    </div>
  );
}

export default Profile;
