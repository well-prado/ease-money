import axios from "axios";
import { AppError } from "./utils/AppError";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    console.log("CONFIG", config);
    return config;
  },
  (error) => {
    console.error("ENTROU AQUI", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.errors.errors[0]));
    } else {
      return Promise.reject(
        new AppError("Erro no servidor. Tente novamente mais tarde.")
      );
    }
  }
);

// async function refreshToken(e: Error) {
//   return new Promise((resolve, reject) => {
//     try {
//       const refresh_token = localStorage.getItem("refresh_token");
//       const header = {
//         "Content-Type": "application/json",
//         Authorization: import.meta.env.AUTHORIZATION,
//       };
//       const parameters = {
//         method: "POST",
//         headers: header,
//       };
//       const body = {
//         grant_type: "refresh_token",
//         refresh_token,
//       };
//       axios
//         .post(import.meta.env.API_URL + "/refreshtoken", body, parameters)
//         .then(async (res) => {
//           localStorage.setItem("access_token", res.data.access_token);
//           localStorage.setItem("refresh_token", res.data.refresh_token);
//           // Fazer algo caso seja feito o refresh token
//           return resolve(res);
//         })
//         .catch((e: Error) => {
//           // Fazer algo caso não seja feito o refresh token
//           return reject(e);
//         });
//     } catch (e) {
//       return reject(e);
//     }
//   });
// }

export default api;
