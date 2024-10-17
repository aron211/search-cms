import axios from 'axios'
import { apiHttp } from '../axiosApi'

async function inventoryGetList() {
    const result = await apiHttp('get', '/api/v1/inventory');
    return result;
}

export { inventoryGetList}