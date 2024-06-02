import React, { useState ,useRef, useEffect} from 'react';
import { Row, Col, Card, Form, Button, Modal, Table, Spinner } from 'react-bootstrap';
import PreviewData from '../report/chart/previewdata';
import axios from 'axios';
// import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';


const FormsElements = () => {

    const fileInputRef = useRef(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConnectedModal, setShowConnectedModal] = useState(false); // Modal thông báo kết nối thành công
    const [data, setData] = useState([]);
    const [summaryData, setSummaryData] = useState({});
    const [columns, setColumns] = useState([]);
    const [matchingResult, setMatchingResult] = useState({});
    const [userFields, setUserFields] = useState({});
    const [updateUserFields, setUpdateUserFields] = useState({});
    const [loading, setLoading] = useState(false);

    const fieldDescriptions = {
        "order_number": "Unique identifier for the order",
        "order_date": "The date the order was placed",
        "ship_date": "The date the order was shipped",
        "order_quantity": "Number of items ordered",
        "unit_price": "Price per unit of the product",
        "unit_discount": "Discount applied per unit",
        "sales_amount": "Total sales amount",
        "payment_date": "The date the payment was made",
        "product_key": "Unique key for the product",
        "product_name": "Name of the product",
        "product_category": "Category name of the product",
        "price": "Price of the product",
        "weight": "Weight of the product",
        "day": "Day of the month",
        "month": "Month of the year",
        "year": "Year",
        "quarter": "Quarter of the year",
        "day_of_week": "Day of the week",
        "day_of_week_number": "Number of the day in the week",
        "shopee_discount_code": "Discount code applied on Shopee",
        "tracking_code": "Tracking code of the shipment",
        "shipping_company": "Company responsible for shipping",
        "customer_name": "Name of the customer"
    };
    

     // Hàm xử lý khi nhấp vào nút upload
     const handleUploadClick = () => {
        // Kích hoạt click trên thẻ input file
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setLoading(true); // Bắt đầu tải lên

            try {
                const response = await axios.post('http://localhost:8000/userdb/api/import-file', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });

                if (response.data.message === "File uploaded successfully.") {
                    setData(response.data.data)
                    setSummaryData(response.data.summary_data);
                    await showColumns();
                    setShowSuccessModal(true); // Hiển thị modal thông báo thành công
                }
            } catch (error) {
                console.error("There was an error uploading the file:", error);
            } finally {
                setLoading(false); // Kết thúc tải lên
            }
        }
    };

    const showColumns = async () => {
        try {
            const response = await axios.get('http://localhost:8000/data_analysis/api/getMappingColumns', {
                withCredentials: true
            });
            setColumns(response.data.columns);
            setMatchingResult(response.data.matching_result);
            // Initialize userFields with matchingResult values
            const initialUserFields = {};
            Object.keys(response.data.matching_result).forEach(key => {
                initialUserFields[key] = key;
            });
            setUserFields(initialUserFields);
        } catch (error) {
            console.error("Error fetching column names:", error);
        }
    };

    const handleFieldChange = (defaultField, event) => {
        const newField = event.target.value;

        setUserFields({
            ...userFields,
            [defaultField]: newField
        });

        setUpdateUserFields({
            ...updateUserFields,
            [defaultField]: newField
        });
    };

    const handleApplyClick = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/data_analysis/api/updateColumns', updateUserFields, {
                withCredentials: true
            });
            setShowConnectedModal(true);
            setMatchingResult({});
            setUserFields({});
            setUpdateUserFields({});
        } catch (error) {
            console.error("Error updating column mapping:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
        <Row>
            <Col sm={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-center align-items-center">
                            <Card.Title as="h3" className="text-center">Get data to start building a report</Card.Title>
                        </Card.Header>

                        <Card.Body>
                            <Row>
                                <Col md={12} className="d-flex justify-content-end align-items-center">
                                    <Card className="text-center" style={{ width: '100%' }}>
                                        <Card.Body>
                                            <div className="col-auto">
                                                <i className="feather icon-file-text f-30" style={{ fontSize: '100px'}} />
                                            </div>
                                            <Card.Title className="mt-3">From File</Card.Title>
                                            <div className="w-75 mx-auto">  
                                                <Form.Control as="select" className="mb-5">
                                                    <option>Choose..</option>
                                                    <option>Excel</option>
                                                    <option>CSV</option>
                                                </Form.Control>
                                            </div>
                                            <Card.Text>
                                                <Button variant="outline-primary" onClick={handleUploadClick}>Upload File</Button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange} 
                                                />
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>

                            </Row>
                            <Row>
                            <Col className="text-center mt-3">
                                <p><strong>Note:</strong> The analysis results will depend on the quality of your data. Please ensure that your purchase history data includes the following key columns: 
                                <code>Order Date</code>, <code>Order Number</code>, <code>Product Name</code>, <code>Order Quantity</code>, and <code>Total Sales</code>.</p>
                            </Col>

                            </Row>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Preview Data</Card.Title>
                        </Card.Header>
                        <Card.Body style={{ padding: 0, marginTop: '-2rem' }}>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                            ) : (
                                <PreviewData data={data} summary_data={summaryData} height="1200px" />
                            )}
                        </Card.Body>
                    </Card>

                    <Card>
                <Card.Header>
                    <Card.Title as="h5">Mapping Fields</Card.Title>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Default Field</th>
                                    <th>Description</th>
                                    <th>User Field</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(matchingResult).map((defaultField, index) => (
                                    <tr key={index}>
                                        <td>{matchingResult[defaultField].field}</td>
                                        <td>{fieldDescriptions[matchingResult[defaultField].field] || `Description for ${matchingResult[defaultField].field}`}</td>
                                        <td>
                                            <Form.Control as="select" value={userFields[defaultField]} onChange={(e) => handleFieldChange(defaultField, e)}>
                                                {columns.map((col, idx) => (
                                                    <option key={idx} value={col}>{col}</option>
                                                ))}
                                            </Form.Control>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                            <Button variant="primary" onClick={handleApplyClick} disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Apply'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>NOTIFICATION</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Data imported successfully</Modal.Body>
                </Modal>

                <Modal show={showConnectedModal} onHide={() => setShowConnectedModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>NOTIFICATION</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Data connected successfully</Modal.Body>
                </Modal>

        </React.Fragment>
    );
};

export default FormsElements;
