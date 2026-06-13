import React, { useState, useEffect } from 'react';
import { Tabs, List, Card, Button, Badge, Popconfirm, message, Spin, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { followApi } from '../api/followApi';

const { Title, Text } = Typography;

const Following = () => {
    const [follows, setFollows] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFollows();
    }, []);

    const fetchFollows = async () => {
        setLoading(true);
        try {
            const res = await followApi.getFollows();
            const rawFollows = res.data?.body || [];
            
            // Ánh xạ dữ liệu từ backend sang cấu trúc frontend mong đợi
            const mappedFollows = rawFollows.map(item => ({
                id: item.id,
                type: item.followType, // 'JOURNAL', 'KEYWORD', 'TOPIC'
                name: item.targetName,
                publisher: item.followType === 'JOURNAL' ? 'Academic Source' : undefined,
                field: item.followType === 'JOURNAL' ? 'Scientific Field' : undefined,
                paperCount: 0,
                usageCount: 0
            }));
            
            setFollows(mappedFollows);
        } catch (error) {
            message.error("Không thể tải danh sách theo dõi!");
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async (id) => {
        try {
            await followApi.unfollow(id);
            // Cập nhật lại state sau khi xóa thành công (chặn hiển thị trên UI ngay lập tức)
            setFollows(follows.filter(item => item.id !== id));
            message.success("Đã hủy theo dõi thành công!");
        } catch (error) {
            message.error("Có lỗi xảy ra khi hủy theo dõi.");
        }
    };

    // Hàm render nút Unfollow dùng chung
    const renderUnfollowBtn = (id) => (
        <Popconfirm
            title="Hủy theo dõi?"
            description="Bạn có chắc chắn muốn ngừng theo dõi mục này không?"
            onConfirm={() => handleUnfollow(id)}
            okText="Đồng ý"
            cancelText="Hủy"
        >
            <Button type="text" danger icon={<DeleteOutlined />}>Unfollow</Button>
        </Popconfirm>
    );

    // --- RENDER CÁC TAB ---
    const tabItems = [
        {
            key: '1',
            label: 'Journals',
            children: (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
                    dataSource={follows.filter(item => item.type === 'JOURNAL')}
                    locale={{ emptyText: 'Bạn chưa theo dõi journal nào.' }}
                    renderItem={item => (
                        <List.Item>
                            <Card actions={[renderUnfollowBtn(item.id)]}>
                                <Card.Meta
                                    title={item.name}
                                    description={<>
                                        <Text type="secondary">Publisher: {item.publisher}</Text><br />
                                        <Text type="secondary">Field: {item.field}</Text><br />
                                        <Text strong>{item.paperCount} papers</Text>
                                    </>}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            )
        },
        {
            key: '2',
            label: 'Topics',
            children: (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
                    dataSource={follows.filter(item => item.type === 'TOPIC')}
                    locale={{ emptyText: 'Bạn chưa theo dõi topic nào.' }}
                    renderItem={item => (
                        <List.Item>
                            <Badge.Ribbon text="🔥 Trending" color="volcano" style={{ display: item.isTrending ? 'block' : 'none' }}>
                                <Card actions={[renderUnfollowBtn(item.id)]}>
                                    <Card.Meta title={item.name} />
                                </Card>
                            </Badge.Ribbon>
                        </List.Item>
                    )}
                />
            )
        },
        {
            key: '3',
            label: 'Keywords',
            children: (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
                    dataSource={follows.filter(item => item.type === 'KEYWORD')}
                    locale={{ emptyText: 'Bạn chưa theo dõi keyword nào.' }}
                    renderItem={item => (
                        <List.Item>
                            <Card actions={[renderUnfollowBtn(item.id)]}>
                                <Card.Meta
                                    title={item.name}
                                    description={<Text type="secondary">{item.usageCount} mentions</Text>}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            )
        }
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>Đang theo dõi (Following)</Title>
            <Card>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                ) : (
                    <Tabs defaultActiveKey="1" items={tabItems} />
                )}
            </Card>
        </div>
    );
};

export default Following;