import React, { useState } from 'react';
import { Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AmChartEarnings from './chart/AmChartEarnings';
import AmChartStatistics6 from './chart/AmChartStatistics6';

import avatar1 from '../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../assets/images/user/avatar-3.jpg';

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
                            <h6 className="mb-4">Total Sales (VND)</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />  */}
                                        238.456.000 
                                    </h3>
                                </div>

                                {/* <div className="col-3 text-right">
                                    <p className="m-b-0">50%</p>
                                </div> */}
                            </div>
                            {/* <div className="progress m-t-30" style={{ height: '7px' }}>
                                <div
                                    className="progress-bar progress-c-theme"
                                    role="progressbar"
                                    style={{ width: '50%' }}
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className="mb-4">Total Orders</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-down text-c-red f-30 m-r-5" /> */}
                                        15782
                                    </h3>
                                </div>

                                {/* <div className="col-3 text-right">
                                <p className="m-b-0">36%</p>
                                </div> */}

                            </div>
                            {/* <div className="progress m-t-30" style={{ height: '7px' }}>
                                <div
                                    className="progress-bar progress-c-theme2"
                                    role="progressbar"
                                    style={{ width: '35%' }}
                                    aria-valuenow="35"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className="mb-4">Total Quantity</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                        {/* <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />  */}
                                        45845
                                    </h3>
                                </div>

                                {/* <div className="col-3 text-right">
                                    <p className="m-b-0">70%</p>
                                </div> */}
                            </div>
                            {/* <div className="progress m-t-30" style={{ height: '7px' }}>
                                <div
                                    className="progress-bar progress-c-theme"
                                    role="progressbar"
                                    style={{ width: '70%' }}
                                    aria-valuenow="70"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={8}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Time Series</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <AmChartStatistics6 height="360px" />
                        </Card.Body>
                    </Card>
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
                        {/* <AmChartEarnings height="180px" /> */}
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
                <Col md={6} xl={4}>
                    <Card className="card-social">
                        <Card.Body className="border-bottom">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fab fa-facebook-f text-primary f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>12,281</h3>
                                    <h5 className="text-c-green mb-0">
                                        +7.2% <span className="text-muted">Total Likes</span>
                                    </h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10">
                                        <span className="text-muted m-r-5">Target:</span>35,098
                                    </h6>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-c-theme"
                                            role="progressbar"
                                            style={{ width: '60%', height: '6px' }}
                                            aria-valuenow="60"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10">
                                        <span className="text-muted m-r-5">Duration:</span>350
                                    </h6>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-c-theme2"
                                            role="progressbar"
                                            style={{ width: '45%', height: '6px' }}
                                            aria-valuenow="45"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card className="card-social">
                        <Card.Body className="border-bottom">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fab fa-twitter text-c-blue f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>11,200</h3>
                                    <h5 className="text-c-purple mb-0">
                                        +6.2% <span className="text-muted">Total Likes</span>
                                    </h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10">
                                        <span className="text-muted m-r-5">Target:</span>34,185
                                    </h6>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-c-green"
                                            role="progressbar"
                                            style={{ width: '40%', height: '6px' }}
                                            aria-valuenow="40"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10">
                                        <span className="text-muted m-r-5">Duration:</span>800
                                    </h6>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-c-blue"
                                            role="progressbar"
                                            style={{ width: '70%', height: '6px' }}
                                            aria-valuenow="70"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="card-social">
                        <Card.Body className="border-bottom">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fab fa-google-plus-g text-c-red f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>10,500</h3>
                                    <h5 className="text-c-blue mb-0">
                                        +5.9% <span className="text-muted">Total Likes</span>
                                    </h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10">
                                        <span className="text-muted m-r-5">Target:</span>25,998
                                    </h6>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-c-theme"
                                            role="progressbar"
                                            style={{ width: '80%', height: '6px' }}
                                            aria-valuenow="80"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10">
                                        <span className="text-muted m-r-5">Duration:</span>900
                                    </h6>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-c-theme2"
                                            role="progressbar"
                                            style={{ width: '50%', height: '6px' }}
                                            aria-valuenow="50"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Rating</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center m-b-20">
                                <div className="col-6">
                                    <h2 className="f-w-300 d-flex align-items-center float-left m-0">
                                        4.7 <i className="fa fa-star f-10 m-l-10 text-c-yellow" />
                                    </h2>
                                </div>
                                <div className="col-6">
                                    <h6 className="d-flex  align-items-center float-right m-0">
                                        0.4 <i className="fa fa-caret-up text-c-green f-22 m-l-10" />
                                    </h6>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">
                                        <i className="fa fa-star f-10 m-r-10 text-c-yellow" />5
                                    </h6>
                                    <h6 className="align-items-center float-right">384</h6>
                                    <div className="progress m-t-30 m-b-20" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar progress-c-theme"
                                            role="progressbar"
                                            style={{ width: '70%' }}
                                            aria-valuenow="70"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">
                                        <i className="fa fa-star f-10 m-r-10 text-c-yellow" />4
                                    </h6>
                                    <h6 className="align-items-center float-right">145</h6>
                                    <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar progress-c-theme"
                                            role="progressbar"
                                            style={{ width: '35%' }}
                                            aria-valuenow="35"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">
                                        <i className="fa fa-star f-10 m-r-10 text-c-yellow" />3
                                    </h6>
                                    <h6 className="align-items-center float-right">24</h6>
                                    <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar progress-c-theme"
                                            role="progressbar"
                                            style={{ width: '25%' }}
                                            aria-valuenow="25"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">
                                        <i className="fa fa-star f-10 m-r-10 text-c-yellow" />2
                                    </h6>
                                    <h6 className="align-items-center float-right">1</h6>
                                    <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar progress-c-theme"
                                            role="progressbar"
                                            style={{ width: '10%' }}
                                            aria-valuenow="10"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">
                                        <i className="fa fa-star f-10 m-r-10 text-c-yellow" />1
                                    </h6>
                                    <h6 className="align-items-center float-right">0</h6>
                                    <div className="progress m-t-30  m-b-5" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{ width: '0%' }}
                                            aria-valuenow="0"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={8}>
                    <Card className="Recent-Users">
                        <Card.Header>
                            <Card.Title as="h5">Recent Users</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0 py-2">
                            <Table responsive hover>
                                <tbody>
                                    <tr className="unread">
                                        <td>
                                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                                        </td>
                                        <td>
                                            <h6 className="mb-1">Isabella Christensen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted">
                                                <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                                11 MAY 12:56
                                            </h6>
                                        </td>
                                        <td>
                                            <Link to="#" className="label theme-bg2 text-white f-12">
                                                Reject
                                            </Link>
                                            <Link to="#" className="label theme-bg text-white f-12">
                                                Approve
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="unread">
                                        <td>
                                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
                                        </td>
                                        <td>
                                            <h6 className="mb-1">Mathilde Andersen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted">
                                                <i className="fa fa-circle text-c-red f-10 m-r-15" />
                                                11 MAY 10:35
                                            </h6>
                                        </td>
                                        <td>
                                            <Link to="#" className="label theme-bg2 text-white f-12">
                                                Reject
                                            </Link>
                                            <Link to="#" className="label theme-bg text-white f-12">
                                                Approve
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="unread">
                                        <td>
                                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
                                        </td>
                                        <td>
                                            <h6 className="mb-1">Karla Sorensen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted">
                                                <i className="fa fa-circle text-c-green f-10 m-r-15" />9 MAY 17:38
                                            </h6>
                                        </td>
                                        <td>
                                            <Link to="#" className="label theme-bg2 text-white f-12">
                                                Reject
                                            </Link>
                                            <Link to="#" className="label theme-bg text-white f-12">
                                                Approve
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="unread">
                                        <td>
                                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                                        </td>
                                        <td>
                                            <h6 className="mb-1">Ida Jorgensen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted f-w-300">
                                                <i className="fa fa-circle text-c-red f-10 m-r-15" />
                                                19 MAY 12:56
                                            </h6>
                                        </td>
                                        <td>
                                            <Link to="#" className="label theme-bg2 text-white f-12">
                                                Reject
                                            </Link>
                                            <Link to="#" className="label theme-bg text-white f-12">
                                                Approve
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="unread">
                                        <td>
                                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
                                        </td>
                                        <td>
                                            <h6 className="mb-1">Albert Andersen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted">
                                                <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                                21 July 12:56
                                            </h6>
                                        </td>
                                        <td>
                                            <Link to="#" className="label theme-bg2 text-white f-12">
                                                Reject
                                            </Link>
                                            <Link to="#" className="label theme-bg text-white f-12">
                                                Approve
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default DashDefault;
