import React, { useState } from 'react';
import { Card, Table, Button, ButtonGroup } from 'react-bootstrap';

const TablePreview = ({ data }) => {
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

    // Lấy danh sách các cột từ dữ liệu đầu tiên (giả sử tất cả các hàng đều có cùng cấu trúc)
    const columns = data[0] ? Object.keys(data[0]) : [];

    // Hàm xử lý khi người dùng nhấn vào nút chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pageCount) {
            setCurrentPage(newPage);
        }
    };

    return (
        <Card>
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
                <ButtonGroup aria-label="Page navigation">
                    <Button variant="secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                        Trước
                    </Button>
                    <Button variant="secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= pageCount}>
                        Sau
                    </Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    );
}

export default TablePreview;
