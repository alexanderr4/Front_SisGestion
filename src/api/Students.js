import { apiFactory } from "./config/ApiFactory";

export async function getStudents() {
    return await apiFactory(true).get('/api/api/v1/students/');
}

export async function apiLoadStudentsBySubject(subjectId, xmlCode) {
    return await apiFactory(true, "xml").post(`/api/api/v1/import/students/xml-body?subject_id=${subjectId}`, xmlCode, {
    });
}

export async function getEnrollments(pagination) {
    return await apiFactory(true).get(`/api/api/v1/enrollments/${pagination}`);
}