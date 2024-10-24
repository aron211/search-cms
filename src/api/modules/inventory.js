import axios from 'axios'
import { apiHttp } from '../axiosApi'

async function inventoryGetList() {
    const result = await apiHttp('get', '/api/v1/inventory');
    return result;
}
async function searchnameInventory(keywords) {
    try {
      const response = await apiHttp('GET', '/api/v1/inventory/search', null, {
        params: { keywords: keywords },
      });
      return response.data;
    } catch (error) {
      console.error('Error en searchInventory:', error);
      throw error;
    }
  }

export { inventoryGetList,
        searchnameInventory
}