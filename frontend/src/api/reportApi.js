import axiosInstance from './axiosConfig';

// ── Report History ────────────────────────────────────────────────────────────
// GET /api/reports/history → danh sách báo cáo đã tạo (cần JWT)
export const getReportHistory = () =>
    axiosInstance.get('/reports/history');

// ── Generate Report ───────────────────────────────────────────────────────────
// POST /api/reports/generate  body: { title, keyword, yearFrom, yearTo, ... }
export const generateReport = (data) =>
    axiosInstance.post('/reports/generate', data);

// ── Report Detail ─────────────────────────────────────────────────────────────
// GET /api/reports/{id}
export const getReportDetail = (id) =>
    axiosInstance.get(`/reports/${id}`);