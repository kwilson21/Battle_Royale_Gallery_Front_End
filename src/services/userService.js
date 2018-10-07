import http from "./httpService";

const apiEndpoint = "/users/";

export function signUp(user) {
  return http.post(apiEndpoint, user);
}
