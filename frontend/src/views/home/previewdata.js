import React, { useState } from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';

const PreviewData = ({ data }) => {
    // Số lượng mục trên mỗi trang
    const itemsPerPage = 10;

    // State để theo dõi trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Tính số lượng trang
    const pageCount = Math.ceil(data.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Helper function to change page
    const setPage = (page) => {
        const newPage = page < 1 ? 1 : page > pageCount ? pageCount : page;
        setCurrentPage(newPage);
    };

    // Lấy danh sách các cột từ dữ liệu đầu tiên (giả sử tất cả các hàng đều có cùng cấu trúc)
    const columns = data[0] ? Object.keys(data[0]) : [];

    return (
        <Card.Body>
            <Table responsive hover>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, columnIndex) => (
                                <td key={columnIndex}>{row[column]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card.Body>
    );
}

export default PreviewData;
