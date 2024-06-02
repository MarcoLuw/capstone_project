import React, { useState, useMemo } from 'react';
import { Card, Table, Dropdown, DropdownButton } from 'react-bootstrap';

const PreviewData = ({ data, summary_data = {} }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});

    // Lấy danh sách các cột từ dữ liệu đầu tiên (giả sử tất cả các hàng đều có cùng cấu trúc)
    const columns = data[0] ? Object.keys(data[0]) : [];

    // Hàm sắp xếp
    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    // Hàm lọc dữ liệu
    const filteredData = useMemo(() => {
        return sortedData.filter(row => {
            return Object.keys(filters).every(column => {
                if (!filters[column]) return true;
                return row[column] === filters[column];
            });
        });
    }, [sortedData, filters]);

    // Hàm xử lý khi thay đổi sắp xếp
    const requestSort = key => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Hàm hiển thị biểu tượng sắp xếp
    const getSortIcon = column => {
        if (sortConfig.key !== column) return null;
        if (sortConfig.direction === 'asc') return '↑';
        return '↓';
    };

    // Lấy danh sách các giá trị duy nhất cho mỗi cột
    const getUniqueValues = column => {
        const values = data.map(row => row[column]);
        return [...new Set(values)];
    };

    return (
        <Card.Body>
            {summary_data.total_columns && <h5>Total Columns: {summary_data.total_columns}</h5>}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table responsive hover>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span onClick={() => requestSort(column)} style={{ cursor: 'pointer' }}>
                                            {column} {getSortIcon(column)}
                                        </span>
                                        <DropdownButton
                                            id={`dropdown-${column}`}
                                            title="⋮"
                                            variant="link"
                                            size="sm"
                                            className="ml-2"
                                            menuAlign="right"
                                        >
                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                <Dropdown.Item onClick={() => setFilters({ ...filters, [column]: null })}>
                                                    Clear Filter
                                                </Dropdown.Item>
                                                {getUniqueValues(column).map((value, i) => (
                                                    <Dropdown.Item key={i} onClick={() => setFilters({ ...filters, [column]: value })}>
                                                        {value}
                                                    </Dropdown.Item>
                                                ))}
                                            </div>
                                        </DropdownButton>
                                        {summary_data.table_null && summary_data.table_null[column] !== undefined && (
                                            <small className="text-muted ml-2">Null: {summary_data.table_null[column]}</small>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, columnIndex) => (
                                    <td key={columnIndex}>{row[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            {summary_data.total_rows && <h6>Total Rows: {summary_data.total_rows}</h6>}
        </Card.Body>
    );
}

export default PreviewData;
