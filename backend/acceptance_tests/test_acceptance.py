from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_user_story_spam_detection():
    response = client.post("/predict/spam", json={
        "text": "Free gift now!!!"
    })

    assert response.status_code == 200
    assert "prediction" in response.json()


def test_user_story_malware_detection():
    import io
    file = io.BytesIO(b"malicious content")

    response = client.post(
        "/predict/malware/file",
        files={"file": ("virus.exe", file, "application/octet-stream")}
    )

    assert response.status_code == 200