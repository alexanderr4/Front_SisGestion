import { apiFactory } from "./config/ApiFactory";

export async function getStudents(pagination) {
    return await apiFactory(true).get(`/api/api/v1/students/${pagination}`);
}

export async function apiLoadStudentsBySubject(subjectId, xmlCode) {
    return await apiFactory(true, "xml").post(`/api/api/v1/import/students/xml-body?subject_id=${subjectId}`, xmlCode, {
    });
}

export async function getEnrollments(pagination) {
    return await apiFactory(true).get(`/api/api/v1/enrollments/${pagination}`);
}

export async function getEnrollmentsBySubject(id) {
    return await apiFactory(true).get(`/api/api/v1/enrollments/subject/${id}?page=1&page_size=90`);
}

