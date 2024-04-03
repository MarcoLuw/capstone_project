import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';

const BootstrapTable = () => {
    const reports = [
        { id: 1, name: 'ABC_Report', opened: '5 minutes ago', owner: 'Ngọc Hòa', endorsement: '—', sensitivity: '—' },
        { id: 2, name: 'DEF_Report', opened: '1 week ago', owner: 'Hoàng Anh', endorsement: '—', sensitivity: '—' },
        { id: 3, name: 'GHI_Report', opened: '2 months ago', owner: 'Đức Tiến', endorsement: '—', sensitivity: '—' },
        // Thêm các báo cáo khác theo cấu trúc này
    ];

    const handleReportClick = (reportId) => {
        console.log(`Report clicked: ${reportId}`);
        // Thực hiện hành động tương ứng, ví dụ điều hướng đến trang chi tiết báo cáo
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="border-0">
                            <Card.Title as="h5">Your Reports</Card.Title>
                        </Card.Header>
                        <Card.Body style={{ padding: 15, marginTop: '-1rem' }}>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Opened</th>
                                        <th>Owner</th>
                                        <th>Endorsement</th>
                                        <th>Sensitivity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td>
                                                <a href="#" onClick={() => handleReportClick(report.id)}>
                                                    {report.name}
                                                </a>
                                            </td>
                                            <td>Report</td>
                                            <td>{report.opened}</td>
                                            <td>{report.owner}</td>
                                            <td>{report.endorsement}</td>
                                            <td>{report.sensitivity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BootstrapTable;
