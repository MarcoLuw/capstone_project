import React, { useState ,useRef} from 'react';
import { Row, Col, Card, Form, Button, Modal} from 'react-bootstrap';
import PreviewData from './previewdata';
import axios from 'axios';
import { API_SERVER } from '../../config/constant'
// import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';


const FormsElements = () => {

    // Tạo một ref cho thẻ input file
    const fileInputRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Thêm state này để quản lý modal thành công
    const [errorMessage, setErrorMessage] = useState(''); // State để hiển thị thông báo lỗi

    // State mới để lưu trữ dữ liệu từ API
    const [data, setData] = useState([]);


    // Khởi tạo state connect_db để lưu trữ thông tin database
    const [connect_db, setConnectDb] = useState({
        engine: "mysql", // engine luôn luôn là "mysql" nên set sẵn giá trị
        host: "",
        user: "",
        password: "",
        name: "",
        port: "3306" // Port có thể set giá trị mặc định là "3306"
    });

    // Hàm xử lý khi nhấp vào nút upload
    const handleUploadClick = () => {
        // Kích hoạt click trên thẻ input file
        fileInputRef.current.click();
    };

    // Hàm để mở Modal
    const handleConnectClick = () => {
        setConnectDb({
            engine: "mysql", // Giữ nguyên giá trị engine là mysql nếu bạn muốn
            host: "",
            user: "",
            password: "",
            name: "",
            port: "3306" // Giữ giá trị mặc định cho port nếu bạn muốn
        });
        setShowModal(true);
    };

    // Hàm để đóng Modal
    const handleClose = () => {
        setConnectDb({
            engine: "mysql", // Giữ nguyên giá trị engine là mysql nếu bạn muốn
            host: "",
            user: "",
            password: "",
            name: "",
            port: "3306" // Giữ giá trị mặc định cho port nếu bạn muốn
        });
        setShowModal(false);
    };

     // Cập nhật state khi người dùng nhập vào form
     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConnectDb(prevState => ({
            ...prevState,
            [name]: value // Cập nhật giá trị cho key tương ứng dựa vào thuộc tính name của input
        }));
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

    
            try {
                const response = await axios.post(API_SERVER + '/userdb/api/import-file/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (response.data.message === "File uploaded successfully.") {
                    setData(response.data.data)
                    setShowSuccessModal(true); // Hiển thị modal thông báo thành công
                }
            } catch (error) {
                console.error("There was an error uploading the file:", error);
                setErrorMessage("Error uploading file");
            }
        }
    };

     // Hàm để gửi dữ liệu đến backend bằng axios
     const handleSubmit = async () => {
        try {
            console.log(connect_db)
            const response = await axios.post(API_SERVER + '/userdb/api/import-data/', connect_db);

            const data = response.data;
            
            if (data.message === "Data imported succesfully.") {
                setShowModal(false); // Đóng modal hiện tại
                setShowSuccessModal(true); // Hiển thị modal thành công
                setErrorMessage(''); // Xóa thông báo lỗi (nếu có)
            }

        } catch (error) {
            // Xử lý lỗi từ API
            setErrorMessage('All fields are required');
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
                                <Col md={6} className="d-flex justify-content-end align-items-center">
                                    <Card className="text-center" style={{ width: '90%' }}>
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


                                <Col md={6} className="d-flex justify-content-start align-items-center">
                                    <Card className="text-center" style={{ width: '90%' }}> 
                                        <Card.Body>
                                        <div className="col-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" 
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                            className="feather feather-database">
                                                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                            </svg>
                                        </div>

                                            <Card.Title className="mt-3">From Database</Card.Title>
                                            <div className="w-75 mx-auto">  
                                            <Form.Control as="select" className="mb-5">
                                                    <option>Choose..</option>
                                                    <option>SQL Server</option>
                                                    <option>MySQL</option>
                                                    <option>Postgre</option>
                                            </Form.Control>
                                            </div>
                                            <Card.Text>
                                                 <Button variant="outline-primary" onClick={handleConnectClick}>Connect</Button>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Modal show={showModal} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>MySQL database</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                        <Form>
                                    <Form.Group>
                                        <Form.Label>Server</Form.Label>
                                        <Form.Control type="text" name="host" placeholder="Enter Server name" onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>User</Form.Label>
                                        <Form.Control type="text" name="user" placeholder="Enter Username" onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="text" name="password" placeholder="Enter Password" onChange={handleInputChange} />
                                    </Form.Group>   

                                    <Form.Group>
                                        <Form.Label>Database</Form.Label>
                                        <Form.Control type="text" name="name" placeholder="Enter Database name" onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Port (optional)</Form.Label>
                                        <Form.Control type="text" name="port" placeholder="Enter Port number (Default 3306)" onChange={handleInputChange} />
                                    </Form.Group>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleSubmit}>
                                                OK
                                            </Button>
                                        </Form>
                                    </Modal.Body>
                                </Modal>
                                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>NOTIFICATION</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Data imported successfully</Modal.Body>
                                </Modal>
                            </Row>
                            <Row>
                                <Col className="text-center mt-3">
                                    <a href="#">Don't understand how to connect your database? See the instruction.</a>
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
                </Col>
                
            </Row>
        </React.Fragment>
    );
};

export default FormsElements;
