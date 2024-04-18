import React, { useState, useEffect} from 'react';
import {Modal, Row, Col, Form, Card, Button, Dropdown} from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';

import LineColumnChart from '../chart/Linecolumnchart';
import Barchart from '../chart/Barchart';
import Columnchart from '../chart/Columnchart';
import Piechart from '../chart/Piechart';
import Linechart from '../chart/Linechart';
import TablePreview from '../chart/Table';

function formatNumber(number) {
    return number.toLocaleString('de-DE', {
        minimumFractionDigits: 0, 
        maximumFractionDigits: 1 
    });
}


// Import hàm từ function.js
const {get_column, get_data_bcp, get_data_card, get_data_table, get_info_filter,filter_field_data} = require('./function')


const DashDefault = () => {

    const [columns, setColumns] = useState({});
    const [selectedField, setSelectedField] = useState('');
    const [filterField, setFilterField] = useState('');
    
    const [updateVisualizations, setUpdateVisualizations] = useState(false);

    const [ShowAddVisual, setShowAddVisual] = useState(false); 
    const [ShowAddFilter, setShowAddFilter] = useState(false); 

    const [filterList, setFilterList] = useState([]);

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


    useEffect(() => {
        setColumns(get_column());
    }, []);

    //FILTER

    const renderFilters = () => {
        return filterList.map(filter => (
            <Dropdown autoClose={false} key={filter.id}>
                <Dropdown.Toggle variant="secondary" id={`dropdown-${filter.id}`} style={{ 
                margin: '20px', 
                backgroundColor: '#babdc2', // Set the background color
                borderColor: '#babdc2', // Set a slightly darker border color
                borderWidth: '1px', // Set the border width
                borderStyle: 'solid', // Ensure the border style is solid
                color: 'white' // Optional: set text color to white for better contrast
            }}>
                    {filter.label}
                </Dropdown.Toggle>
                <Dropdown.Menu className={filter.type === 'includes' ? "custom-dropdown-menu" : ""}>
                    {filter.type === 'includes' && (
                        <>
                            <Dropdown.Item onClick={() => handleToggleAllFilters(filter.id)}>
                                <Form.Check
                                    type="checkbox"
                                    label="All"
                                    checked={filter.values.length === filter.options.length}
                                    onChange={() => {}} // No action needed
                                />
                            </Dropdown.Item>
                            {filter.options.map(option => (
                                <Dropdown.Item key={option.value || option} onClick={() => handleSelectFilter(filter.id, option.value || option)}>
                                    <Form.Check
                                        type="checkbox"
                                        label={option}
                                        checked={filter.values.includes(option)}
                                        onChange={() => {}} // No action needed
                                    />
                                </Dropdown.Item>
                            ))}
                        </>
                    )}
                    {filter.type === 'range' && (
                        <>
                        <Form.Group style={{ padding: '0 10px' }}>
                            <Form.Label>Start:</Form.Label>
                            <Form.Control
                                type="number"
                                value={filter.values[0]}
                                onChange={(e) => handleRangeChange(filter.id, 'start', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group style={{ padding: '0 10px' }}>
                            <Form.Label>End:</Form.Label>
                            <Form.Control
                                type="number"
                                value={filter.values[1]}
                                onChange={(e) => handleRangeChange(filter.id, 'end', e.target.value)}
                            />
                        </Form.Group>
                    </>
                )}
                </Dropdown.Menu>
            </Dropdown>
        ));
    };

    const handleAddFilter = () => {
        const newFilterId = `filter-${new Date().getTime()}`;
        const options = get_info_filter(filterField); // This should return the array of options for the filter
        // Check the type of the filterField in the columns object
        const filterType = columns[filterField] === 'text' ? 'includes' : 'range';
        const newFilter = {
            id: newFilterId,
            label: filterField,
            type: filterType,  // Set type based on the field type
            values: filterType === 'includes' ? 
            options.map(option => option.value || option) : [options[0], options[1]],
            options: options 
        };
    
        setFilterList([...filterList, newFilter]);
        setShowAddFilter(false); // Close the modal or dropdown adding this new filter
    };

    const handleRangeChange = (filterId, mark, value) => {
        const numericValue = Number(value);
    
        // Validate the numeric value
        if (!isNaN(numericValue)) {
            // If valid, update the filter list
            setFilterList(prevFilters => prevFilters.map(filter => {
                if (filter.id === filterId && filter.type === 'range') {
                    // Update the appropriate index based on the 'mark'
                    let newValues = [...filter.values]; // Copy the existing values to a new array
                    if (mark === 'start') {
                        newValues[0] = numericValue; // Update the first element for 'start'
                    } else if (mark === 'end') {
                        newValues[1] = numericValue; // Update the second element for 'end'
                    }
    
                    return { ...filter, values: newValues };
                }
                return filter;
            }));
        } else {
            console.error(`Invalid numeric value for filter ${filterId}:`, value);
        }
    };
    
    
        
    const handleSelectFilter = (filterId, optionValue) => {
        setFilterList(prevFilters => prevFilters.map(filter => {
            if (filter.id === filterId) {
                const currentIndex = filter.values.indexOf(optionValue);
                const newValues = [...filter.values];
                if (currentIndex === -1) {
                    newValues.push(optionValue);  // Add to selections
                } else {
                    newValues.splice(currentIndex, 1);  // Remove from selections
                }
                return { ...filter, values: newValues };
            }
            return filter;
        }));
    };
    

    const handleToggleAllFilters = (filterId) => {
        setFilterList(prevFilters => prevFilters.map(filter => {
            if (filter.id === filterId) {
                if (filter.values.length === filter.options.length) {
                    return { ...filter, values: [] };  // Clear all selections
                } else {
                    return { ...filter, values: filter.options.map(option => option.value || option) };  // Select all options
                }
            }
            return filter;
        }));
    };
    

    useEffect(() => {
        // Create an object to hold filters for all fields based on current filterList settings
        let newFilters = filterList.reduce((acc, filter) => {

            if (filter.type === 'range') {

                acc[filter.label] = {
                    type: filter.type,
                    values: {
                        start: filter.values[0],
                        end: filter.values[1]
                    }
                };

            } else {
   
                acc[filter.label] = {
                    type: filter.type,
                    values: filter.values
                };
            }

            return acc;
        }, {});
   
        // Add the order_date filter
        newFilters["order_date"] = {
            type: "range",
            values: { start: startTime, end: endTime }
        };
   
        filter_field_data(newFilters);
        setUpdateVisualizations(true);

    }, [filterList, columns, startTime, endTime]);

   //VISUALIZATION

    const [visualList, setVisualList] = useState([
        { width: 4, height: '5px', title: 'Total Sales', type: 'Card', id: 'totalsale', data: {}, 
        fields: {"field":"total_sale", "agg":"SUM"}},

        { width: 4, height: '5px', title: 'Total Orders', type: 'Card', id: 'totalorder', data: {}, 
        fields: {"field":"order_count", "agg":"SUM"}},

        { width: 4, height: '5px', title: 'Total Quantity', type: 'Card', id: 'totalquantity', data: {}, 
        fields: {"field":"order_quantity", "agg":"SUM"}},

        { width: 12, height: '360px', title: 'Time Series', type: 'Linechart', id: 'column-chart', data: {}, 
        fields: {"categoryfield":"order_date","valuefield":"total_sale","agg":"SUM"}},

        { width: 6, height: '360px', title: 'Top Product', type: 'Barchart', id: 'bar-chart', data: {}, 
        fields: {"categoryfield":"product_name","valuefield":"total_sale","agg":"SUM"}},

        { width: 6, height: '360px', title: 'Segment of Category', type: 'Piechart', id: 'pie-chart', data: {}, 
        fields: {"categoryfield":"product_category","valuefield":"total_sale","agg":"SUM"}},

        { width: 12, height: '360px', title: 'Product Detail', type: 'Table', id: 'table', data: {}, 
        fields: {}}
    ]);

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
        } else {
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
                } else if (type === 'Barchart' || type === 'Columnchart' || type === 'Piechart' || type === 'Linechart') {
                    newData = get_data_bcp(fields.categoryfield, fields.valuefield, fields.agg);
                } else if (type === 'Table') {
                    newData = get_data_table();
                }
                return { ...visualization, data: newData };
            });
            setVisualList(newVisualList);
    
            setUpdateVisualizations(false);
        }
    }, [updateVisualizations, visualList]); 
    

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
                    visualization.data = get_data_bcp(categoryfield, valuefield, agg,"desc","10");
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Barchart id={visualization.id} data={visualization.data} height={visualization.height} 
                        categoryfield = {visualization.fields.categoryfield} valuefield={visualization.fields.valuefield}/>
                    </MainCard>
                );
            case 'Columnchart':
                if (fields) {
                    const { categoryfield, valuefield, agg } = fields;
                    visualization.data = get_data_bcp(categoryfield, valuefield, agg);
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Columnchart id={visualization.id} data={visualization.data} height={visualization.height}
                        categoryfield = {visualization.fields.categoryfield} valuefield={visualization.fields.valuefield}/>
                    </MainCard>
                );
            case 'Piechart':
                if (fields) {
                    const { categoryfield, valuefield, agg } = fields;
                    visualization.data = get_data_bcp(categoryfield, valuefield, agg,"desc");
                }
                return (
                    <MainCard title={visualization.title} isOption>
                        <Piechart id={visualization.id} data={visualization.data} height={visualization.height} />
                    </MainCard>
                );
                case 'Linechart':
                    if (fields) {
                        const { categoryfield, valuefield, agg } = fields;
                        visualization.data = get_data_bcp(categoryfield, valuefield, agg);
                    }
                    return (
                        <MainCard title={visualization.title} isOption>
                            <Linechart id={visualization.id} data={visualization.data} height={visualization.height}
                            categoryfield = {visualization.fields.categoryfield} valuefield={visualization.fields.valuefield}/>
                        </MainCard>
                    );
                case 'Table':
                    if (fields) {
                        visualization.data = get_data_table();
                    }
                    return (
                        <MainCard title={visualization.title} isOption>
                            <TablePreview data={visualization.data}/>
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
            setShowAddVisual(false);
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
            <Button variant="secondary" onClick={() => setShowAddVisual(true)} style={{ margin: '20px' }}>
                <i className="feather icon-plus" style={{ color: 'white' }}></i> Add Visualization
            </Button>

            <Button variant="secondary" onClick={() => setShowAddFilter(true)} style={{ margin: '20px' }}>
                <i className="feather icon-filter" style={{ color: 'white' }}></i> Add Filter
            </Button>

            {renderFilters()}


        </Col>

            <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Form>
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
                            </Form>
                        </Card.Body>
                    </Card>
            </Col>
            
            {renderDashboard()}


            <Modal show={ShowAddVisual} onHide={() => setShowAddVisual(false)}>
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
                            <option value="Linechart">Line Chart</option>
                            <option value="Piechart">Pie Chart</option>
                            <option value="Table">Table</option>
                           
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

                    {(newVis.type === 'Barchart' || newVis.type === 'Columnchart' || newVis.type === 'Piechart' || newVis.type === 'Linechart' ) && (
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

                    {newVis.type === 'Table' && (
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

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddVisual(false)}>Close</Button>
                <Button variant="primary" onClick={handleAddVisualization}>Add Visualization</Button>
            </Modal.Footer>
        </Modal>


        <Modal show={ShowAddFilter} onHide={() => setShowAddFilter(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Filter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                <Form.Group as={Row}>
                            <Col>
                                <Form.Label>Field</Form.Label>
                                    <Form.Control
                                        as="select"                           
                                        onChange={e => {
                                            setFilterField(e.target.value);
                                        }}>
                                    
                                        <option value="">Choose...</option>
                                        {Object.keys(columns).map(field => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                     </Form.Control>
                            </Col>

                </Form.Group>
    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddFilter(false)}>Close</Button>
                <Button variant="primary" onClick={handleAddFilter}>Add Filter</Button>
            </Modal.Footer>
        </Modal>

                
            </Row> 
        </React.Fragment>
    );
};

export default DashDefault;
