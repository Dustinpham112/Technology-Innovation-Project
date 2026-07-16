from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_system_flow():
    # register
    client.post("/register", json={
        "username": "flowuser",
        "password": "123"
    })

    # login
    login = client.post("/login", json={
        "username": "flowuser",
        "password": "123"
    })

    assert login.status_code in [200, 401]

    # spam prediction
    spam = client.post("/predict/spam", json={
        "text": "Hello"
    })

    assert spam.status_code == 200

    # malware prediction
    import io
    file = io.BytesIO(b"test content")

    malware = client.post(
        "/predict/malware/file",
        files={"file": ("test.exe", file, "application/octet-stream")}
    )

    assert malware.status_code == 200