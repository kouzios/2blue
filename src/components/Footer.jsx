import React from 'react';
import { Row, Col } from 'react-bootstrap';


const Footer = ({setView, ...props}) => {
    return (
        <div>
            <hr/>
            <Row id="header" className="d-flex justify-content-center">
                <Col className="d-flex justify-content-center">
                    <img className="clickable footer-logo" src="logo.png" alt="Banner logo" onClick={()=>setView("home")}/>
                    <span id="footer-sitename">TwoBlue</span>
                </Col>
                <Col className="d-flex justify-content-center">
                    <img className="clickable github" src="github.png" alt="Github Link" onClick={()=>window.location.replace("https://github.com/kouzios")}/>
                    <span id="footer-name">Matthew Kouzios</span>
                </Col>
            </Row>
        </div>
    )
}

export default Footer;