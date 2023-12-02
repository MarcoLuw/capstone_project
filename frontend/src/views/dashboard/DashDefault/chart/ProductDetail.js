import React, { useState } from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';

// Dữ liệu sản phẩm mẫu
const productsData = [
    { id: 1, name: "Bếp gas", price: "1.500.000 VND", category: "Đồ dùng nhà bếp", brand: "Sunhouse", orders: 124, quantity: 200, sales: "250.000.000 VND" },
    { id: 2, name: "Quạt điện", price: "800.000 VND", category: "Đồ điện gia dụng", brand: "Asia", orders: 98, quantity: 150, sales: "120.000.000 VND" },
    { id: 3, name: "Nồi cơm điện", price: "1.200.000 VND", category: "Đồ dùng nhà bếp", brand: "Panasonic", orders: 73, quantity: 100, sales: "73.000.000 VND" },
    { id: 4, name: "Máy lọc nước", price: "3.000.000 VND", category: "Thiết bị nhà bếp", brand: "Kangaroo", orders: 56, quantity: 80, sales: "168.000.000 VND" },
    { id: 5, name: "Máy giặt", price: "6.000.000 VND", category: "Đồ điện tử", brand: "Samsung", orders: 87, quantity: 60, sales: "522.000.000 VND" },
    { id: 6, name: "Tủ lạnh", price: "9.000.000 VND", category: "Điện lạnh", brand: "Toshiba", orders: 49, quantity: 49, sales: "441.000.000 VND" },
    { id: 7, name: "Điều hòa nhiệt độ", price: "10.000.000 VND", category: "Điện lạnh", brand: "Daikin", orders: 34, quantity: 35, sales: "340.000.000 VND" },
    { id: 8, name: "Máy xay sinh tố", price: "500.000 VND", category: "Đồ dùng nhà bếp", brand: "Philips", orders: 150, quantity: 200, sales: "100.000.000 VND" },
    { id: 9, name: "Lò vi sóng", price: "2.500.000 VND", category: "Đồ dùng nhà bếp", brand: "LG", orders: 65, quantity: 65, sales: "162.500.000 VND" },
    { id: 10, name: "Máy giặt", price: "6.000.000 VND", category: "Đồ điện tử", brand: "Samsung", orders: 87, quantity: 60, sales: "522.000.000 VND" },
    { id: 11, name: "Tủ lạnh", price: "9.000.000 VND", category: "Điện lạnh", brand: "Toshiba", orders: 49, quantity: 49, sales: "441.000.000 VND" },
    { id: 12, name: "Điều hòa nhiệt độ", price: "10.000.000 VND", category: "Điện lạnh", brand: "Daikin", orders: 34, quantity: 35, sales: "340.000.000 VND" },
    { id: 13, name: "Máy xay sinh tố", price: "500.000 VND", category: "Đồ dùng nhà bếp", brand: "Philips", orders: 150, quantity: 200, sales: "100.000.000 VND" },
    { id: 14, name: "Lò vi sóng", price: "2.500.000 VND", category: "Đồ dùng nhà bếp", brand: "LG", orders: 65, quantity: 65, sales: "162.500.000 VND" },
    { id: 15, name: "Bàn ủi", price: "400.000 VND", category: "Đồ điện gia dụng", brand: "Electrolux", orders: 120, quantity: 180, sales: "72.000.000 VND" },
    { id: 16, name: "Bàn ủi", price: "400.000 VND", category: "Đồ điện gia dụng", brand: "Electrolux", orders: 120, quantity: 180, sales: "72.000.000 VND" },
    { id: 17, name: "Bếp gas", price: "1.500.000 VND", category: "Đồ dùng nhà bếp", brand: "Sunhouse", orders: 124, quantity: 200, sales: "250.000.000 VND" },
    { id: 18, name: "Quạt điện", price: "800.000 VND", category: "Đồ điện gia dụng", brand: "Asia", orders: 98, quantity: 150, sales: "120.000.000 VND" },
    { id: 19, name: "Nồi cơm điện", price: "1.200.000 VND", category: "Đồ dùng nhà bếp", brand: "Panasonic", orders: 73, quantity: 100, sales: "73.000.000 VND" },
    { id: 20, name: "Máy lọc nước", price: "3.000.000 VND", category: "Thiết bị nhà bếp", brand: "Kangaroo", orders: 56, quantity: 80, sales: "168.000.000 VND" }
];


const ProductTableComponent = () => {

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
                        <th>Total Orders</th>
                        <th>Total Quantity</th>
                        <th>Total Sales</th>
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
                            <td>{product.orders}</td>
                            <td>{product.quantity}</td>
                            <td>{product.sales}</td>
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

export default ProductTableComponent;