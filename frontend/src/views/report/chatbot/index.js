import React, { useState } from 'react';
import { Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
import Card from '../../../components/Card/MainCard';
import TablePreview from '../chart/Table'

const table_customer = [
    {
        "customer_name": "Nguyễn Văn An",
        "phone_number": "0912345678",
        "address": "123 Đường ABC, Hà Nội",
        "recency": "7 days",
        "frequency": 12,
        "monetary": "150,000,000 VND",
        "segment": "Khách hàng VIP"
    },
    {
        "customer_name": "Trần Thị Bảo",
        "phone_number": "0923456789",
        "address": "234 Đường DEF, TP.HCM",
        "recency": "15 days",
        "frequency": 10,
        "monetary": "100,000,000 VND",
        "segment": "Khách hàng trung thành"
    },
    {
        "customer_name": "Phạm Hoàng Cường",
        "phone_number": "0934567890",
        "address": "345 Đường GHI, Đà Nẵng",
        "recency": "30 days",
        "frequency": 5,
        "monetary": "50,000,000 VND",
        "segment": "Khách hàng tiềm năng"
    },
    {
        "customer_name": "Lê Thị Dung",
        "phone_number": "0945678901",
        "address": "456 Đường JKL, Cần Thơ",
        "recency": "60 days",
        "frequency": 2,
        "monetary": "20,000,000 VND",
        "segment": "Khách hàng mới"
    },
    {
        "customer_name": "Hoàng Minh Ê",
        "phone_number": "0956789012",
        "address": "567 Đường MNO, Nha Trang",
        "recency": "90 days",
        "frequency": 1,
        "monetary": "10,000,000 VND",
        "segment": "Khách hàng có thể mất"
    },
    {
        "customer_name": "Đỗ Thanh Gia",
        "phone_number": "0967890123",
        "address": "678 Đường PQR, Hải Phòng",
        "recency": "120 days",
        "frequency": 2,
        "monetary": "5,000,000 VND",
        "segment": "Khách hàng đã bỏ lỡ"
    }
]


const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);

    const formatMessage = (message) => {
        return message.split('\n').map((line, index) => <p key={index}>{line}</p>);
      };

    const chatbotResponses = [
        { question: "Cho tôi biết doanh thu tháng 10", answer: "Doanh thu tháng 10 là 100 triệu đồng.", data:""},
        { question: "Lợi nhuận của chúng ta thế nào", answer: "Lợi nhuận tháng này tăng 5% so với tháng trước.", data:""},
        { question: "Số lượng sản phẩm bán ra", answer: "Chúng ta đã bán được 150 sản phẩm trong tháng này.", data:""},
        { question: "Khách hàng mới có bao nhiêu", answer: "Tháng này chúng ta có 20 khách hàng mới.", data:""},
        { question: "Cho tôi biết về thông tin khách hàng", answer: "Tháng này chúng ta có 20 khách hàng mới.", data: table_customer},
    ];

    const chatbot_response = (input) => {
        const response = chatbotResponses.find(item => item.question.toLowerCase() === input.toLowerCase());
        if (response) {
            return { answer: response.answer, data: response.data };
        }
        return { answer: "Tôi không biết câu trả lời cho câu hỏi này.", data: "" };
    };

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const newUserMessage = { text: input, sender: 'user', role: 'You' };
            const { answer, data } = chatbot_response(input);
            
            const botResponseText = formatMessage(answer);
            const botResponse = { 
                text: botResponseText, 
                sender: 'bot', 
                role: 'Assistant',
                data
            };
            
            setMessages(messages => [...messages, newUserMessage, botResponse]);
            setInput('');
            setShowSuggestions(false);
        }
    };
      

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card title="Business Assistant" isOption>
                        <div className="chat-window">
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.sender}`}>
                                    <div>
                                        <i className={`feather icon-${message.sender === 'bot' ? 'airplay' : 'user'}`} style={{ marginRight: '5px' }}></i>
                                        <strong>{message.sender === 'bot' ? 'Assistant' : 'User'}</strong>
                                    </div>
                                    <div>{message.text}</div>
                                    {message.sender === 'bot' && message.data && <TablePreview data={message.data} />}
                                </div>
                            ))}
                        </div>

                        {showSuggestions && (
                            <>
                        
                        <div
                        className="icon d-flex justify-content-center align-items-center">
                           <i className="feather icon-message-square f-30 text-c-blue" style={{ fontSize: '200px' }} /> 
                        </div>

                        <div class="container mt-5">
                        <div class="row">
                            <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">Statistic</h5>
                                <p class="card-text">Show me report about this month's Total sale?</p>
                                </div>
                            </div>
                            </div>
                            <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">Compare</h5>
                                <p class="card-text">Compare food items in 2 recent month?</p>
                                </div>
                            </div>
                            </div>
                            <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">Predict</h5>
                                <p class="card-text">Please let me know which products are become trending?</p>
                                </div>
                            </div>
                            </div>
                            <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">Recommend</h5>
                                <p class="card-text">Propose next month's business plan for me?</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                        </>
                        )}



                        <Form onSubmit={(e) => {
                                e.preventDefault(); // This will prevent the default form submission
                                handleSendMessage();
                            }}>
                                <Form.Group className="d-flex">
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tin nhắn..."
                                            value={input}
                                            onChange={handleInputChange}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <Button variant="primary" type="submit">
                                            Send
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Form>


      
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ChatbotPage;