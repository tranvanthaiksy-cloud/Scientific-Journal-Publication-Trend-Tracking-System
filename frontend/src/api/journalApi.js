import axiosInstance from './axiosConfig';

// ── List Journals ─────────────────────────────────────────────────────────────
// GET /api/journals?search=...&field=...&page=0&size=10
export const getJournals = (params) =>
    axiosInstance.get('/journals', { params });

// ── Journal Detail ────────────────────────────────────────────────────────────
// GET /api/journals/{id}  (trả về isFollowed nếu đã đăng nhập)
export const getJournalById = (id) =>
    axiosInstance.get(`/journals/${id}`);

// ── Papers by Journal ─────────────────────────────────────────────────────────
// GET /api/journals/{id}/papers?page=0&size=10
export const getPapersByJournal = (id, params) =>
    axiosInstance.get(`/journals/${id}/papers`, { params });
