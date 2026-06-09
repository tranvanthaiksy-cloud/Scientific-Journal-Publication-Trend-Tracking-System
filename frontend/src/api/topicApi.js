import axiosInstance from './axiosConfig';

const API_BASE_URL = 'https://94959c42-7300-4e76-bd1d-6ec3e3bfc33e.mock.pstmn.io'; // Thay bằng URL Postman của bạn

export const topicApi = {
    getTopics: () => axiosInstance.get(`${API_BASE_URL}/api/topics`),
    getTopicDetail: (id) => axiosInstance.get(`${API_BASE_URL}/api/topics/${id}`),
};