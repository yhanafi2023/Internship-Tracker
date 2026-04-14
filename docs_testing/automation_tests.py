import requests

BASE_URL = "http://localhost:5000"

def test_create_account():
    payload = {
        "name": "Paige Test",
        "email": "paige_test@example.com",
        "password": "Password123"
    }
    response = requests.post(f"{BASE_URL}/createUser", json=payload)
    assert response.status_code == 201
    assert "User created" in response.text

def test_login():
    payload = {
        "email": "paige_test@example.com",
        "password": "Password123"
    }
    response = requests.post(f"{BASE_URL}/login", json=payload)
    assert response.status_code == 200
    assert "token" in response.json()

def test_add_application():
    payload = {
        "company": "Google",
        "role": "Software Intern",
        "status": "submitted"
    }
    response = requests.post(f"{BASE_URL}/applications", json=payload)
    assert response.status_code == 201
    assert response.json()["company"] == "Google"

