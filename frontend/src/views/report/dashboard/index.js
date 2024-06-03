import React, { useState, useEffect} from 'react';
import {Modal, Row, Col, Form, Card, Button, Dropdown, Spinner} from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';
import axios from 'axios';

import LineColumnChart from '../chart/Linecolumnchart';
import Barchart from '../chart/Barchart';
import Columnchart from '../chart/Columnchart';
import Piechart from '../chart/Piechart';
import Linechart from '../chart/Linechart';
import PreviewData from '../chart/previewdata';

function formatNumber(number) {
    return number.toLocaleString('de-DE', {
        minimumFractionDigits: 0, 
        maximumFractionDigits: 1 
    });
}



const DashDefault = () => {

    const [columns, setColumns] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [fieldInfo, setFieldInfo] = useState('');
    const [filterField, setFilterField] = useState('');
    
    const [loading, setLoading] = useState(true);

    const [ShowAddVisual, setShowAddVisual] = useState(false); 
    const [ShowAddFilter, setShowAddFilter] = useState(false); 

    const [filterList, setFilterList] = useState([]);

    const [matchingResult, setMatchingResult] = useState({});

    const [visualList, setVisualList] = useState([]);

    const [newVis, setNewVis] = useState({
    width: '',
    height: '',
    title: '',
    type: '',
    id: '',
    data: {},
    fields: [] 
    });


    const [startTime, setStartTime] = useState('2022-07-01');
    const [endTime, setEndTime] = useState('2022-10-30');

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
        setLoading(true);
    };
    
    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
        setLoading(true);
    };
    



    //API

    const postVisualList = async (visualList) => {
        try {
            const response = await axios.post('http://localhost:8000/userdb/api/dashboard-state', {
                visualist: visualList
            }, {
                withCredentials: true
            });
            console.log('Successfully posted visual list:', response.data);
        } catch (error) {
            console.error('Failed to post visual list:', error);
        }
    };
    

    const convertFiltersToParams = (filterList, startTime, endTime, orderDateField) => {
        const params = {};
        let filterIndex = 1;
    
        // Add the date filter directly
        params[`filter_field${filterIndex}`] = orderDateField;
        params[`filter_field${filterIndex}_start`] = startTime;
        params[`filter_field${filterIndex}_end`] = endTime;
        filterIndex++;
    
        for (const filter of filterList) {
            const key = filter.label;
            const value = filter.values;
    
            params[`filter_field${filterIndex}`] = key;
    
            if (filter.type === 'range') {
                params[`filter_field${filterIndex}_start`] = value[0];
                params[`filter_field${filterIndex}_end`] = value[1];
            } else {
                params[`filter_value${filterIndex}`] = value.join(',');
            }
    
            filterIndex++;
        }
    
        return params;
    };
    
    

    const get_data_card = async (field, agg, filters) => {
        try {
            const params = { field, agg, ...filters};
            const response = await axios.get('http://localhost:8000/data_analysis/api/getDataCard', {
                withCredentials: true,
                params
            });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch data from API:', error);
            return [];  // Trả về mảng rỗng nếu có lỗi
        }
    };
    
    const get_data_bcp = async (categoryfield, valuefield, agg, sort_category, sort_value, top, filters) => {
        try {
            const params = { categoryfield, valuefield, agg, sort_category, sort_value, top, ...filters};
            const response = await axios.get('http://localhost:8000/data_analysis/api/getDataBCP', {
                withCredentials: true,
                params
            });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch data from API:', error);
            return [];  // Trả về mảng rỗng nếu có lỗi
        }
    };
    
    const get_data_table = async (list_field, filters) => {
        try {
            const params = { list_field, ...filters}; 
            const response = await axios.get('http://localhost:8000/data_analysis/api/getDataTable', {
                withCredentials: true,
                params
            });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch table data from API:', error);
            return [];  // Trả về mảng rỗng nếu có lỗi
        }
    };
    
    

    // API call to get all columns
    const get_all_columns = async () => {
        try {
            const response = await axios.get('http://localhost:8000/data_analysis/api/getAllColumns', {
                withCredentials: true
            });
            const matchingResult = response.data.matching_result;
            setMatchingResult(matchingResult);

            // Extract keys from matching_result and set columns state
            const columnsList = Object.keys(matchingResult);
            setColumns(columnsList);

        } catch (error) {
            console.error('Failed to fetch columns from API:', error);
            setColumns([]);
        }
    };

    useEffect(() => {
        get_all_columns(); // Fetch columns when component mounts
    }, []);

    const get_info_field = async (field) => {
        try {
            const response = await axios.get('http://localhost:8000/data_analysis/api/getInfoField', {
                withCredentials: true,
                params: { field }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch field info from API:', error);
            return null;  // Trả về null nếu có lỗi
        }
    };
    



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

    const handleAddFilter = async () => {
        const newFilterId = `filter-${new Date().getTime()}`;
    
        const fieldInfo = await get_info_field(filterField); // Gọi API để lấy thông tin về trường
        if (!fieldInfo) {
            console.error('Failed to fetch field info.');
            return;
        }
    
        // Phân tích phản hồi từ API để xác định loại và giá trị của bộ lọc
        const filterType = fieldInfo.type === 'varchar' ? 'includes' : 'range';
        let options = [];
        let values = [];
    
        if (filterType === 'includes') {
            options = fieldInfo.values;
            values = options.map(option => option.value || option);
        } else if (filterType === 'range') {
            options = [fieldInfo.values.min, fieldInfo.values.max];
            values = [options[0], options[1]];
        }
    
        const newFilter = {
            id: newFilterId,
            label: filterField,
            type: filterType,  // Set type based on the field type
            values: values,
            options: options
        };
    
        setFilterList(prevFilterList => [...prevFilterList, newFilter]);
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
            setLoading(true); // Trigger data reload
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
        setLoading(true); // Trigger data reload
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
        setLoading(true); // Trigger data reload
    };

   //VISUALIZATION
   
    // Tạo hàm ánh xạ field
    const createFieldMap = (matchingResult) => {
        const fieldMap = {};
        Object.entries(matchingResult).forEach(([userField, { field }]) => {
            fieldMap[field] = userField;
        });
        return fieldMap;
    };

    useEffect(() => {
        if (Object.keys(matchingResult).length > 0) {
            const fieldMap = createFieldMap(matchingResult);

            setVisualList([
                { width: 4, height: '5px', title: 'Total Sales', type: 'Card', id: 'totalsale', data: {}, fields: { field: fieldMap['sales_amount'] || '', agg: 'SUM' } },
                { width: 4, height: '5px', title: 'Total Orders', type: 'Card', id: 'totalorder', data: {}, fields: { field: fieldMap['order_number'] || '', agg: 'DISTINCT' } },
                { width: 4, height: '5px', title: 'Total Quantity', type: 'Card', id: 'totalquantity', data: {}, fields: { field: fieldMap['order_quantity'] || '', agg: 'SUM' } },
                { width: 12, height: '360px', title: 'Time Series', type: 'Linechart', id: 'column-chart', data: {}, fields: { categoryfield: fieldMap['order_date'] || '', valuefield: fieldMap['sales_amount'] || '', agg: 'SUM', sort_category: 'ASC', top: 120 } },
                { width: 6, height: '360px', title: 'Top Product', type: 'Barchart', id: 'bar-chart', data: {}, fields: { categoryfield: fieldMap['product_name'] || '', valuefield: fieldMap['sales_amount'] || '', agg: 'SUM', sort_value: 'DESC', top: 10 } },
                { width: 6, height: '360px', title: 'Segment of Category', type: 'Piechart', id: 'pie-chart', data: {}, fields: { categoryfield: fieldMap['product_category'] || '', valuefield: fieldMap['sales_amount'] || '', agg: 'SUM', sort_value: 'DESC' } },
                { width: 12, height: '360px', title: 'Product Detail', type: 'Table', id: 'table', data: {}, fields: [fieldMap['order_date'] || '', fieldMap['product_name'] || '', fieldMap['product_category'] || '', fieldMap['order_quantity'] || '', fieldMap['sales_amount'] || ''] }
            ]);
        }
    }, [matchingResult]);

    useEffect(() => {
        if (visualList.length > 0) {  // Ensure there's at least one visualization
            postVisualList(visualList);
        }
    }, [visualList]);
    

    useEffect(() => {
        const fetchFieldInfo = async () => {
            if (selectedField) {
                const info = await get_info_field(selectedField);
                setFieldInfo(info);
            }
        };

        fetchFieldInfo();
    }, [selectedField]);

    const renderFunctionOptions = () => {
        if (!fieldInfo) {
            return null;
        }

        const fieldType = fieldInfo.type;
        let options = [];
        let numeric_types = ['integer','float','tinyint','bigint', 'smallint', 'real', 'double']
        if (numeric_types.includes(fieldType)) {
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
        const fetchVisualData = async () => {
            if (Object.keys(matchingResult).length > 0) {
                const fieldMap = createFieldMap(matchingResult);
                const orderDateField = fieldMap['order_date'];
    
                // Compute filterParams once
                const filterParams = convertFiltersToParams(filterList, startTime, endTime, orderDateField);
    
                const promises = visualList.map(async (visual) => {
                    const { type, fields } = visual;
                    let data;
    
                    try {
                        if (fields && ['Barchart', 'Columnchart'].includes(type)) {
                            const { categoryfield, valuefield, agg, sort_category, sort_value, top } = fields;
                            data = await get_data_bcp(categoryfield, valuefield, agg, sort_category, 'DESC', 10, filterParams);
                        } else if (fields && type === 'Linechart') {
                            const { categoryfield, valuefield, agg, sort_category, sort_value, top } = fields;
                            data = await get_data_bcp(categoryfield, valuefield, agg, 'ASC', sort_value, 120, filterParams);
                        } else if (fields && type === 'Piechart') {
                            const { categoryfield, valuefield, agg, sort_category, sort_value, top } = fields;
                            data = await get_data_bcp(categoryfield, valuefield, agg, sort_category, sort_value, top, filterParams);
                        } else if (fields && type === 'Card') {
                            const { field, agg } = fields;
                            data = await get_data_card(field, agg, filterParams);
                        } else if (fields && type === 'Table') {
                            const list_field_str = fields.join(',');
                            data = await get_data_table(list_field_str, filterParams);
                        }
                    } catch (error) {
                        console.error('Failed to fetch data:', error);
                        data = null; // Set default value on error
                    }
    
                    return { ...visual, data: data };
                });
    
                const visualsWithData = await Promise.all(promises);
                setVisualList(visualsWithData);
                setLoading(false);
            }
        };
    
        if (loading) {
            fetchVisualData();
        }
    }, [loading, visualList, filterList, startTime, endTime, matchingResult]);
    
    

    const renderVisualization = (visualization) => {
        const { type, title, data, id, height, fields } = visualization;

        const ChartComponent = {
            'Barchart': Barchart,
            'Columnchart': Columnchart,
            'Piechart': Piechart,
            'Linechart': Linechart,
            'Card': Card,
            'Table': PreviewData,
        }[type];

        if (!ChartComponent) return null;

        if (type === 'Table') {

            return (
                <MainCard title={title} isOption data={data}>
                    <PreviewData data={data} />
                </MainCard>
            );
        }

        else if (type === 'Card') {
            return (
                <MainCard title={title} isOption>
                    <Card.Body>
                        <div style={{ height: height, display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                            <h3 className="f-w-300">
                                {formatNumber(data)}
                            </h3>
                        </div>
                    </Card.Body>
                </MainCard>
            );
        } else {
            return (
                <MainCard title={title} isOption data={data}>
                    <ChartComponent id={id} data={data} height={height}
                    categoryfield={fields.categoryfield} valuefield={fields.valuefield} 
                    sort_category={fields.sort_category} sort_value={fields.sort_value} top = {fields.top} />
                </MainCard>
            );
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

    // Hàm này cập nhật danh sách các trường khi người dùng thêm mới
    const addFieldTable = (newField, index) => {
        setNewVis(prevState => {
            // Kiểm tra nếu newField là chuỗi rỗng, tức là yêu cầu thêm trường mới
            if (newField === '') {
                return {
                    ...prevState,
                    fields: [...prevState.fields, '']  // Thêm trường rỗng vào mảng `fields`
                };
            } else {
                // Cập nhật giá trị cho trường hiện tại
                // Sử dụng index để xác định trường nào đang được cập nhật
                const updatedFields = prevState.fields.map((field, idx) =>
                    idx === index ? newField : field
                );
                return {
                    ...prevState,
                    fields: updatedFields
                };
            }
        });
    };

    const fetchNewVisualData = async (visual) => {
        const { type, fields } = visual;
        let data;
    
        if (fields && ['Barchart', 'Columnchart'].includes(type)) {
            const { categoryfield, valuefield, agg, sort_category } = fields;
            data = await get_data_bcp(categoryfield, valuefield, agg, sort_category, 'DESC', 10);
        } else if (fields && type === 'Linechart') {
            const { categoryfield, valuefield, agg, sort_value} = fields;
            data = await get_data_bcp(categoryfield, valuefield, agg, 'ASC', sort_value, 30);
        } else if (fields && type === 'Piechart') {
            const { categoryfield, valuefield, agg, sort_category, sort_value, top } = fields;
            data = await get_data_bcp(categoryfield, valuefield, agg, sort_category, sort_value, top);
        } else if (fields && type === 'Card') {
            const { field, agg } = fields;
            data = await get_data_card(field, agg);
        } else if (fields && type === 'Table') {
            const list_field_str = fields.join(',');
            data = await get_data_table(list_field_str);
        }
    
        return { ...visual, data };
    };
    

    const handleAddVisualization = async () => {
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
            const newVisualWithData = await fetchNewVisualData(updatedNewVis);
            setVisualList([...visualList, newVisualWithData]);
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
            
            {loading ? (
                    <Col xl={12} className="d-flex justify-content-center" style={{ marginTop: '20px' }}>
                        <div className="spinner-container">
                            <Spinner animation="border" role="status" variant="primary" />
                            <div className="spinner-text">Loading visualizations...</div>
                        </div>
                    </Col>
                ) : (
                    renderDashboard()
                )}


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
                                        {columns.map(field => (
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
                                        {columns.map(field => (
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
                                        {columns.map(field => (
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
                            {newVis.fields.map((field, index) => (
                                <Form.Group as={Row} key={index}>
                                    <Col>
                                        <Form.Label>Field</Form.Label>
                                        <Form.Control
                                            as="select"  
                                            value={field}                              
                                            onChange={e => addFieldTable(e.target.value, index)}>
                                            <option value="">Choose...</option>
                                            {columns.map(field => (
                                            <option key={field} value={field}>{field}</option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            ))}
                            <Button onClick={() => addFieldTable('')}>+ Add Field</Button>
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
                                        {columns.map(field => (
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
