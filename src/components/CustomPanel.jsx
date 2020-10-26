import React from 'react';
import { Row, Col } from 'react-bootstrap';

const CustomPanel = ({md, title, children, ...props}) => (
    <Col md={md} className="custom-panel">
        <div className="panel panel-primary">
            <div className="panel-body">
                <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase"> {title} </strong>
                </h3>
                <Row className="contents justify-content-around">
                    {children}
                </Row>
            </div>
        </div>
    </Col>
)

export default CustomPanel;