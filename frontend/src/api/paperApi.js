import axiosInstance from './axiosConfig';

// ── Papers Search ─────────────────────────────────────────────────────────────
// GET /api/papers/search?keyword=...&author=...&journal=...&yearFrom=...&yearTo=...&page=0&size=10
export const searchPapers = (params) =>
    axiosInstance.get('/papers/search', { params });

// ── Paper Detail ──────────────────────────────────────────────────────────────
// GET /api/papers/{id}
export const getPaperById = (id) =>
    axiosInstance.get(`/papers/${id}`);

// ── Papers by Keyword ─────────────────────────────────────────────────────────
// GET /api/keywords/{name}/papers?page=0&size=10
export const getPapersByKeyword = (name, params) =>
    axiosInstance.get(`/keywords/${encodeURIComponent(name)}/papers`, { params });

// ── Papers by Author ──────────────────────────────────────────────────────────
// GET /api/authors/{id}/papers?page=0&size=10
export const getPapersByAuthor = (id, params) =>
    axiosInstance.get(`/authors/${id}/papers`, { params });

// ── Papers by Journal ─────────────────────────────────────────────────────────
// GET /api/journals/{id}/papers?page=0&size=10
export const getPapersByJournal = (id, params) =>
    axiosInstance.get(`/journals/${id}/papers`, { params });

// ── Top Keywords ──────────────────────────────────────────────────────────────
// GET /api/keywords/top?limit=20
export const getTopKeywords = (limit = 20) =>
    axiosInstance.get(`/keywords/top?limit=${limit}`);

// ── Author Detail ─────────────────────────────────────────────────────────────
// GET /api/authors/{id}
export const getAuthorById = (id) =>
    axiosInstance.get(`/authors/${id}`);
