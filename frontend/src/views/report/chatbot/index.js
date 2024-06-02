import React, { useState } from 'react';
import { Row, Col, Form, Button, InputGroup, Spinner, Card as BootstrapCard } from 'react-bootstrap';
import Card from '../../../components/Card/MainCard';
import TablePreview from '../chart/Table';
import axios from 'axios';

const get_chat_bot_result = async (prompt) => {
    try {
        const response = await axios.get('http://localhost:8000/data_analysis/api/getChatBot', {
            withCredentials: true,
            params: { prompt }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data from API:', error);
        return { message: "Your request could not be completed. Please try again.", data: [] };  // Trả về thông điệp lỗi và mảng rỗng nếu có lỗi
    }
};

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [loading, setLoading] = useState(false);

    const formatMessage = (message) => {
        return message.split('\n').map((line, index) => <p key={index}>{line}</p>);
    };

    const handleSendMessage = async (messageText) => {
        if (messageText.trim() !== '') {
            const newUserMessage = { text: messageText, sender: 'user', role: 'You' };
            setMessages(messages => [...messages, newUserMessage]);

            setInput('');  // Clear input immediately
            setLoading(true);  // Set loading to true

            const { message, data, hint } = await get_chat_bot_result(messageText);

            const botResponseText = formatMessage(message);
            const botResponse = {
                text: botResponseText,
                sender: 'bot',
                role: 'Assistant',
                data,
                hint
            };

            setMessages(messages => [...messages, botResponse]);
            setLoading(false);  // Set loading to false
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
                                    {message.sender === 'bot' && message.hint && (
                                        <div className="hints">
                                            {message.hint.map((hint, hintIndex) => (
                                                <BootstrapCard key={hintIndex} className="hint-card" onClick={() => handleSendMessage(hint)}>
                                                    <BootstrapCard.Body>{hint}</BootstrapCard.Body>
                                                </BootstrapCard>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="loading-spinner">
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                            )}
                        </div>

                        {showSuggestions && (
                            <>
                                <div className="icon d-flex justify-content-center align-items-center">
                                    <i className="feather icon-message-square f-30 text-c-blue" style={{ fontSize: '200px' }} />
                                </div>

                                <div className="container mt-5">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Performance</h5>
                                                    <p className="card-text">Know about main metrics like total orders, quantity, sales...</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Product</h5>
                                                    <p className="card-text">Know about KPIs of product or category</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Customer</h5>
                                                    <p className="card-text">Know about information or behavior of customer</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">History</h5>
                                                    <p className="card-text">Know about your business during the period of time</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(input);
                        }}>
                            <Form.Group className="d-flex">
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="What do you want to know about your data?"
                                        value={input}
                                        onChange={handleInputChange}
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
