import React, { useState } from 'react';
import { Row, Col, Form, Card, Button } from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';

import TimeSeries from './chart/TimeSeries';
import Product from './chart/Product';
import Category from './chart/Category';
import ProductTableComponent from './chart/ProductDetail';

<<<<<<< HEAD
// import avatar1 from '../../../assets/images/user/avatar-1.jpg';
// import avatar2 from '../../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../../assets/images/user/avatar-3.jpg';

function TimeFilter() {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
  
    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);
  
    const applyFilter = () => {
      console.log(`Applying filter from ${startTime} to ${endTime}`);
      // Thêm logic để xử lý bộ lọc ở đây
=======
function formatNumber(number) {
    return number.toLocaleString('de-DE', {
        minimumFractionDigits: 0, // Đảm bảo luôn có ít nhất một chữ số sau dấu thập phân
        maximumFractionDigits: 1  // Không cho phép hơn một chữ số sau dấu thập phân
    });
}


// Import hàm từ function.js
const { calculateTotalSales, calculateTotalOrders, 
    calculateTotalQuantity, prepareDataForTimeSeries, 
    calculateTopSalesByProduct, calculateChange,
    calculateSalesByCategory} = require('./function');


function TimeFilter({ onFilterApply }) {
    const [startTime, setStartTime] = useState('2023-09-01');
    const [endTime, setEndTime] = useState('2023-11-30');

    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);

    const applyFilter = (e) => {
        e.preventDefault();
        const sales = calculateTotalSales(startTime, endTime);
        const orders = calculateTotalOrders(startTime, endTime);
        const quantity = calculateTotalQuantity(startTime, endTime);
        const timeseries = prepareDataForTimeSeries(startTime, endTime);
        const change = calculateChange(startTime, endTime);
        const product = calculateTopSalesByProduct(startTime, endTime);
        const category = calculateSalesByCategory(startTime, endTime);
        onFilterApply(sales, orders, quantity, timeseries, change, product, category);
>>>>>>> main
    };

    return (
        <Col md={6} xl={12}>
<<<<<<< HEAD
        {/* Cột mới cho bộ lọc thời gian */}
        <Card>
          <Card.Body>
            <Form>
              <Row form>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Start Time:</Form.Label>
                    <Form.Control type="date" name="startTime" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>End Time:</Form.Label>
                    <Form.Control type="date" name="endTime" />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">Apply</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
=======
            <Card>
                <Card.Body>
                    <Form onSubmit={applyFilter}>
                        <Row form>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Start Time:</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name="startTime" 
                                        value={startTime}
                                        onChange={handleStartTimeChange} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>End Time:</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name="endTime" 
                                        value={endTime}
                                        onChange={handleEndTimeChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">Apply</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
>>>>>>> main
    );
}

const DashDefault = () => {
<<<<<<< HEAD
    return (
        <React.Fragment>
            <Row>
            <TimeFilter />
=======

    const [totalSales, setTotalSales] = useState(0);
    const [totalChange, setTotalChange] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [TopProduct, setTopProduct] = useState([]);
    const [TopCategory, setTopCategory] = useState([]);

    const handleFilterApply = (sales, orders, quantity, timeseries, change, product, category) => {
        setTotalSales(sales);
        setTotalOrders(orders);
        setTotalQuantity(quantity);
        setTimeSeriesData(timeseries);
        setTotalChange(change);
        setTopProduct(product);
        setTopCategory(category)
    };

    return (
        <React.Fragment>
            <Row>
            <TimeFilter onFilterApply={handleFilterApply} />
>>>>>>> main
            <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className="mb-4" style={{ fontSize: '20px' }}>Total Sales (VND)</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />  */}
<<<<<<< HEAD
                                        238.456.000 
=======
                                        {formatNumber(totalSales)}
>>>>>>> main
                                    </h3>
                                </div>

                               
                            </div>
                         
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className="mb-4" style={{ fontSize: '20px' }}>Total Orders</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-down text-c-red f-30 m-r-5" /> */}
<<<<<<< HEAD
                                        15782
=======
                                        {formatNumber(totalOrders)}
>>>>>>> main
                                    </h3>
                                </div>


                            </div>
                         
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className="mb-4" style={{ fontSize: '20px' }}>Total Quantity</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />  */}
<<<<<<< HEAD
                                        45845
=======
                                        {formatNumber(totalQuantity)}
>>>>>>> main
                                    </h3>
                                </div>

                              
                            </div>
                          
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={8}>

                    <MainCard title = "Time Series" isOption>
<<<<<<< HEAD
                            <TimeSeries height="360px" />
=======
                        <TimeSeries data={timeSeriesData} height="360px" />
>>>>>>> main
                    </MainCard>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Header className="borderless">
                            <Card.Title as="h5">
                                Growth Rate
                            </Card.Title>
                        </Card.Header>

                        <hr style={{ margin: '0', borderTop: '1px solid rgba(0,0,0,0.1)' }} /> {/* Đường kẻ phân cách */}

                        <Card.Body className="border-bottom">
                        <div className="row d-flex align-items-center">
                            <div className="col-auto">
<<<<<<< HEAD
                                <i className="feather icon-arrow-up f-30 text-c-green" style={{ fontSize: '60px' }} /> {/* Tăng kích thước icon */}
                            </div>
                            <div className="col">
                                <h3 className="f-w-300" style={{ fontSize: '60px' }}>40%</h3> {/* Tăng kích thước phần trăm */}
=======
                            {
                                totalChange >= 0 ?
                                    <i className="feather icon-arrow-up f-30 text-c-green" style={{ fontSize: '60px' }} /> : 
                                    <i className="feather icon-arrow-down f-30 text-c-red" style={{ fontSize: '60px' }} />  
                            }
                            </div>
                            <div className="col">
                                <h3 className="f-w-300" style={{ fontSize: '60px' }}>{totalChange}%</h3> {/* Tăng kích thước phần trăm */}
>>>>>>> main
                                <span className="d-block text-uppercase" style={{ fontSize: '10px' }}>vs previous year</span> {/* Tăng kích thước chữ */}
                            </div>
                        </div>
                       
                    </Card.Body>


                    </Card>
                    <Card>
                        <Card.Body className="border-bottom">
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-zap f-30 text-c-green" />
                                </div>
                                <div className="col">
<<<<<<< HEAD
                                    <h3 className="f-w-400">54.800.000</h3>
=======
                                    <h3 className="f-w-400">{formatNumber(totalSales/3)}</h3>
>>>>>>> main
                                    <span className="d-block text-uppercase" style={{ fontSize: '12px' }}>Sales Per Month (VND)</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-shopping-cart f-30 text-c-blue" />
                                </div>
                                <div className="col">
<<<<<<< HEAD
                                    <h3 className="f-w-400">8423</h3>
=======
                                    <h3 className="f-w-400">{formatNumber(totalOrders/3)}</h3>
>>>>>>> main
                                    <span className="d-block text-uppercase" style={{ fontSize: '12px' }}>Orders per month</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                

                <Col md={6} xl={8}>
                    <MainCard title = "Top Product" isOption>
<<<<<<< HEAD
                    <Product height="360px" />
=======
                    <Product data={TopProduct} height="360px" />
>>>>>>> main
                    </MainCard>
                </Col>


                <Col md={6} xl={4}>
                    <MainCard title = "Category" isOption>
<<<<<<< HEAD
                        <Category height="360px" />
=======
                        <Category data={TopCategory} height="360px" />
>>>>>>> main
                    </MainCard>
                </Col>

                <Col md={6} xl={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Product Details</Card.Title>
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

export default DashDefault;
