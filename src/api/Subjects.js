import {apiFactory} from './config/ApiFactory';   

export async function getSubjects() {
    return await apiFactory(true).get('/api/api/v1/subjects/');
}

export async function getStudentsBySubject (parameter) {
    return await apiFactory(true).get(`/api/api/v1/enrollments/subject/${parameter}?`);
}