import axios from "axios";
import { apiHttp } from "../axiosApi";

async function vendorGetList() {
  const result = await apiHttp("get", "/api/v1/vendors");
  return result;
}
// async function getClientesByVendor(vendorId) {
//     console.log("call metodo getClientesByVendedir")
//     try {
//       const result = await apiHttp('get', `/api/v1/vendors/clientes/${vendorId}`);
//       console.log("API response for getClientesByVendor:", result);
//       console.log("Result.data:", result.data); // Si la respuesta está en result.data
//       console.log("Client data:", result.data ? result.data.clients : 'No clients found');
//       return result;
//     } catch (error) {
//       console.error('Error in getClientesByVendor:', error);
//     }
//   }
async function getClientesByVendor(ci) {
  try {
    const result = await apiHttp("get", `/api/v1/vendors/clientes/${ci}`);
    return result;
  } catch (error) {
    console.error("Error in getClientesByVendor:", error);
  }
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

async function createVendor(vendorToCreate) {
  const result = await apiHttp("post", "/api/v1/vendors", vendorToCreate);
  return result;
}

async function deleteVendor(id) {
  let result;
  result = await apiHttp("delete", "/api/v1/vendors/" + id);
  return result;
}

async function updateVendor(id, vendorToUpdate) {
  const result = await apiHttp(
    "patch",
    "/api/v1/vendors/" + id,
    vendorToUpdate
  );
  return result;
}

export {
  vendorGetList,
  getClientesByVendor,
  updateVendor,
  deleteVendor,
  createVendor
};
