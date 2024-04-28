import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button} from 'react-bootstrap';
import  MainCard from '../../../components/Card/MainCard';
import TablePreview from '../chart/Table'
import Barchart from '../chart/Barchart'


const DashSuggestion = () => {
    // Declare the trend_product array within the component using const
    const trend_product = [
        { "order_date": "2022-09-30", "product_key": 9, "current_total_quantity": 13.0, "predict_total_quantity": 11.189775, "growth": -13.924804 },
        { "order_date": "2022-09-30", "product_key": 2, "current_total_quantity": 643.0, "predict_total_quantity": 454.83783, "growth": -29.263168 },
        { "order_date": "2022-09-30", "product_key": 3, "current_total_quantity": 473.0, "predict_total_quantity": 333.798553, "growth": -29.429481 },
        { "order_date": "2022-09-30", "product_key": 1, "current_total_quantity": 677.0, "predict_total_quantity": 466.344482, "growth": -31.116029 },
        { "order_date": "2022-09-30", "product_key": 4, "current_total_quantity": 823.0, "predict_total_quantity": 525.651672, "growth": -36.129809 },
        { "order_date": "2022-09-30", "product_key": 8, "current_total_quantity": 108.0, "predict_total_quantity": 67.285645, "growth": -37.698477 },
        { "order_date": "2022-09-30", "product_key": 7, "current_total_quantity": 216.0, "predict_total_quantity": 132.28624, "growth": -38.756371 },
        { "order_date": "2022-09-30", "product_key": 6, "current_total_quantity": 136.0, "predict_total_quantity": 81.664246, "growth": -39.952761 },
        { "order_date": "2022-09-30", "product_key": 5, "current_total_quantity": 148.0, "predict_total_quantity": 86.81295, "growth": -41.342601 },
        { "order_date": "2022-09-30", "product_key": 10, "current_total_quantity": 171.0, "predict_total_quantity": 99.321091, "growth": -41.917491 }
    ];

    const combo = [
        {
            "Product Name": "Máy xay sinh tố",
            "Category": "Đồ gia dụng nhà bếp",
            "Price": "1,500,000 VND",
            "Related Product Name": "Bộ ly thủy tinh",
            "Related Category": "Dụng cụ nhà bếp",
            "Related Price": "300,000 VND",
            "Affinity Score": 0.9
        },
        {
            "Product Name": "Máy xay sinh tố",
            "Category": "Đồ gia dụng nhà bếp",
            "Price": "1,500,000 VND",
            "Related Product Name": "Dao cắt hoa quả",
            "Related Category": "Dụng cụ nhà bếp",
            "Related Price": "200,000 VND",
            "Affinity Score": 0.85
        },
        {
            "Product Name": "Điện thoại thông minh",
            "Category": "Điện tử",
            "Price": "8,000,000 VND",
            "Related Product Name": "Ốp lưng điện thoại",
            "Related Category": "Phụ kiện điện tử",
            "Related Price": "200,000 VND",
            "Affinity Score": 0.95
        },
        {
            "Product Name": "Điện thoại thông minh",
            "Category": "Điện tử",
            "Price": "8,000,000 VND",
            "Related Product Name": "Tai nghe Bluetooth",
            "Related Category": "Phụ kiện điện tử",
            "Related Price": "1,200,000 VND",
            "Affinity Score": 0.88
        },
        {
            "Product Name": "Máy xay sinh tố",
            "Category": "Đồ gia dụng nhà bếp",
            "Price": "1,500,000 VND",
            "Related Product Name": "Bộ ly thủy tinh",
            "Related Category": "Dụng cụ nhà bếp",
            "Related Price": "300,000 VND",
            "Affinity Score": 0.9
        },
        {
            "Product Name": "Máy xay sinh tố",
            "Category": "Đồ gia dụng nhà bếp",
            "Price": "1,500,000 VND",
            "Related Product Name": "Dao cắt hoa quả",
            "Related Category": "Dụng cụ nhà bếp",
            "Related Price": "200,000 VND",
            "Affinity Score": 0.85
        },
        {
            "Product Name": "Điện thoại thông minh",
            "Category": "Điện tử",
            "Price": "8,000,000 VND",
            "Related Product Name": "Ốp lưng điện thoại",
            "Related Category": "Phụ kiện điện tử",
            "Related Price": "200,000 VND",
            "Affinity Score": 0.95
        },
        {
            "Product Name": "Điện thoại thông minh",
            "Category": "Điện tử",
            "Price": "8,000,000 VND",
            "Related Product Name": "Tai nghe Bluetooth",
            "Related Category": "Phụ kiện điện tử",
            "Related Price": "1,200,000 VND",
            "Affinity Score": 0.88
        }
    ]

    const segment_customer = [
        { "categoryfield": "Khách hàng VIP", "valuefield": 200 },
        { "categoryfield": "Khách hàng trung thành", "valuefield": 300 },
        { "categoryfield": "Khách hàng tiềm năng", "valuefield": 250 },
        { "categoryfield": "Khách hàng mới", "valuefield": 150 },
        { "categoryfield": "Khách hàng có thể mất", "valuefield": 50 },
        { "categoryfield": "Khách hàng đã bỏ lỡ", "valuefield": 50 }
    ]
    
    
    const table_customer = [
        {
            "customer_name": "Nguyễn Văn An",
            "phone_number": "0912345678",
            "address": "123 Đường ABC, Hà Nội",
            "recency": "7 days",
            "frequency": 12,
            "monetary": "150,000,000 VND",
            "segment": "Khách hàng VIP"
        },
        {
            "customer_name": "Trần Thị Bảo",
            "phone_number": "0923456789",
            "address": "234 Đường DEF, TP.HCM",
            "recency": "15 days",
            "frequency": 10,
            "monetary": "100,000,000 VND",
            "segment": "Khách hàng trung thành"
        },
        {
            "customer_name": "Phạm Hoàng Cường",
            "phone_number": "0934567890",
            "address": "345 Đường GHI, Đà Nẵng",
            "recency": "30 days",
            "frequency": 5,
            "monetary": "50,000,000 VND",
            "segment": "Khách hàng tiềm năng"
        },
        {
            "customer_name": "Lê Thị Dung",
            "phone_number": "0945678901",
            "address": "456 Đường JKL, Cần Thơ",
            "recency": "60 days",
            "frequency": 2,
            "monetary": "20,000,000 VND",
            "segment": "Khách hàng mới"
        },
        {
            "customer_name": "Hoàng Minh Ê",
            "phone_number": "0956789012",
            "address": "567 Đường MNO, Nha Trang",
            "recency": "90 days",
            "frequency": 1,
            "monetary": "10,000,000 VND",
            "segment": "Khách hàng có thể mất"
        },
        {
            "customer_name": "Đỗ Thanh Gia",
            "phone_number": "0967890123",
            "address": "678 Đường PQR, Hải Phòng",
            "recency": "120 days",
            "frequency": 2,
            "monetary": "5,000,000 VND",
            "segment": "Khách hàng đã bỏ lỡ"
        }
    ]
    

    
    
    

    return (
        <React.Fragment>
            <Row>
                <Col key='trend-product' xl={12}>
                    <MainCard title='Trend Product (Next Month)' isOption>
                        <TablePreview data={trend_product} />
                    </MainCard>
                </Col>

                <Col key='recommend-combo' xl={12}>
                    <MainCard title='Recommend Combo' isOption>
                        <TablePreview data={combo} />
                    </MainCard>
                </Col>


                <Col key='segment-customer' xl={12}>
                        <MainCard title='Segment of Customer' isOption>
                            <Barchart id={'segment-customer'} data={segment_customer} height={'360px'} 
                                    categoryfield={'Segment'} valuefield={'Total Customer'} />
                      </MainCard>

                      <MainCard title='Detail of Customer' isOption>
                        <TablePreview data={table_customer} />
                    </MainCard>
                </Col>

            </Row>
        </React.Fragment>
    );
};

export default DashSuggestion;