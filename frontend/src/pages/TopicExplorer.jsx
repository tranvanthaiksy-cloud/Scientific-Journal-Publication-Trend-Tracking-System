import React, { useState, useEffect } from 'react';
// Thêm Divider vào cuối danh sách import từ 'antd'
import { Row, Col, Card, Input, Tag, Badge, Switch, Button, Typography, Modal, Space, Empty, message, Divider } from 'antd';
// Xóa FireFilled để hết cảnh báo Warning
import { SearchOutlined, EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { topicApi } from '../api/topicApi';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const TopicExplorer = () => {
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isTrendingOnly, setIsTrendingOnly] = useState(false);

    // State cho Modal chi tiết
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [followedTopics, setFollowedTopics] = useState([]);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const res = await topicApi.getTopics();
            setTopics(res.data);
            setFilteredTopics(res.data);
        } catch (error) {
            message.error("Không thể tải danh sách chủ đề!");
        } finally {
            setLoading(false);
        }
    };

    // Logic: Search và Filter
    useEffect(() => {
        let result = topics;
        if (searchText) {
            result = result.filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()));
        }
        if (isTrendingOnly) {
            result = result.filter(t => t.isTrending);
        }
        setFilteredTopics(result);
    }, [searchText, isTrendingOnly, topics]);

    const showDetail = (topic) => {
        setSelectedTopic(topic);
        setIsModalOpen(true);
    };

    const toggleFollow = (id) => {
        if (followedTopics.includes(id)) {
            setFollowedTopics(followedTopics.filter(tid => tid !== id));
            message.info("Đã bỏ theo dõi chủ đề.");
        } else {
            setFollowedTopics([...followedTopics, id]);
            message.success("Đã thêm vào danh sách theo dõi!");
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Khám phá Chủ đề Nghiên cứu</Title>

            {/* --- FILTER BAR --- */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                        <Search
                            placeholder="Tìm kiếm chủ đề..."
                            enterButton={<SearchOutlined />}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Space>
                            <Text>Chỉ hiện Trending:</Text>
                            <Switch checked={isTrendingOnly} onChange={setIsTrendingOnly} />
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* --- GRID LIST --- */}
            <Row gutter={[16, 16]}>
                {filteredTopics.map(topic => (
                    <Col key={topic.id} xs={24} sm={12} lg={8}>
                        <Badge.Ribbon
                            text="🔥 Trending"
                            color="volcano"
                            style={{ display: topic.isTrending ? 'block' : 'none' }}
                        >
                            <Card
                                hoverable
                                actions={[
                                    <Button type="link" icon={<EyeOutlined />} onClick={() => showDetail(topic)}>Xem chi tiết</Button>,
                                    <Button
                                        type="text"
                                        icon={followedTopics.includes(topic.id) ? <HeartFilled style={{color: 'red'}}/> : <HeartOutlined />}
                                        onClick={() => toggleFollow(topic.id)}
                                    >
                                        Follow
                                    </Button>
                                ]}
                            >
                                <Card.Meta
                                    title={<Title level={4}>{topic.title}</Title>}
                                    description={
                                        <Paragraph ellipsis={{ rows: 2 }}>
                                            {topic.description}
                                        </Paragraph>
                                    }
                                />
                                <div style={{ marginTop: 16 }}>
                                    {topic.keywords.slice(0, 5).map(kw => (
                                        <Tag key={kw} color="blue" style={{ marginBottom: 4 }}>{kw}</Tag>
                                    ))}
                                </div>
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                ))}
            </Row>

            {filteredTopics.length === 0 && !loading && <Empty />}

            {/* --- DETAIL MODAL --- */}
            <Modal
                title={selectedTopic?.title}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>
                ]}
                width={700}
            >
                {selectedTopic && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>Mô tả đầy đủ:</Text>
                        <Paragraph>{selectedTopic.description}</Paragraph>

                        <Divider />

                        <Text strong>Tất cả Keywords liên quan:</Text>
                        <div>
                            {selectedTopic.keywords.map(kw => (
                                <Tag key={kw} color="cyan">{kw}</Tag>
                            ))}
                        </div>

                        <Divider />

                        <Text strong>Thống kê mức độ quan tâm:</Text>
                        <Text type="secondary"> Đang có {selectedTopic.usageCount} bài nghiên cứu liên quan.</Text>
                        {/* Sau này có thể thêm Chart nhỏ ở đây theo yêu cầu Detail */}
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default TopicExplorer;