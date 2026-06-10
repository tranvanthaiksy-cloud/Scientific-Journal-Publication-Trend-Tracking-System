import axiosInstance from './axiosConfig';

const API_BASE_URL = "http://localhost:8080";
export const dashboardApi = {

    getStats: () => axiosInstance.get(`${API_BASE_URL}`),

    getTopJournals: () => axiosInstance.get(`${API_BASE_URL}/api/dashboard/top-journals`),


    getFieldDistribution: () => axiosInstance.get(`${API_BASE_URL}/api/dashboard/field-distribution`),

    getYearlyStats: () => axiosInstance.get(`${API_BASE_URL}/yearly-stats`),
    getTrending: () => axiosInstance.get(`${API_BASE_URL}/trending`),
    getRecentPapers: () => axiosInstance.get(`${API_BASE_URL}/recent-papers`),
};