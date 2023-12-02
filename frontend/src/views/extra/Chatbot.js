import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../components/Card/MainCard';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, sender: 'user' }]);
            // Gửi tin nhắn đến chatbot ở đây
            // Ví dụ: chatbotResponse(input).then(response => {
            //     setMessages([...messages, { text: response, sender: 'bot' }]);
            // });
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
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ChatbotPage;
