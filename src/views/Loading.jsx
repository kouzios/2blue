import React from "react";
import { Col, Row } from "react-bootstrap";

const Loading = ({ ...props }) => {
  return (
    <div>
      <div className="row h-100 justify-content-around align-items-center">
        <Col id="loading" className="no-flex">
          <Row>
            <h3>
              Please wait while we check Google for your sign-in status...
            </h3>
          </Row>
          <img id="loading-img" src="logo.png" alt="Loading Logo" />
        </Col>
      </div>
    </div>
  );
};

export default Loading;
