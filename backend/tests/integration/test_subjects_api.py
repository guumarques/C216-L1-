SUBJECT = {"name": "Sistemas Distribuídos", "professor": "Chris", "total_classes": 80}


def create_subject(client, **overrides):
    resp = client.post("/subjects/", json={**SUBJECT, **overrides})
    assert resp.status_code == 201
    return resp.json()


def test_create_subject_uses_default_limit(client):
    body = create_subject(client)

    assert body["id"] > 0
    assert body["name"] == "Sistemas Distribuídos"
    assert body["absence_limit_percent"] == 25


def test_create_subject_without_professor(client):
    body = create_subject(client, professor=None)

    assert body["professor"] is None


def test_create_subject_with_duplicate_name_returns_409(client):
    create_subject(client)

    resp = client.post("/subjects/", json={**SUBJECT, "name": "sistemas distribuídos"})

    assert resp.status_code == 409
    assert resp.json()["detail"] == "Já existe uma disciplina com esse nome."


def test_create_subject_with_invalid_data_returns_422(client):
    assert client.post("/subjects/", json={**SUBJECT, "name": "   "}).status_code == 422
    assert (
        client.post("/subjects/", json={**SUBJECT, "total_classes": 0}).status_code
        == 422
    )
    assert (
        client.post(
            "/subjects/", json={**SUBJECT, "absence_limit_percent": 101}
        ).status_code
        == 422
    )


def test_list_subjects_ordered_by_name(client):
    create_subject(client, name="Redes")
    create_subject(client, name="Banco de Dados")

    resp = client.get("/subjects/")

    assert resp.status_code == 200
    assert [s["name"] for s in resp.json()] == ["Banco de Dados", "Redes"]


def test_get_subject(client):
    created = create_subject(client)

    resp = client.get(f"/subjects/{created['id']}")

    assert resp.status_code == 200
    assert resp.json() == created


def test_get_missing_subject_returns_404(client):
    resp = client.get("/subjects/999")

    assert resp.status_code == 404
    assert resp.json()["detail"] == "Disciplina não encontrada."


def test_update_subject(client):
    created = create_subject(client)

    resp = client.put(
        f"/subjects/{created['id']}", json={**SUBJECT, "total_classes": 40}
    )

    assert resp.status_code == 200
    assert resp.json()["total_classes"] == 40


def test_update_subject_to_name_of_another_returns_409(client):
    create_subject(client, name="Redes")
    other = create_subject(client, name="Banco de Dados")

    resp = client.put(f"/subjects/{other['id']}", json={**SUBJECT, "name": "Redes"})

    assert resp.status_code == 409


def test_update_missing_subject_returns_404(client):
    assert client.put("/subjects/999", json=SUBJECT).status_code == 404


def test_delete_subject(client):
    created = create_subject(client)

    assert client.delete(f"/subjects/{created['id']}").status_code == 204
    assert client.get(f"/subjects/{created['id']}").status_code == 404


def test_delete_missing_subject_returns_404(client):
    assert client.delete("/subjects/999").status_code == 404
