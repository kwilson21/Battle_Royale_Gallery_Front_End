import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = "/users/";

export function signUp(user) {
  return http.post(apiEndpoint, user);
}
