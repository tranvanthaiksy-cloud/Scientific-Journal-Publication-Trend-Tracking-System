import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Select, Radio, Button, Table, Typography, Space, Divider, message} from 'antd';
import { FileSearchOutlined, DownloadOutlined, CopyOutlined, HistoryOutlined, EyeOutlined } from '@ant-design/icons';
import TrendLineChart from '../components/Charts/TrendLineChart';
import { reportApi } from '../api/reportApi';
import { trendApi } from '../api/trendApi';

const { Title, Text } = Typography;

const Reports = () => {
    const [form] = Form.useForm();
    const [history, setHistory] = useState([]);
    const [currentReport, setCurrentReport] = useState(null);
    const [keywordOptions, setKeywordOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
        fetchKeywords();
    }, []);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await reportApi.getHistory();
            setHistory(res.data);
        } catch (err) { message.error("Lỗi load lịch sử!"); }
        finally { setHistoryLoading(false); }
    };

    const fetchKeywords = async () => {
        try {
            const res = await trendApi.getTopKeywords(20);
            setKeywordOptions(res.data.map(k => ({ label: k.text || k.keyword, value: k.text || k.keyword })));
        } catch (err) { console.error(err); }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await reportApi.generateReport(values);
            setCurrentReport(res.data);
            message.success("Báo cáo đã được tạo!");
            fetchHistory(); // Refresh lịch sử
        } catch (err) { message.error("Lỗi khi tạo báo cáo!"); }
        finally { setLoading(false); }
    };

    const loadOldReport = async (id) => {
        setLoading(true);
        try {
            const res = await reportApi.getReportDetail(id);
            setCurrentReport(res.data);
            window.scrollTo({ top: 500, behavior: 'smooth' });
        } catch (err) { message.error("Lỗi load chi tiết báo cáo!"); }
        finally { setLoading(false); }
    };

    const copyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(currentReport.rawJson));
        message.success("Đã copy JSON vào clipboard!");
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Custom Reports & Analytics</Title>

            <Row gutter={[24, 24]}>
                {/* SECTION 1: CREATE REPORT */}
                <Col xs={24} lg={10}>
                    <Card title={<span><FileSearchOutlined /> Tạo báo cáo mới</span>}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item name="title" label="Tiêu đề báo cáo" rules={[{ required: true }]}>
                                <Input placeholder="Ví dụ: Phân tích AI 2024" />
                            </Form.Item>
                            <Form.Item name="keywords" label="Chọn Keywords" rules={[{ required: true }]}>
                                <Select mode="multiple" placeholder="Chọn tối đa 5 từ khóa" options={keywordOptions} />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="fromYear" label="Từ năm" initialValue={2020}><Select options={[{value: 2020}, {value: 2021}, {value: 2022}]} /></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="toYear" label="Đến năm" initialValue={2024}><Select options={[{value: 2023}, {value: 2024}]} /></Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="format" label="Định dạng" initialValue="PDF">
                                <Radio.Group><Radio value="PDF">PDF Report</Radio><Radio value="JSON">Raw JSON</Radio></Radio.Group>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>Tạo báo cáo</Button>
                        </Form>
                    </Card>
                </Col>

                {/* SECTION 3: REPORT HISTORY */}
                <Col xs={24} lg={14}>
                    <Card title={<span><HistoryOutlined /> Lịch sử báo cáo</span>}>
                        <Table
                            size="small"
                            loading={historyLoading}
                            dataSource={history}
                            rowKey="id"
                            columns={[
                                { title: 'Tiêu đề', dataIndex: 'title' },
                                { title: 'Ngày tạo', dataIndex: 'createdAt' },
                                {
                                    title: 'Thao tác',
                                    render: (record) => (
                                        <Button type="link" icon={<EyeOutlined />} onClick={() => loadOldReport(record.id)}>Xem</Button>
                                    )
                                }
                            ]}
                            pagination={{ pageSize: 4 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* SECTION 2: REPORT VIEWER */}
            <Divider />
            {currentReport ? (
                <div id="report-viewer">
                    <Title level={3}>Báo cáo: {currentReport.summary.timeRange}</Title>
                    <Space style={{ marginBottom: 16 }}>
                        <Button icon={<DownloadOutlined />} type="default">Tải PDF</Button>
                        <Button icon={<CopyOutlined />} onClick={copyJson}>Copy JSON</Button>
                    </Space>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title="Phân tích xu hướng"><TrendLineChart data={currentReport.chartData} keywords={currentReport.summary.keywords} /></Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Top Authors">
                                <Table size="small" dataSource={currentReport.topAuthors} columns={[{title: 'Tên', dataIndex: 'name'}, {title: 'Số bài', dataIndex: 'paperCount'}]} pagination={false} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Top Journals">
                                <Table size="small" dataSource={currentReport.topJournals} columns={[{title: 'Tên Journal', dataIndex: 'name'}, {title: 'Số bài', dataIndex: 'paperCount'}]} pagination={false} />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <Card><div style={{textAlign: 'center', padding: '40px'}}><Text type="secondary">Vui lòng tạo báo cáo hoặc chọn từ lịch sử để xem dữ liệu.</Text></div></Card>
            )}
        </div>
    );
};

export default Reports;