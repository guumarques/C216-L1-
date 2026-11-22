import datetime as dt

SUBJECT = {"name": "Redes", "total_classes": 80}
ABSENCE = {"date": "2026-11-10"}


def create_subject(client):
    resp = client.post("/subjects/", json=SUBJECT)
    assert resp.status_code == 201
    return resp.json()["id"]


def create_absence(client, subject_id, **overrides):
    resp = client.post(
        f"/subjects/{subject_id}/absences", json={**ABSENCE, **overrides}
    )
    assert resp.status_code == 201
    return resp.json()


def test_create_absence(client):
    subject_id = create_subject(client)

    body = create_absence(client, subject_id)

    assert body["subject_id"] == subject_id
    assert body["date"] == "2026-11-10"
    assert "quantity" not in body
    assert body["justified"] is False
    assert body["note"] is None


def test_list_absences_newest_first(client):
    subject_id = create_subject(client)
    create_absence(client, subject_id, date="2026-11-03")
    create_absence(client, subject_id, date="2026-11-10")

    resp = client.get(f"/subjects/{subject_id}/absences")

    assert resp.status_code == 200
    assert [a["date"] for a in resp.json()] == ["2026-11-10", "2026-11-03"]


def test_absences_of_missing_subject_return_404(client):
    assert client.get("/subjects/999/absences").status_code == 404
    assert client.post("/subjects/999/absences", json=ABSENCE).status_code == 404


def test_absence_on_same_date_returns_409(client):
    subject_id = create_subject(client)
    create_absence(client, subject_id)

    resp = client.post(f"/subjects/{subject_id}/absences", json=ABSENCE)

    assert resp.status_code == 409
    assert (
        resp.json()["detail"]
        == "Já existe uma falta registrada nessa data para essa disciplina."
    )


def test_same_date_in_another_subject_is_allowed(client):
    subject_id = create_subject(client)
    create_absence(client, subject_id)
    other = client.post("/subjects/", json={**SUBJECT, "name": "Banco de Dados"})

    create_absence(client, other.json()["id"])


def test_absence_in_the_future_returns_422(client):
    subject_id = create_subject(client)
    tomorrow = (dt.date.today() + dt.timedelta(days=1)).isoformat()

    resp = client.post(
        f"/subjects/{subject_id}/absences", json={**ABSENCE, "date": tomorrow}
    )

    assert resp.status_code == 422


def test_absence_without_date_returns_422(client):
    subject_id = create_subject(client)

    resp = client.post(f"/subjects/{subject_id}/absences", json={})

    assert resp.status_code == 422


def test_update_absence(client):
    subject_id = create_subject(client)
    absence = create_absence(client, subject_id)

    resp = client.put(
        f"/absences/{absence['id']}",
        json={**ABSENCE, "justified": True, "note": "Atestado médico"},
    )

    assert resp.status_code == 200
    assert resp.json()["justified"] is True
    assert resp.json()["note"] == "Atestado médico"


def test_update_absence_to_date_of_another_returns_409(client):
    subject_id = create_subject(client)
    create_absence(client, subject_id, date="2026-11-03")
    other = create_absence(client, subject_id, date="2026-11-10")

    resp = client.put(
        f"/absences/{other['id']}", json={**ABSENCE, "date": "2026-11-03"}
    )

    assert resp.status_code == 409


def test_delete_absence(client):
    subject_id = create_subject(client)
    absence = create_absence(client, subject_id)

    assert client.delete(f"/absences/{absence['id']}").status_code == 204
    assert client.get(f"/subjects/{subject_id}/absences").json() == []


def test_missing_absence_returns_404(client):
    assert client.put("/absences/999", json=ABSENCE).status_code == 404
    assert client.delete("/absences/999").status_code == 404


def test_deleting_subject_deletes_its_absences(client):
    subject_id = create_subject(client)
    absence = create_absence(client, subject_id)

    assert client.delete(f"/subjects/{subject_id}").status_code == 204

    assert client.delete(f"/absences/{absence['id']}").status_code == 404
