FRONTEND_ORIGIN = "http://localhost:5173"


def test_cors_allows_frontend_origin(client):
    resp = client.options(
        "/users/",
        headers={
            "Origin": FRONTEND_ORIGIN,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert resp.status_code == 200
    assert resp.headers["access-control-allow-origin"] == FRONTEND_ORIGIN


def test_cors_blocks_unknown_origin(client):
    resp = client.get("/users/", headers={"Origin": "http://malicioso.example"})
    assert resp.status_code == 200
    assert "access-control-allow-origin" not in resp.headers
