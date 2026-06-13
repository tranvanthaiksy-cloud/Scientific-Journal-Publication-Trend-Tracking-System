import React, { useState, useEffect } from 'react';
// Thêm Divider vào cuối danh sách import từ 'antd'
import { Row, Col, Card, Input, Tag, Badge, Switch, Button, Typography, Modal, Space, Empty, message, Divider } from 'antd';
// Xóa FireFilled để hết cảnh báo Warning
import { SearchOutlined, EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { topicApi } from '../api/topicApi';
import { useAuth } from '../hooks/useAuth';
import { followApi } from '../api/followApi';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const TopicExplorer = () => {
    const { isAuthenticated } = useAuth();
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isTrendingOnly, setIsTrendingOnly] = useState(false);

    // State cho Modal chi tiết
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    
    // Map lưu { keywordId: followId } để check follow và gọi API unfollow
    const [followMap, setFollowMap] = useState({});

    useEffect(() => {
        fetchTopics();
        if (isAuthenticated) {
            fetchFollows();
        }
    }, [isAuthenticated]);

    const fetchFollows = async () => {
        try {
            const res = await followApi.getFollows();
            const list = res.data?.body || [];
            const map = {};
            list.forEach(item => {
                if (item.followType === 'KEYWORD') {
                    map[item.targetId] = item.id;
                }
            });
            setFollowMap(map);
        } catch (error) {
            console.error("Không thể tải trạng thái follow:", error);
        }
    };

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const res = await topicApi.getTopics();
            const rawKeywords = res.data?.body || [];
            
            // Ánh xạ KeywordResponse từ backend thành dạng Topic hiển thị trên UI
            const mappedTopics = rawKeywords.map(kw => ({
                id: kw.id,
                title: kw.name.toUpperCase(),
                description: `Khám phá các xu hướng nghiên cứu mới nhất liên quan đến chủ đề "${kw.name}".`,
                isTrending: kw.usageCount > 10,
                keywords: [kw.name],
                usageCount: kw.usageCount
            }));
            
            setTopics(mappedTopics);
            setFilteredTopics(mappedTopics);
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

    const toggleFollow = async (topicId) => {
        if (!isAuthenticated) {
            message.warning("Vui lòng đăng nhập để thực hiện chức năng này!");
            return;
        }

        const isFollowing = !!followMap[topicId];
        
        try {
            if (isFollowing) {
                const followId = followMap[topicId];
                await followApi.unfollow(followId);
                setFollowMap(prev => {
                    const copy = { ...prev };
                    delete copy[topicId];
                    return copy;
                });
                message.info("Đã bỏ theo dõi chủ đề.");
            } else {
                const res = await followApi.followKeyword(topicId);
                const followObj = res.data?.body;
                if (followObj) {
                    setFollowMap(prev => ({
                        ...prev,
                        [topicId]: followObj.id
                    }));
                    message.success("Đã thêm vào danh sách theo dõi!");
                }
            }
        } catch (error) {
            message.error("Thao tác thất bại!");
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
                                        icon={!!followMap[topic.id] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
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