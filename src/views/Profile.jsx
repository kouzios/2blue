import React from 'react';
import { Row } from 'react-bootstrap';

const Home = ({...props}) => {
  return (
    <div className="container mt-5">
        <Row>
            Name: {props.profileInfo.name}
        </Row>
        <Row>
            Email: {props.profileInfo.email}
        </Row>
        <Row>
            Profile Picture: <img id="profile-image" src={props.profileInfo.image} alt="Profile Page Image"/>
        </Row>
    </div>
  );
}

export default Home;