import { apiFactory } from "./config/ApiFactory";

export async function getCancellations() {
    return await apiFactory(true).get('/api/api/v1/cancellation-requests/');
    
}
