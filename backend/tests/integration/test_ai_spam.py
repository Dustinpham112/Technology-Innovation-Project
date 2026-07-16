from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_spam_api_success():
    response = client.post("/predict/spam", json={
        "text": "Win a free iPhone!!!"
    })

    assert response.status_code == 200
    assert "prediction" in response.json()


def test_spam_api_empty_input():
    response = client.post("/predict/spam", json={
        "text": ""
    })

    assert response.status_code == 400