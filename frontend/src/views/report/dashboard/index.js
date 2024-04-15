import React, { useState, useEffect} from 'react';
import {Modal, Row, Col, Form, Card, Button } from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';

import LineColumnChart from '../chart/Linecolumnchart';
import Barchart from '../chart/Barchart';
import Columnchart from '../chart/Columnchart';
import Piechart from '../chart/Piechart';

function formatNumber(number) {
    return number.toLocaleString('de-DE', {
        minimumFractionDigits: 0, 
        maximumFractionDigits: 1 
    });
}

// Import hàm từ function.js
const {get_column,filter_time_data, 
    get_data_bcp, get_data_card} = require('./function')


const DashDefault = () => {

    const [columns, setColumns] = useState({});
    const [selectedField, setSelectedField] = useState('');
    
    const [updateVisualizations, setUpdateVisualizations] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false); // Để hiển thị/ẩn modal
    const [newVis, setNewVis] = useState({
    width: '',
    height: '',
    title: '',
    type: '',
    id: '',
    data: {},
    fields: [] 
    });

    const [startTime, setStartTime] = useState('2023-09-01');
    const [endTime, setEndTime] = useState('2023-11-30');

    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);

    const applyFilter = (e) => {
        e.preventDefault();
        filter_time_data("order_date", startTime, endTime);
        setUpdateVisualizations(true);
    };

    useEffect(() => {
        setColumns(get_column());
    }, []);

    const renderFunctionOptions = () => {
        if (!selectedField || !columns[selectedField]) {
            return null;
        }

        const fieldType = columns[selectedField];
        let options = [];
        if (fieldType === 'number') {
            options = [
                { label: 'Sum', value: 'SUM' },
                { label: 'Average', value: 'AVERAGE' },
                { label: 'Count', value: 'COUNT' },
                { label: 'Count (Distinct)', value: 'DISTINCT' }
            ];
        } else if (fieldType === 'text') {
            options = [
                { label: 'Count', value: 'COUNT' },
                { label: 'Count (Distinct)', value: 'DISTINCT' }
            ];
        }

        return options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
        ));
    };

    useEffect(() => {
        if (updateVisualizations) {
            const newVisualList = visualList.map(visualization => {
                const { type, fields } = visualization;
                let newData = {};
                if (type === 'Card') {
                    newData = get_data_card(fields.field, fields.agg);
                } else if (type === 'Barchart' || type === 'Columnchart' || type === 'Piechart') {
                    newData = get_data_bcp(fields.categoryfield, fields.valuefield, fields.agg);
                }
                return { ...visualization, data: newData };
            });
            setVisualList(newVisualList);
    
            setUpdateVisualizations(false);
        }
    }, [updateVisualizations]); 
    


    const [visualList, setVisualList] = useState([
        { width: 4, height: '5px', title: 'Total Sales', type: 'Card', id: 'totalsale', data: {}, 
        fields: {"field":"total_sale", "agg":"SUM"}},

        { width: 4, height: '5px', title: 'Total Orders', type: 'Card', id: 'totalorder', data: {}, 
        fields: {"field":"order_count", "agg":"SUM"}},

        { width: 4, height: '5px', title: 'Total Quantity', type: 'Card', id: 'totalquantity', data: {}, 
        fields: {"field":"order_quantity", "agg":"SUM"}},

        { width: 12, height: '360px', title: 'Time Series', type: 'Columnchart', id: 'column-chart', data: {}, 
        fields: {"categoryfield":"order_date","valuefield":"total_sale","agg":"SUM"}},

        { width: 6, height: '360px', title: 'Top Product', type: 'Barchart', id: 'bar-chart', data: {}, 
        fields: {"categoryfield":"product_name","valuefield":"total_sale","agg":"SUM"}},

        { width: 6, height: '360px', title: 'Category', type: 'Piechart', id: 'pie-chart', data: {}, 
        fields: {"categoryfield":"product_category","valuefield":"total_sale","agg":"SUM"}},
    ]);

    const renderVisualization = (visualization) => {
        const fields = visualization.fields;
        switch (visualization.type) {
            case 'Card':
                if (fields) {
                    const {field, agg } = fields;
                    visualization.data = get_data_card(field, agg);
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Card.Body>
                            <div style={{ height: visualization.height, display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                <h3 className="f-w-300">
                                    {formatNumber(visualization.data)}
                                </h3>
                            </div>
                        </Card.Body>
                    </MainCard>
                );
            case 'LineColumnChart':
                return (
                    <MainCard title={visualization.title} isOption>
                        <LineColumnChart id={visualization.id} data={visualization.data} height={visualization.height} />
                    </MainCard>
                );
            case 'Barchart':
                if (fields) {
                    const { categoryfield, valuefield, agg } = fields;
                    visualization.data = get_data_bcp(categoryfield, valuefield, agg);
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Barchart id={visualization.id} data={visualization.data} height={visualization.height} />
                    </MainCard>
                );
            case 'Columnchart':
                if (fields) {
                    const { categoryfield, valuefield, agg } = fields;
                    visualization.data = get_data_bcp(categoryfield, valuefield, agg);
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Columnchart id={visualization.id} data={visualization.data} height={visualization.height} />
                    </MainCard>
                );
            case 'Piechart':
                if (fields) {
                    const { categoryfield, valuefield, agg } = fields;
                    visualization.data = get_data_bcp(categoryfield, valuefield, agg);
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Piechart id={visualization.id} data={visualization.data} height={visualization.height} />
                    </MainCard>
                );
            default:
                return null;
        }
    };

    const renderDashboard = () => {
        return visualList.map((visualization, index) => (
            <Col key={index} xl={visualization.width}>
                {renderVisualization(visualization)}
            </Col>
        ));
    };


    const updateField = (key, value) => {
        let fieldsCopy = {...newVis.fields, agg: 'SUM'};
        fieldsCopy[key] = value;
        setNewVis({...newVis, fields: fieldsCopy});
    };

    const handleAddVisualization = () => {
        const newVisId = `vis-${new Date().getTime()}`;
        const defaultHeight = newVis.type === 'Card' ? '5px' : '360px';
    
        const updatedNewVis = {
            ...newVis,
            id: newVisId,
            width: newVis.width || '6',
            height: newVis.height || defaultHeight,
            title: newVis.title || 'New Visualization',
            fields: newVis.fields 
        };
    
        if (updatedNewVis) {
            setVisualList([...visualList, updatedNewVis]);
            setShowAddModal(false);
            setNewVis({
                width: '',
                height: '',
                title: '',
                type: '',
                id: '',
                data: {},
                fields: []
            });
        } else {
            console.error('Missing fields for visualization');
        }
    };
    

    return (

 
            <React.Fragment>
            <Row>

            <Col xl={12} className="d-flex justify-content-start">
                    <Button variant="secondary"
                        onClick={() => setShowAddModal(true)} 
                        style={{margin: '20px' }}>
                        <i className="feather icon-plus" style={{ color: 'white' }}></i> Add Visualization
                    </Button>

                    <Button variant="secondary"
                        onClick={() => setShowAddModal(true)}
                        style={{margin: '20px' }}>
                        <i className="feather icon-filter" style={{ color: 'white' }}></i> Add Filter
                    </Button>
            </Col>



            <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={applyFilter}>
                                <Row form>
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label>Start Time:</Form.Label>
                                            <Form.Control
                                                type="date" 
                                                name="startTime" 
                                                value={startTime}
                                                onChange={handleStartTimeChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={6}>
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
                                <Button variant="primary" onClick={applyFilter}>Apply</Button>
                            </Form>
                        </Card.Body>
                    </Card>
            </Col>
            
            {renderDashboard()}


            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Visualization</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" value={newVis.title} onChange={(e) => setNewVis({...newVis, title: e.target.value})} />
                    </Form.Group>

                    <Form.Group>
                    <Form.Label>Width: {newVis.width}</Form.Label>
                    <Form.Control 
                        type="range" 
                        min="1" 
                        max="12" 
                        value={newVis.width} 
                        onChange={(e) => setNewVis({...newVis, width: e.target.value})} 
                    />
                    </Form.Group>

                    
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Control as="select" value={newVis.type} onChange={(e) => setNewVis({...newVis, type: e.target.value})}>
                            <option value="">Choose..</option>
                            <option value="Card">Card</option>
                            <option value="Barchart">Bar Chart</option>
                            <option value="Columnchart">Column Chart</option>
                            <option value="Piechart">Pie Chart</option>
                           
                        </Form.Control>
                    </Form.Group>
                    
                    {newVis.type === 'Card' && (
                        <>
                            <Form.Group as={Row}>
                            <Col>
                                <Form.Label>Field</Form.Label>
                                    <Form.Control
                                        as="select"                                
                                        onChange={e => {
                                            const newField = e.target.value;
                                            setSelectedField(newField); // Cập nhật trường được chọn
                                            updateField('field', newField); // Cập nhật trường trong state visualization
                                        }}>
                                    
                                        <option value="">Choose...</option>
                                        {Object.keys(columns).map(field => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                     </Form.Control>
                            </Col>
                            <Col>
                                <Form.Label>Function</Form.Label>
                                <Form.Control as="select" onChange={e => updateField('agg', e.target.value)}>
                                    {renderFunctionOptions()}
                                </Form.Control>
                            </Col>
                            </Form.Group>
                        </>
                    )}

                    {(newVis.type === 'Barchart' || newVis.type === 'Columnchart' || newVis.type === 'Piechart' ) && (
                        <>
                            <Form.Group as={Row}>
                                <Col>
                                <Form.Label>Category Field</Form.Label>
                                    <Form.Control
                                        as="select"
                                        onChange={e => {
                                            updateField('categoryfield', e.target.value); // Cập nhật trường trong state visualization
                                        }}>
                                    
                                        <option value="">Choose...</option>
                                        {Object.keys(columns).map(field => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                     </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Col>
                                <Form.Label>Value Field</Form.Label>
                                    <Form.Control
                                         as="select"
                                         onChange={e => {
                                            const newValue = e.target.value;
                                            setSelectedField(newValue); // Cập nhật trường được chọn
                                            updateField('valuefield', newValue); // Cập nhật trường trong state visualization
                                       }}>
                                    
                                        <option value="">Choose...</option>
                                        {Object.keys(columns).map(field => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                     </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                            <Col>
                                <Form.Label>Function</Form.Label>
                                <Form.Control as="select" onChange={e => updateField('agg', e.target.value)}>
                                    {renderFunctionOptions()}
                                </Form.Control>
                            </Col>
                            </Form.Group>
                        </>
                    )}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                <Button variant="primary" onClick={handleAddVisualization}>Add Visualization</Button>
            </Modal.Footer>
        </Modal>

                
            </Row> 
        </React.Fragment>
    );
};

export default DashDefault;
