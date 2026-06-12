import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    Tag,
    Button,
    Divider,
    Skeleton,
    Space,
    message
} from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";

import { getPaperById } from "../api/paperApi";

const { Title, Text, Paragraph } = Typography;

function PaperDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);

    // LOAD PAPER
    useEffect(() => {
        const fetchPaper = async () => {
            try {
                setLoading(true);
                const res = await getPaperById(id);
                setPaper(res?.data?.body);
            } catch (err) {
                setPaper(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPaper();
    }, [id]);

    // 404 STATE
    if (!loading && !paper) {
        return (
            <div style={{ padding: 40 }}>
                <Title level={3}>404 - Bài báo không tồn tại</Title>
                <Button onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: 24 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    // BOOKMARK TOGGLE (demo local)
    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        message.success(
            bookmarked ? "Đã bỏ bookmark" : "Đã bookmark"
        );
    };

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>

            {/* HEADER */}
            <Title>{paper.title}</Title>

            <Space wrap>
                {/* AUTHORS */}
                <Text strong>Authors:</Text>
                {paper.authors?.map((a, index) => (
                    <Tag
                        key={index}
                        onClick={() => navigate(`/authors/${index}`)}
                        style={{ cursor: "pointer" }}
                    >
                        {a}
                    </Tag>
                ))}
            </Space>

            <br /><br />

            {/* JOURNAL */}
            <Text>
                Journal:{" "}
                <a onClick={() => navigate(`/journals/${paper.journalId}`)}>
                    {paper.journalName}
                </a>{" "}
                • {paper.publicationYear}
            </Text>

            <br /><br />

            {/* DOI */}
            <a href={paper.sourceUrl} target="_blank" rel="noreferrer">
                Open DOI / Source
            </a>

            <br /><br />

            {/* BOOKMARK */}
            <Button
                type="primary"
                icon={bookmarked ? <StarFilled /> : <StarOutlined />}
                onClick={handleBookmark}
            >
                Bookmark
            </Button>

            <Divider />

            {/* ABSTRACT */}
            <Title level={4}>Abstract</Title>
            <Paragraph style={{ lineHeight: 1.8 }}>
                {paper.abstract}
            </Paragraph>

            <Divider />

            {/* KEYWORDS */}
            <Title level={4}>Keywords</Title>
            {paper.keywords?.map((k) => (
                <Tag
                    key={k}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                        navigate(`/search?keyword=${k}`)
                    }
                >
                    {k}
                </Tag>
            ))}

            <Divider />

            {/* META */}
            <Title level={5}>Meta</Title>
            <Text>Source API: OpenAlex / Crossref</Text>
            <br />
            <Text>Fetched at: {new Date().toLocaleString()}</Text>
        </div>
    );
}

export default PaperDetail;