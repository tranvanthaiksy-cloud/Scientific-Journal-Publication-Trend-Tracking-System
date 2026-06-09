import axiosInstance from './axiosConfig';

// Giữ nguyên link gốc của bạn
const API_BASE_URL = 'https://94959c42-7300-4e76-bd1d-6ec3e3bfc33e.mock.pstmn.io';

export const dashboardApi = {

    getStats: () => axiosInstance.get(`${API_BASE_URL}`),

    getTopJournals: () => axiosInstance.get(`${API_BASE_URL}/api/dashboard/top-journals`),


    getFieldDistribution: () => axiosInstance.get(`${API_BASE_URL}/api/dashboard/field-distribution`),

    getYearlyStats: () => axiosInstance.get(`${API_BASE_URL}/yearly-stats`),
    getTrending: () => axiosInstance.get(`${API_BASE_URL}/trending`),
    getRecentPapers: () => axiosInstance.get(`${API_BASE_URL}/recent-papers`),
};