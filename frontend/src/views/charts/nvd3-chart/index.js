import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button} from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';

import ForecastSale from './chart/FcSale';
import TrendingProduct from './chart/TrendingProduct';

function TimeApply() {
    const [period, setPeriod] = useState('Week');
    const [startTime, setStartTime] = useState(new Date().toISOString().split('T')[0]);
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const startDate = new Date(startTime);
        switch (period) {
            case 'Week':
                startDate.setDate(startDate.getDate() + 7);
                break;
            case 'Month':
                startDate.setDate(startDate.getDate() + 30);
                break;
            case 'Quarter':
                startDate.setDate(startDate.getDate() + 90);
                break;
            default:
                break;
        }
        setEndTime(startDate.toISOString().split('T')[0]);
    }, [period, startTime]);

    const applyFilter = () => {
        console.log(`Applying filter from ${startTime} to ${endTime}`);
        // Thêm logic để xử lý bộ lọc ở đây
    };

    return (
        <Col md={6} xl={12}>
            <Card>
                <Card.Body>
                    <Form onSubmit={e => { e.preventDefault(); applyFilter(); }}>
                        <Row form>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Period:</Form.Label>
                                    <Form.Control as="select" value={period} onChange={e => setPeriod(e.target.value)}>
                                        <option value="Week">Week</option>
                                        <option value="Month">Month</option>
                                        <option value="Quarter">Quarter</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Start Time:</Form.Label>
                                    <Form.Control type="date" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>End Time:</Form.Label>
                                    <Form.Control type="date" value={endTime} readOnly />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">Apply</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    );
}

const Forecast = () => {
    return (
        <React.Fragment>
            <Row>
            <TimeApply />
                <Col md={12}>
                    <MainCard title = "Total Sales (VND)" isOption>
                        <ForecastSale height="500px" />
                    </MainCard>
                </Col>

                <Col md={6} xl={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Trending Product</Card.Title>
                        </Card.Header>
                        <Card.Body style={{ padding: 0, marginTop: '-2rem' }}>
                            <TrendingProduct height="1200px" />
                        </Card.Body>   
                        
                    </Card>
                </Col>
                
            </Row>
        </React.Fragment>
    );
};

export default Forecast;
