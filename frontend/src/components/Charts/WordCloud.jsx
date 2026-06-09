import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Empty, Tooltip } from 'antd';

const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

const WordCloudChart = ({ data, loading }) => {
    const navigate = useNavigate();

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin tip="Đang tạo vũ trụ từ khóa..." /></div>;
    if (!data || data.length === 0) return <Empty description="Không có dữ liệu từ khóa" />;

    const words = data.map((item, index) => {
        const text = typeof item === 'string' ? item : (item.text || item.keyword || `Word-${index}`);
        const value = typeof item === 'string' ? Math.floor(Math.random() * 90) + 10 : (item.value || item.totalPapers || 10);
        return { text, value };
    });

    const minVal = Math.min(...words.map(w => w.value));
    const maxVal = Math.max(...words.map(w => w.value));

    const getFontSize = (value) => {
        if (maxVal === minVal) return 30; // Tránh lỗi chia cho 0 nếu các từ có value bằng nhau
        return 14 + ((value - minVal) / (maxVal - minVal)) * (60 - 14);
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            gap: '16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: '350px'
        }}>
            {words.map((word, index) => (
                // Hover -> Hiển thị Tooltip
                <Tooltip key={index} title={`${word.text}: ${word.value} papers`}>
                    <span
                        // Click -> Navigate sang trang Search
                        onClick={() => navigate(`/search?q=${encodeURIComponent(word.text)}`)}
                        style={{
                            fontSize: `${getFontSize(word.value)}px`,
                            color: colors[index % colors.length], // Đổ màu luân phiên
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, color 0.3s ease', // Animation nhẹ khi hover
                            lineHeight: '1.2',
                            fontWeight: 'bold',
                            display: 'inline-block'
                        }}
                        // Hiệu ứng phóng to nhẹ khi rê chuột vào
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.opacity = '1';
                        }}
                    >
                        {word.text}
                    </span>
                </Tooltip>
            ))}
        </div>
    );
};

export default WordCloudChart;