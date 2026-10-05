def test_create_and_list_users(client):
    resp = client.post("/users/", json={"name": "Ana", "email": "ana@example.com"})
    assert resp.status_code == 201
    assert resp.json()["id"] == 1

    resp = client.get("/users/")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_get_user_by_id(client):
    created = client.post(
        "/users/", json={"name": "Ana", "email": "ana@example.com"}
    ).json()

    resp = client.get(f"/users/{created['id']}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Ana"


def test_get_user_not_found(client):
    resp = client.get("/users/999")
    assert resp.status_code == 404


def test_put_user_replaces_fields(client):
    created = client.post(
        "/users/", json={"name": "Ana", "email": "ana@example.com"}
    ).json()

    resp = client.put(
        f"/users/{created['id']}",
        json={"name": "Ana Paula", "email": "ana@example.com"},
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Ana Paula"


def test_put_user_not_found(client):
    resp = client.put("/users/999", json={"name": "X", "email": "x@x.com"})
    assert resp.status_code == 404


def test_patch_user_partial_update(client):
    created = client.post(
        "/users/", json={"name": "Ana", "email": "ana@example.com"}
    ).json()

    resp = client.patch(f"/users/{created['id']}", json={"name": "Ana P."})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Ana P."
    assert resp.json()["email"] == "ana@example.com"


def test_patch_user_not_found(client):
    resp = client.patch("/users/999", json={"name": "X"})
    assert resp.status_code == 404


def test_delete_user(client):
    created = client.post(
        "/users/", json={"name": "Ana", "email": "ana@example.com"}
    ).json()

    resp = client.delete(f"/users/{created['id']}")
    assert resp.status_code == 204

    resp = client.get(f"/users/{created['id']}")
    assert resp.status_code == 404


def test_delete_user_not_found(client):
    resp = client.delete("/users/999")
    assert resp.status_code == 404


def test_list_users_pagination(client):
    for i in range(3):
        client.post("/users/", json={"name": f"User{i}", "email": f"u{i}@example.com"})

    resp = client.get("/users/?skip=1&limit=1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
