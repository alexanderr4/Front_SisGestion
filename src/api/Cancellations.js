import { apiFactory } from "./config/ApiFactory";

export function getCancellations() {
    return apiFactory(true).privateClient('/api/api/v1/cancellation-requests');
    
}
