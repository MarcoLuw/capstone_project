import React, { useState ,useRef, useEffect} from 'react';
import { Row, Col, Card, Form, Button, Modal, Table} from 'react-bootstrap';
import PreviewData from './previewdata';
import axios from 'axios';
// import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';


const FormsElements = () => {

    const fileInputRef = useRef(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConnectedModal, setShowConnectedModal] = useState(false); // Modal thông báo kết nối thành công
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [matchingResult, setMatchingResult] = useState({});
    const [userFields, setUserFields] = useState({});
    const [updateUserFields, setUpdateUserFields] = useState({});

    const fieldDescriptions = {
        "order_date": "The date the order was placed",
        "order_number": "Unique identifier for the order",
        "order_line_number": "Unique identifier for the order line",
        "order_quantity": "Number of items ordered",
        "unit_price": "Price per unit of the product",
        "total_sale": "Total sales amount",
        "product_key": "Unique key for the product",
        "product_name": "Name of the product",
        "product_subcategory": "Subcategory of the product",
        "product_category": "Category of the product",
        "customer_key": "Unique key for the customer",
        "first_name": "Customer's first name",
        "last_name": "Customer's last name",
        "full_name": "Customer's full name"
    };


    useEffect(() => {
        // Fetch column data when component mounts
        showColumns();
    }, []);

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

    
            try {
                const response = await axios.post('http://localhost:8000/userdb/api/import-file', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
    
                if (response.data.message === "File uploaded successfully.") {
                    setData(response.data.data)
                    setShowSuccessModal(true); // Hiển thị modal thông báo thành công
                    await showColumns();
                }
            } catch (error) {
                console.error("There was an error uploading the file:", error);
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
                            <PreviewData data={data} height="1200px" />
                        </Card.Body> 
                        
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Mapping Fields</Card.Title>
                        </Card.Header>
                        <Card.Body>
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
                            <Button variant="primary" onClick={handleApplyClick}>Apply</Button>
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
