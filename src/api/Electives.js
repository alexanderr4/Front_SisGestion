import {apiFactory} from './config/ApiFactory';   

export async function getElectives() {
    return await apiFactory(true).get('/api/api/v1/subjects/');
}