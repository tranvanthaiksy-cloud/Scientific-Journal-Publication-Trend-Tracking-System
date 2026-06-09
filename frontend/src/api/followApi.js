import axiosInstance from './axiosConfig';
const API_BASE_URL = "http://localhost:8080";
export const followApi = {
    getFollows: () => axiosInstance.get(`${API_BASE_URL}/api/follows/me`),
    unfollow: (id) => axiosInstance.delete(`${API_BASE_URL}/api/follows/${id}`)
};