import { request } from "./api.js";

export function listSubjects() {
  return request("/subjects/");
}

export function createSubject(data) {
  return request("/subjects/", { method: "POST", body: data });
}

export function updateSubject(id, data) {
  return request(`/subjects/${id}`, { method: "PUT", body: data });
}

export function deleteSubject(id) {
  return request(`/subjects/${id}`, { method: "DELETE" });
}
