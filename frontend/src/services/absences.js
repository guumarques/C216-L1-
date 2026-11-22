import { request } from "./api.js";

export function listAbsences(subjectId) {
  return request(`/subjects/${subjectId}/absences`);
}

export function createAbsence(subjectId, data) {
  return request(`/subjects/${subjectId}/absences`, {
    method: "POST",
    body: data,
  });
}

export function updateAbsence(id, data) {
  return request(`/absences/${id}`, { method: "PUT", body: data });
}

export function deleteAbsence(id) {
  return request(`/absences/${id}`, { method: "DELETE" });
}
