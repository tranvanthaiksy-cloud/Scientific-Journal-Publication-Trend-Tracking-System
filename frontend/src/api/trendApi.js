import axiosInstance from './axiosConfig';

// ── Keyword Trend ─────────────────────────────────────────────────────────────
// GET /api/trends/keyword/{keyword} → trend của 1 keyword theo từng năm
export const getKeywordTrend = (keyword) =>
    axiosInstance.get(`/trends/keyword/${encodeURIComponent(keyword)}`);

// ── Compare Trends ────────────────────────────────────────────────────────────
// GET /api/trends/compare?keywords=ai,nlp → so sánh nhiều keywords
export const getCompareTrends = (keywords = []) => {
    const query = keywords.map(encodeURIComponent).join(',');
    return axiosInstance.get(`/trends/compare?keywords=${query}`);
};

// ── Top Keywords ──────────────────────────────────────────────────────────────
// GET /api/keywords/top?limit=20 → top keywords theo usage_count
export const getTopKeywords = (limit = 20) =>
    axiosInstance.get(`/keywords/top?limit=${limit}`);

// ── Analyze Trends ────────────────────────────────────────────────────────────
// GET /api/trends/analyze?keyword=...&yearFrom=...&yearTo=...
export const analyzeTrends = (params) =>
    axiosInstance.get('/trends/analyze', { params });

// ── Namespace object export (for pages using trendApi.method()) ───────────────
export const trendApi = {
    getKeywordTrend,
    getCompareTrends,
    getTopKeywords,
    analyzeTrends,
};