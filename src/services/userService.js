import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users/";

export function signUp(user) {
  return http.post(apiEndpoint, user);
}
