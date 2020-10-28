import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const CustomPanel = ({addable, addCard, md, title, children, ...props}) => (
    <Col md={md} className="custom-panel">
        <div className="panel panel-primary">
            <div className="panel-body">
                <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase"> {title} </strong>
                    {addable ? <Button onClick={()=>addCard(title)}>+</Button> : null}
                </h3>
                <Row className="contents justify-content-around">
                    {children}
                </Row>
            </div>
        </div>
    </Col>
)

export default CustomPanel;