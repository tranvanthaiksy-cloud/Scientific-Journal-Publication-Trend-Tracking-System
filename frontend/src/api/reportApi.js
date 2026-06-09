import axiosInstance from './axiosConfig';

const API_BASE_URL = 'https://94959c42-7300-4e76-bd1d-6ec3e3bfc33e.mock.pstmn.io'; // Đổi sang URL Postman của bạn

export const reportApi = {
    getHistory: () => axiosInstance.get(`${API_BASE_URL}/api/reports/history`),
    generateReport: (data) => axiosInstance.post(`${API_BASE_URL}/api/reports/generate`, data),
    getReportDetail: (id) => axiosInstance.get(`${API_BASE_URL}/api/reports/${id}`)
};