import {apiFactory} from './config/ApiFactory';   

export async function getSubjects(pagination) {
    return await apiFactory(true).get(`/api/api/v1/subjects/${pagination}`);
}

export async function getStudentsBySubject (parameter, pagination) {
    return await apiFactory(true).get(`/api/api/v1/enrollments/subject/${parameter}?${pagination}`);
}