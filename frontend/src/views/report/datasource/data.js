import React, { useState ,useRef } from 'react';
import { Row, Col, Card, Form, Button, Modal} from 'react-bootstrap';
import ProductTableComponent from '../chart/ProductDetail';


const FormsElements = () => {
    

    return (
        <React.Fragment>
        <Row>
            <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Preview Data</Card.Title>
                        </Card.Header>
                        <Card.Body style={{ padding: 0, marginTop: '-2rem' }}>
                            <ProductTableComponent height="1200px" />
                        </Card.Body> 
                        
                    </Card>
                </Col>
                
            </Row>
        </React.Fragment>
    );
};

export default FormsElements;
