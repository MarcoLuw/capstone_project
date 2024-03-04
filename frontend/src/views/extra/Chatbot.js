import React, { useState } from 'react';
<<<<<<< HEAD
import { Row, Col, Form, Button } from 'react-bootstrap';
=======
import { Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
>>>>>>> main
import Card from '../../components/Card/MainCard';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

<<<<<<< HEAD
    const handleSendMessage = () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, sender: 'user' }]);
            // Gửi tin nhắn đến chatbot ở đây
            // Ví dụ: chatbotResponse(input).then(response => {
            //     setMessages([...messages, { text: response, sender: 'bot' }]);
            // });
=======
    const formatMessage = (message) => {
        return message.split('\n').map((line, index) => <p key={index}>{line}</p>);
      };

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const newUserMessage = { text: input, sender: 'user' };
            const botResponseText = `Tháng 10:
            Tổng số lượng đơn hàng: 160,796
            Tổng số lượng sản phẩm bán được: 1,592,711
            Tổng doanh thu: 527,326,651,800 VND
            Tháng 11:
            Tổng số lượng đơn hàng: 155,219 (giảm so với tháng 10)
            Tổng số lượng sản phẩm bán được: 1,539,614 (giảm so với tháng 10)
            Tổng doanh thu: 508,170,425,600 VND (giảm so với tháng 10)
            Sản phẩm bán chạy nhất trong tháng 11:
            Miến khác: 109,713 sản phẩm
            Cafe đen lon: 79,846 sản phẩm
            Cháo Yến Mạch Và Các Loại Dâu: 77,964 sản phẩm
            Xay tiêu, tỏi: 60,368 sản phẩm
            Cháo ly: 56,983 sản phẩm
            Như vậy, so với tháng 10, tháng 11 có sự giảm nhẹ về tổng số lượng đơn hàng, tổng số lượng sản phẩm bán được và tổng doanh thu. Các sản phẩm bán chạy nhất trong tháng 11 chủ yếu là các loại thực phẩm và đồ uống.`

            const botResponse = { 
                text: formatMessage(botResponseText), 
                sender: 'bot' 
              };

            
            setMessages(messages => [...messages, newUserMessage, botResponse]);
>>>>>>> main
            setInput('');
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
                                    {message.text}
                                </div>
                            ))}
                        </div>

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



<<<<<<< HEAD
                        <Form>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={input}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Form>
=======
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


      
>>>>>>> main
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ChatbotPage;
