ALLOWED_ORIGIN = "http://localhost:5173"


def test_cors_allows_frontend_origin(client):
    response = client.options(
        "/subjects/",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "POST",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == ALLOWED_ORIGIN


def test_cors_blocks_unknown_origin(client):
    response = client.get("/subjects/", headers={"Origin": "http://evil.example"})

    assert "access-control-allow-origin" not in response.headers
