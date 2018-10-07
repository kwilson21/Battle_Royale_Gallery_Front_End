import http from "./httpService";
import { apiUrl } from "../config.json";

import { querystring } from "querystring";
import jsonToFormData from "json-form-data";
import _ from "lodash";

const apiEndpoint = apiUrl + "/games/";

function gameUrl(id) {
  return `${apiEndpoint}${id}`;
}

export function getAllGames() {
  return http.get(apiEndpoint);
}

export function getGame(_id) {
  return http.get(gameUrl(_id));
}

export function deleteGame(_id) {
  return http.delete(gameUrl(_id));
}

export async function saveGame(game) {
  const body = { ...game };
  if (body._id) {
    delete body._id;

    if (body.image.data.name !== undefined) {
      delete body.image.contentType;
      body.image = body.image.data;
      delete body.image.data;
    }

    const formData = jsonToFormData(body);

    return http.put(gameUrl(game._id), formData);
  } else {
    if (body.description === "") {
      delete body.description;
    }

    delete body.image.contentType;
    body.image = body.image.data;
    // delete body.image.data;

    const formData = jsonToFormData(body);

    return http.post(apiEndpoint, formData);
  }
}

export function likeGame(_id) {
  return http.put(apiEndpoint + "like/" + _id);
}

export function dislikeGame(_id) {
  return http.put(apiEndpoint + "dislike/" + _id);
}

export function unlikeGame(_id) {
  return http.put(apiEndpoint + "unlike/" + _id);
}

export function undislikeGame(_id) {
  return http.put(apiEndpoint + "undislike/" + _id);
}

export function addComment(_id, comment) {
  return http.put(apiEndpoint + "comment/" + _id, comment);
}

export function deleteComment(_id, comment) {
  return http.delete(apiEndpoint + "comment/" + _id, comment);
}
