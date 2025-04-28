import { apiFactory } from "./config/ApiFactory";   

export async function getStudents() {
    return await apiFactory(true).get('/api/api/v1/students/');
}