import { apiFactory } from "./config/ApiFactory";

export async function getCancellations() {
    return await apiFactory(true).get('/api/api/v1/cancellation-requests/');
    
}

export async function createCancellation(data) {
    return await apiFactory(true).post('/api/api/v1/cancellation-requests/', data);
}