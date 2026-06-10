import axiosInstance from './axiosConfig';

const API_BASE_URL = "http://localhost:8080";
export const topicApi = {
    getTopics: () => axiosInstance.get(`${API_BASE_URL}/api/topics`),
    getTopicDetail: (id) => axiosInstance.get(`${API_BASE_URL}/api/topics/${id}`),
};