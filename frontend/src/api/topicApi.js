import axiosInstance from './axiosConfig';

// ── Top Keywords (Topics) ─────────────────────────────────────────────────────
// GET /api/keywords/top?limit=20 → top keywords phổ biến nhất
export const getTopKeywords = (limit = 20) =>
    axiosInstance.get(`/keywords/top?limit=${limit}`);

// ── Papers by Keyword ─────────────────────────────────────────────────────────
// GET /api/keywords/{name}/papers?page=0&size=10
export const getPapersByKeyword = (name, params) =>
    axiosInstance.get(`/keywords/${encodeURIComponent(name)}/papers`, { params });

// ── Journals by Field ─────────────────────────────────────────────────────────
// GET /api/journals?field=...&page=0&size=10
export const getJournalsByField = (field, params) =>
    axiosInstance.get('/journals', { params: { field, ...params } });