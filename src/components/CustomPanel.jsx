import React from 'react';
import { Row, Col } from 'react-bootstrap';

const CustomPanel = ({title, children, ...props}) => (
    <Row className="justify-content-center">
        <Col md={6} className="mb-5">
            <div className="panel panel-primary">
                <div className="panel-body">
                    <h3 className="text-on-pannel text-primary">
                        <strong className="text-uppercase"> {title} </strong>
                    </h3>
                    <Row className="justify-content-around">
                        {children}
                    </Row>
                </div>
            </div>
        </Col>
    </Row>
)

export default CustomPanel;