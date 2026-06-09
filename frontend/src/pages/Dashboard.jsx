import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Typography, Skeleton} from 'antd';
import { FileTextOutlined, BookOutlined, TeamOutlined, TagOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { trendApi } from '../api/trendApi';
import TrendLineChart from '../components/Charts/TrendLineChart';
import { dashboardApi } from '../api/dashboardApi';

// === JP-37 THÊM MỚI: Import 2 Component biểu đồ mới ===
import JournalBarChart from '../components/Charts/JournalBarChart';
import FieldPieChart from '../components/Charts/FieldPieChart';
// =======================================================

const { Title, Text } = Typography;

const Dashboard = () => {
    // 1. Dữ liệu cho JP-35 (Các ô số liệu)
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. Dữ liệu cho JP-36 (Biểu đồ đường)
    const [trendData, setTrendData] = useState([]);
    const [loadingTrend, setLoadingTrend] = useState(true);

    // === JP-37 THÊM MỚI: State cho Biểu đồ Cột và Biểu đồ Tròn ===
    const [journalData, setJournalData] = useState([]);
    const [fieldData, setFieldData] = useState([]);
    const [loadingCharts, setLoadingCharts] = useState(true);
    // ==========================================================

    useEffect(() => {
        // Lấy stats (JP-35)
        dashboardApi.getStats()
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi kết nối Stats:", error);
                setLoading(false);
            });

        // Lấy Trend Data (JP-36)
        const compareKeywords = ["AI", "Blockchain", "Quantum"];
        setLoadingTrend(true);
        trendApi.getCompareTrends(compareKeywords)
            .then(response => {
                setTrendData(response.data);
                setLoadingTrend(false);
            })
            .catch(error => {
                console.error("Lỗi kết nối Trend:", error);
                setLoadingTrend(false);
            });

        // === JP-37 THÊM MỚI: Gọi đồng thời 2 API cho Bar và Pie Chart ===
        setLoadingCharts(true);
        Promise.all([
            dashboardApi.getTopJournals(),
            dashboardApi.getFieldDistribution()
        ])
            .then(([journalRes, fieldRes]) => {
                setJournalData(journalRes.data);
                setFieldData(fieldRes.data);
                setLoadingCharts(false);
            })
            .catch(error => {
                console.error("Lỗi kết nối JP-37 Charts:", error);
                setLoadingCharts(false);
            });
        // ============================================================
    }, []);

    if (loading) return <div style={{ padding: '24px' }}><Skeleton active paragraph={{ rows: 15 }} /></div>;

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Title level={2}>Research Dashboard</Title>

            {/* Row 1: Stat Cards (JP-35) */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng số bài báo" value={stats?.totalPapers || 0} prefix={<FileTextOutlined />} />
                        <Text type="success">{stats?.growth || "+0 tháng này"}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng số Journals" value={stats?.totalJournals || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng số Tác giả" value={stats?.totalAuthors || 0} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic title="Keywords" value={stats?.totalKeywords || 0} prefix={<TagOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Row 2: Biểu đồ đường (JP-36) */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={16}>
                    <Card title="So sánh xu hướng nghiên cứu (AI vs Blockchain vs Quantum)" bordered={false}>
                        <TrendLineChart
                            data={trendData}
                            keywords={["AI", "Blockchain", "Quantum"]}
                            loading={loadingTrend}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Trending Topics" bordered={false}>
                        <List
                            dataSource={['AI', 'Blockchain', 'Quantum Computing']}
                            renderItem={item => (
                                <List.Item>
                                    <Text strong>{item}</Text>
                                    <Text type="success"><ArrowUpOutlined /> 15%</Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* === JP-37 THÊM MỚI: Row 3 hiển thị Bar Chart và Pie Chart === */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Top Journals (Số lượng bài báo)" bordered={false}>
                        <JournalBarChart data={journalData} loading={loadingCharts} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Phân bố theo lĩnh vực nghiên cứu" bordered={false}>
                        <FieldPieChart data={fieldData} loading={loadingCharts} />
                    </Card>
                </Col>
            </Row>
            {/* ============================================================ */}

            {/* Row 4: Recent Papers */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24}>
                    <Card title="Recent Papers" bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[{title: 'Nghiên cứu về AI', journal: 'IEEE', year: 2024}]}
                            renderItem={item => (
                                <List.Item actions={[<a key="view" href="#!">View</a>]}>
                                    <List.Item.Meta title={item.title} description={`${item.journal} - ${item.year}`} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;