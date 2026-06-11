import { useState, useEffect } from "react";
import {
    Input,
    Select,
    Button,
    Card,
    Tag,
    Pagination,
    Empty,
    Spin,
    Row,
    Col,
    Typography,
    message,
} from "antd";
import {
    StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { searchPapers } from "../api/paperApi";
import { getJournals } from "../api/journalApi";

const { Title, Text } = Typography;

function SearchPapers() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [papers, setPapers] = useState([]);
    const [journals, setJournals] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [author, setAuthor] = useState("");
    const [journalId, setJournalId] = useState();

    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [bookmarkedIds, setBookmarkedIds] = useState([]);

    async function loadJournals() {
        try {
            const res = await getJournals({
                page: 0,
                size: 100,
            });

            setJournals(
                res?.data?.body?.content || []
            );
        } catch (error) {
            console.error(error);
        }
    }
    const handleBookmark = (paperId) => {
        setBookmarkedIds((prev) => {
            if (prev.includes(paperId)) {
                return prev.filter(id => id !== paperId);
            }
            return [...prev, paperId];
        });
    };
    async function loadPapers(currentPage = 1) {
        try {
            setLoading(true);

            const params = {
                keyword,
                author,
                journalId,
                yearFrom,
                yearTo,
                page: currentPage - 1,
                size: pageSize,
                sortBy: "publicationYear",
                sortDir: "desc",
            };

            const res = await searchPapers(params);

            const body = res?.data?.body;

            setPapers(body?.content || []);
            setTotal(body?.totalElements || 0);
        } catch (error) {
            console.error(error);

            message.error(
                error?.response?.data?.message ||
                "Failed to load papers"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const init = async () => {
            await loadJournals();
            await loadPapers(1);
        };

        init();
    }, []);

    const handleSearch = () => {
        setPage(1);
        loadPapers(1);
    };

    const handleReset = () => {
        setKeyword("");
        setAuthor("");
        setJournalId(undefined);
        setYearFrom("");
        setYearTo("");

        setPage(1);

        setTimeout(() => {
            loadPapers(1);
        }, 0);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadPapers(newPage);
    };

    return (
        <div
            style={{
                padding: "24px",
                maxWidth: "1400px",
                margin: "0 auto",
            }}
        >
            <Title level={2}>
                Search Papers
            </Title>

            {/* SEARCH BAR */}
            <Input.Search
                size="large"
                placeholder="Tìm kiếm bài báo theo từ khóa..."
                value={keyword}
                enterButton="Tìm kiếm"
                onChange={(e) =>
                    setKeyword(e.target.value)
                }
                onSearch={handleSearch}
                style={{
                    marginBottom: 24,
                }}
            />

            {/* FILTER */}
            <Card
                style={{
                    marginBottom: 24,
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={6}>
                        <Input
                            placeholder="Author name"
                            value={author}
                            onChange={(e) =>
                                setAuthor(
                                    e.target.value
                                )
                            }
                        />
                    </Col>

                    <Col xs={24} md={6}>
                        <Select
                            allowClear
                            style={{
                                width: "100%",
                            }}
                            placeholder="Journal"
                            value={journalId}
                            onChange={setJournalId}
                            options={journals.map(
                                (journal) => ({
                                    label:
                                    journal.name,
                                    value:
                                    journal.id,
                                })
                            )}
                        />
                    </Col>

                    <Col xs={12} md={3}>
                        <Input
                            type="number"
                            placeholder="Year To"
                            onChange={(e) =>
                                setYearTo(
                                    e.target.value
                                )
                            }
                        />
                    </Col>

                    <Col xs={12} md={3}>
                        <Input
                            type="number"
                            placeholder="Year From"
                            onChange={(e) =>
                                setYearFrom(
                                    e.target.value
                                )
                            }
                        />
                    </Col>

                    <Col xs={24} md={6}>
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Tìm kiếm
                        </Button>

                        <Button
                            onClick={handleReset}
                        >
                            Xóa bộ lọc
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* RESULT COUNT */}
            <div
                style={{
                    marginBottom: 20,
                }}
            >
                <Text strong>
                    Tìm thấy {total} bài báo
                </Text>
            </div>

            {/* LOADING */}
            {loading ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: 80,
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : papers.length === 0 ? (
                <Empty
                    description="Không tìm thấy bài báo nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <>
                    {papers.map((paper) => (
                        <Card
                            key={paper.id}
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    gap: 20,
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            cursor:
                                                "pointer",
                                            marginBottom:
                                                8,
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `/papers/${paper.id}`
                                            )
                                        }
                                    >
                                        {paper.title}
                                    </Title>

                                    <Text>
                                        {Array.isArray(
                                            paper.authors
                                        )
                                            ? paper.authors.join(
                                                ", "
                                            )
                                            : paper.authors}
                                    </Text>

                                    <br />

                                    <Text type="secondary">
                                        {
                                            paper.journalName
                                        }{" "}
                                        •{" "}
                                        {
                                            paper.publicationYear
                                        }
                                    </Text>

                                    <div
                                        style={{
                                            marginTop:
                                                12,
                                        }}
                                    >
                                        {paper.keywords?.map(
                                            (
                                                keyword
                                            ) => (
                                                <Tag
                                                    key={
                                                        keyword
                                                    }
                                                >
                                                    {
                                                        keyword
                                                    }
                                                </Tag>
                                            )
                                        )}
                                    </div>
                                </div>

                                <Button
                                    icon={
                                        <StarOutlined
                                            style={{
                                                color: bookmarkedIds.includes(paper.id)
                                                    ? "#faad14"
                                                    : undefined
                                            }}
                                        />
                                    }
                                    onClick={() => handleBookmark(paper.id)}
                                >
                                    Bookmark
                                </Button>
                            </div>
                        </Card>
                    ))}

                    <Pagination
                        current={page}
                        total={total}
                        pageSize={pageSize}
                        onChange={
                            handlePageChange
                        }
                        style={{
                            textAlign: "center",
                            marginTop: 24,
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default SearchPapers;