import axiosInstance from './axiosConfig';

const API_BASE_URL = 'https://94959c42-7300-4e76-bd1d-6ec3e3bfc33e.mock.pstmn.io';


export const trendApi = {
    getKeywordTrend: (keyword) => axiosInstance.get(`${API_BASE_URL}/api/trends/keyword/${keyword}`),
    getCompareTrends: (keywords) => {
        const query = keywords.join(',');
        return axiosInstance.get(`${API_BASE_URL}/api/trends/compare?keywords=${query}`);
    },

    getTopKeywords: (limit = 20) => axiosInstance.get(`${API_BASE_URL}/api/keywords/top?limit=${limit}`),

    analyzeTrends: (params) => axiosInstance.get(`${API_BASE_URL}/api/trends/analyze`, { params }),
};