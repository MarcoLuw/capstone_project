import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import MainCard from '../../../components/Card/MainCard';
import axios from 'axios';
import TablePreview from '../chart/Table';
import Barchart from '../chart/Barchart';

const get_data_customer = async (start_date, end_date) => {
    try {
        const params = { start_date, end_date };
        const response = await axios.get('http://localhost:8000/data_prediction/api/getCustomer', {
            withCredentials: true,
            params
        });
        return response.data; // Trả về toàn bộ dữ liệu, bao gồm cả `segment_count` và `data`
    } catch (error) {
        console.error('Failed to fetch data from API:', error);
        return { segment_count: [], data: [] }; // Trả về đối tượng rỗng nếu có lỗi
    }
};

const get_data_predict = async (start_date, end_date) => {
    try {
        const params = { start_date, end_date };
        const response = await axios.get('http://localhost:8000/data_prediction/api/predict', {
            withCredentials: true,
            params
        });
        return response.data; // Trả về dữ liệu dự đoán
    } catch (error) {
        console.error('Failed to fetch prediction data from API:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};

const get_data_basket = async (start_date, end_date) => {
    try {
        const params = { start_date, end_date };
        const response = await axios.get('http://localhost:8000/data_prediction/api/getBasket', {
            withCredentials: true,
            params
        });
        return response.data.data; // Trả về dữ liệu basket
    } catch (error) {
        console.error('Failed to fetch basket data from API:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};

const DashSuggestion = () => {
    const [startTime, setStartTime] = useState('2023-01-01');
    const [endTime, setEndTime] = useState('2023-02-25');
    const [customerData, setCustomerData] = useState({ segment_count: [], data: [] });
    const [trendProductData, setTrendProductData] = useState([]);
    const [comboData, setComboData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleApply = async () => {
        setLoading(true); // Bắt đầu loading

        const customerPromise = get_data_customer(startTime, endTime);
        const trendProductPromise = get_data_predict(startTime, endTime);
        const comboPromise = get_data_basket(startTime, endTime);

        const [customerData, trendProductData, comboData] = await Promise.all([
            customerPromise,
            trendProductPromise,
            comboPromise,
        ]);

        setCustomerData(customerData);
        setTrendProductData(trendProductData);
        setComboData(comboData);
        setLoading(false); // Kết thúc loading

        console.log({ customerData, trendProductData, comboData }); // In dữ liệu ra console
    };

    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label>Start Time:</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="startTime"
                                                value={startTime}
                                                onChange={handleStartTimeChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label>End Time:</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="endTime"
                                                value={endTime}
                                                onChange={handleEndTimeChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="button" onClick={handleApply} disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Apply'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {loading && (
                    <Col xl={12} className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Col>
                )}

                {!loading && (
                    <>
                        <Col key='trend-product' xl={12}>
                            <MainCard title='Trend Product (Next Month)' isOption>
                                <TablePreview data={trendProductData} />
                            </MainCard>
                        </Col>

                        <Col key='recommend-combo' xl={12}>
                            <MainCard title='Recommend Combo' isOption>
                                <TablePreview data={comboData} />
                            </MainCard>
                        </Col>

                        <Col key='segment-customer' xl={12}>
                            <MainCard title='Segment of Customer' isOption>
                                <Barchart id={'segment-customer'} data={customerData.segment_count} height={'360px'} 
                                    categoryfield={'Segment'} valuefield={'Total Customer'} />
                            </MainCard>

                            <MainCard title='Detail of Customer' isOption>
                                <TablePreview data={customerData.data} />
                            </MainCard>
                        </Col>
                    </>
                )}
            </Row>
        </React.Fragment>
    );
};

export default DashSuggestion;
