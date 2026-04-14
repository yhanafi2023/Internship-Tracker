import requests

BASE_URL = "http://127.0.0.1:5000"

TEST_EMAIL = "paige_test@example.com"
TEST_PASSWORD = "Password123"


def test_create_account():
    payload = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }

    response = requests.post(f"{BASE_URL}/signup", json=payload)

    assert response.status_code == 200
    assert response.json().get("success") is True


def test_login():
    payload = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }

    response = requests.post(f"{BASE_URL}/login", json=payload)

    assert response.status_code == 200
    assert response.json().get("success") is True


def test_add_application():
    payload = {
        "email": TEST_EMAIL,
        "company": "Google",
        "position": "Software Intern",
        "status": "submitted"
    }

    response = requests.post(f"{BASE_URL}/applications", json=payload)

    assert response.status_code == 200
    assert response.json().get("success") is True
