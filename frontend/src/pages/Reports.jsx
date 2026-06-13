import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Select, Radio, Button, Table, Typography, Space, Divider, message } from 'antd';
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
            setHistory(res.data?.body || res.data || []);
        } catch (err) {
            console.warn("Chưa có API Report History, sử dụng mock history:", err);
            setHistory([
                { id: 1, title: 'Báo cáo Xu hướng Học máy 2026', createdAt: '2026-06-12 10:00:00' },
                { id: 2, title: 'Báo cáo Nghiên cứu Blockchain & IoT', createdAt: '2026-06-11 14:30:00' }
            ]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchKeywords = async () => {
        try {
            const res = await trendApi.getTopKeywords(20);
            const list = res.data?.body || [];
            setKeywordOptions(list.map(k => ({ label: k.name, value: k.name })));
        } catch (err) {
            console.error("Lỗi tải keywords cho báo cáo:", err);
            setKeywordOptions([
                { label: 'AI', value: 'AI' },
                { label: 'Machine Learning', value: 'Machine Learning' },
                { label: 'Blockchain', value: 'Blockchain' },
                { label: 'Quantum Computing', value: 'Quantum Computing' }
            ]);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await reportApi.generateReport(values);
            setCurrentReport(res.data?.body || res.data);
            message.success("Báo cáo đã được tạo!");
            fetchHistory(); // Refresh lịch sử
        } catch (err) {
            console.warn("Chưa có API tạo Report, sử dụng mock report generation:", err);
            
            // Giả lập dữ liệu report mới
            const mockReport = {
                id: Date.now(),
                summary: {
                    timeRange: `${values.title} (${values.fromYear} - ${values.toYear})`,
                    keywords: values.keywords
                },
                chartData: [
                    { year: '2022', [values.keywords[0] || 'Topic']: 30 },
                    { year: '2023', [values.keywords[0] || 'Topic']: 45 },
                    { year: '2024', [values.keywords[0] || 'Topic']: 75 },
                    { year: '2025', [values.keywords[0] || 'Topic']: 110 },
                    { year: '2026', [values.keywords[0] || 'Topic']: 150 }
                ],
                topAuthors: [
                    { name: 'Dr. John Doe', paperCount: 15 },
                    { name: 'Prof. Sarah Connor', paperCount: 12 }
                ],
                topJournals: [
                    { name: 'IEEE Access', paperCount: 18 },
                    { name: 'ACM Computing Surveys', paperCount: 10 }
                ],
                rawJson: { status: 'success', data: values }
            };
            
            setCurrentReport(mockReport);
            setHistory(prev => [
                { id: mockReport.id, title: values.title, createdAt: new Date().toLocaleString() },
                ...prev
            ]);
            message.success("Báo cáo đã được tạo (Mock Mode)!");
        } finally {
            setLoading(false);
        }
    };

    const loadOldReport = async (id) => {
        setLoading(true);
        try {
            const res = await reportApi.getReportDetail(id);
            setCurrentReport(res.data?.body || res.data);
            window.scrollTo({ top: 500, behavior: 'smooth' });
        } catch (err) {
            console.warn("Chưa có API chi tiết Report, tải mock chi tiết:", err);
            
            const matchedOldReport = {
                id: id,
                summary: {
                    timeRange: id === 1 ? 'Báo cáo Xu hướng Học máy 2026 (2020 - 2024)' : 'Báo cáo Nghiên cứu Blockchain & IoT (2020 - 2024)',
                    keywords: id === 1 ? ['Machine Learning'] : ['Blockchain', 'IoT']
                },
                chartData: [
                    { year: '2022', 'Machine Learning': 80, 'Blockchain': 25 },
                    { year: '2023', 'Machine Learning': 95, 'Blockchain': 32 },
                    { year: '2024', 'Machine Learning': 120, 'Blockchain': 40 },
                    { year: '2025', 'Machine Learning': 145, 'Blockchain': 48 },
                    { year: '2026', 'Machine Learning': 180, 'Blockchain': 60 }
                ],
                topAuthors: [
                    { name: 'Dr. Alan Turing', paperCount: 24 },
                    { name: 'Prof. Satoshi Nakamoto', paperCount: 18 }
                ],
                topJournals: [
                    { name: 'Neural Networks', paperCount: 20 },
                    { name: 'IEEE Transactions', paperCount: 15 }
                ],
                rawJson: { status: 'success', id: id }
            };
            setCurrentReport(matchedOldReport);
            window.scrollTo({ top: 500, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
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
                                    <Form.Item name="fromYear" label="Từ năm" initialValue={2020}><Select options={[{ value: 2020 }, { value: 2021 }, { value: 2022 }]} /></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="toYear" label="Đến năm" initialValue={2024}><Select options={[{ value: 2023 }, { value: 2024 }]} /></Form.Item>
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
                                <Table size="small" dataSource={currentReport.topAuthors} columns={[{ title: 'Tên', dataIndex: 'name' }, { title: 'Số bài', dataIndex: 'paperCount' }]} pagination={false} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Top Journals">
                                <Table size="small" dataSource={currentReport.topJournals} columns={[{ title: 'Tên Journal', dataIndex: 'name' }, { title: 'Số bài', dataIndex: 'paperCount' }]} pagination={false} />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <Card><div style={{ textAlign: 'center', padding: '40px' }}><Text type="secondary">Vui lòng tạo báo cáo hoặc chọn từ lịch sử để xem dữ liệu.</Text></div></Card>
            )}
        </div>
    );
};

export default Reports;