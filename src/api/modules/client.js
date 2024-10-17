import axios from 'axios'
import { apiHttp } from '../axiosApi'

async function clientGetList() {
    const result = await apiHttp('get', '/api/v1/client');
    return result
}

// async function usersGet (IdUserLanding) {
//   let result
//   result = await axios.get(
//     'https://as-humedal-api.azurewebsites.net/Users/Get?IdUserLanding=' +
//       IdUserLanding
//   )
//   console.log('GETRESULT: ', result.data.data)
//   return result.data.data
// }

async function createClient(clientToCreate) {
    const result = await apiHttp('post', '/api/v1/client', clientToCreate);

    // console.log('Cliente creado: ', result)
    return result
}

async function deleteClient(id) {
    let result
    result = await apiHttp('delete', '/api/v1/client/' + id)
    // console.log('Cliente Eliminado: ', result)
    return result
}


// async function updateClient(id, clientToUpdate) {
//     const result = await apiHttp('patch', '/api/v1/users/updateProfile/' + id, userToUpdate)
//     console.log('Usuario Actualizado: ', result)
//     return result
// }


export {
    clientGetList,
    //   loginUser,
    // updateUser,
    deleteClient,
    createClient,
    //   usersGet,
}
