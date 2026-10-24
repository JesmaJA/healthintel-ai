
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 15000,
});

export const getClinics = async () => {
    const response = await api.get("/clinics/");
    return response.data;
};

export const getQualityReport = async () => {
    const response = await api.get("/intelligence/quality/");
    return response.data;
};

export const createClinic = async (clinic) => {
    const response = await api.post("/clinics/", clinic);
    return response.data;
};

export const updateClinic = async (id, clinic) => {
    const response = await api.put(`/clinics/${id}/`, clinic);
    return response.data;
};

export const deleteClinic = async (id) => {
    const response = await api.delete(`/clinics/${id}/`);
    return response.data;
};

export default api;
