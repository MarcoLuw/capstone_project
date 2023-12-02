import React, { useState } from 'react';
import { Row, Col, Form, Card, Button } from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';

import TimeSeries from './chart/TimeSeries';
import Product from './chart/Product';
import Category from './chart/Category';
import ProductTableComponent from './chart/ProductDetail';

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
    };

    return (
        <Col md={6} xl={12}>
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
    );
}

const DashDefault = () => {
    return (
        <React.Fragment>
            <Row>
            <TimeFilter />
            <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className="mb-4" style={{ fontSize: '20px' }}>Total Sales (VND)</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />  */}
                                        238.456.000 
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
                                        15782
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
                                        45845
                                    </h3>
                                </div>

                              
                            </div>
                          
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={8}>

                    <MainCard title = "Time Series" isOption>
                            <TimeSeries height="360px" />
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
                                <i className="feather icon-arrow-up f-30 text-c-green" style={{ fontSize: '60px' }} /> {/* Tăng kích thước icon */}
                            </div>
                            <div className="col">
                                <h3 className="f-w-300" style={{ fontSize: '60px' }}>40%</h3> {/* Tăng kích thước phần trăm */}
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
                                    <h3 className="f-w-400">54.800.000</h3>
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
                                    <h3 className="f-w-400">8423</h3>
                                    <span className="d-block text-uppercase" style={{ fontSize: '12px' }}>Orders per month</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                

                <Col md={6} xl={8}>
                    <MainCard title = "Top Product" isOption>
                    <Product height="360px" />
                    </MainCard>
                </Col>


                <Col md={6} xl={4}>
                    <MainCard title = "Category" isOption>
                        <Category height="360px" />
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
