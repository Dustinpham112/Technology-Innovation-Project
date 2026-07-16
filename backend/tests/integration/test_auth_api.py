from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register():
    response = client.post("/register", json={
        "username": "testuser123",
        "password": "123"
    })

    assert response.status_code in [200, 400]


def test_login():
    response = client.post("/login", json={
        "username": "testuser123",
        "password": "123"
    })

    assert response.status_code in [200, 401]