import React, { useState } from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';

// Dữ liệu sản phẩm mẫu
const productsData = [
    { id: 1, name: "Bếp gas", price: "1.500.000 VND", category: "Đồ dùng nhà bếp", brand: "Sunhouse", current: 124, predict: 200, growth: 30.1 },
    { id: 2, name: "Quạt điện", price: "800.000 VND", category: "Đồ điện gia dụng", brand: "Asia", current: 98, predict: 150, growth:28.5 },
    { id: 3, name: "Nồi cơm điện", price: "1.200.000 VND", category: "Đồ dùng nhà bếp", brand: "Panasonic", current: 73, predict: 100, growth: 15.4 },
    { id: 4, name: "Máy lọc nước", price: "3.000.000 VND", category: "Thiết bị nhà bếp", brand: "Kangaroo", current: 56, predict: 80, growth: 40.6 },
    { id: 5, name: "Máy giặt", price: "6.000.000 VND", category: "Đồ điện tử", brand: "Samsung", current: 87, predict: 60, growth: 12.5 },
    { id: 6, name: "Tủ lạnh", price: "9.000.000 VND", category: "Điện lạnh", brand: "Toshiba", current: 49, predict: 49, growth: 35.6 },
    { id: 7, name: "Điều hòa nhiệt độ", price: "10.000.000 VND", category: "Điện lạnh", brand: "Daikin", current: 34, predict: 35, growth: 13.5 },
    { id: 8, name: "Máy xay sinh tố", price: "500.000 VND", category: "Đồ dùng nhà bếp", brand: "Philips", current: 150, predict: 200, growth: 23.5 },
    { id: 9, name: "Lò vi sóng", price: "2.500.000 VND", category: "Đồ dùng nhà bếp", brand: "LG", current: 65, predict: 65, growth: 34.5 },
    { id: 10, name: "Máy giặt", price: "6.000.000 VND", category: "Đồ điện tử", brand: "Samsung", current: 87, predict: 60, growth: 12.6 },
    { id: 11, name: "Tủ lạnh", price: "9.000.000 VND", category: "Điện lạnh", brand: "Toshiba", current: 49, predict: 49, growth: 8.6 },
    { id: 12, name: "Điều hòa nhiệt độ", price: "10.000.000 VND", category: "Điện lạnh", brand: "Daikin", current: 34, predict: 35, growth: 14.6 },
    { id: 13, name: "Máy xay sinh tố", price: "500.000 VND", category: "Đồ dùng nhà bếp", brand: "Philips", current: 150, predict: 200, growth: 5.6 },
    { id: 14, name: "Lò vi sóng", price: "2.500.000 VND", category: "Đồ dùng nhà bếp", brand: "LG", current: 65, predict: 65, growth: 7.8 },
    { id: 15, name: "Bàn ủi", price: "400.000 VND", category: "Đồ điện gia dụng", brand: "Electrolux", current: 120, predict: 180, growth: 9.4 },
    { id: 16, name: "Bàn ủi", price: "400.000 VND", category: "Đồ điện gia dụng", brand: "Electrolux", current: 120, predict: 180, growth: 12.4 },
    { id: 17, name: "Bếp gas", price: "1.500.000 VND", category: "Đồ dùng nhà bếp", brand: "Sunhouse", current: 124, predict: 200, growth: 16.9 },
    { id: 18, name: "Quạt điện", price: "800.000 VND", category: "Đồ điện gia dụng", brand: "Asia", current: 98, predict: 150, growth: 23.5 },
    { id: 19, name: "Nồi cơm điện", price: "1.200.000 VND", category: "Đồ dùng nhà bếp", brand: "Panasonic", current: 73, predict: 100, growth: 16.7 },
    { id: 20, name: "Máy lọc nước", price: "3.000.000 VND", category: "Thiết bị nhà bếp", brand: "Kangaroo", current: 56, predict: 80, growth: 32.4 }
];


const TrendingProduct = () => {

    // Số lượng mục trên mỗi trang
    const itemsPerPage = 10;

    // State để theo dõi trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Tính số lượng trang
    const pageCount = Math.ceil(productsData.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const currentData = productsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

  // Helper function to change page
    const setPage = (page) => {
    const newPage = page < 1 ? 1 : page > pageCount ? pageCount : page;
    setCurrentPage(newPage);
    };
    

    return (
        <Card.Body>
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Current Sales (VND)</th>
                        <th>Predict Sales (VND)</th>
                        <th>Growth Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>{product.current}.000.000</td>
                            <td>{product.predict}.000.000</td>
                            <td>{product.growth}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center">
            <Pagination>
                <Pagination.First onClick={() => setPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(pageCount).keys()].map(page =>
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => setPage(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                )}
                <Pagination.Next onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} />
                <Pagination.Last onClick={() => setPage(pageCount)} disabled={currentPage === pageCount} />
            </Pagination>
            </div>
        </Card.Body>
    );
}

export default TrendingProduct;