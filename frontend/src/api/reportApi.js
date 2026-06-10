import axiosInstance from './axiosConfig';

const API_BASE_URL = "http://localhost:8080";
export const reportApi = {
    getHistory: () => axiosInstance.get(`${API_BASE_URL}/api/reports/history`),
    generateReport: (data) => axiosInstance.post(`${API_BASE_URL}/api/reports/generate`, data),
    getReportDetail: (id) => axiosInstance.get(`${API_BASE_URL}/api/reports/${id}`)
};