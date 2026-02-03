import requests

profile = {
    "gpa": 3.5,
    "ielts": 7.0,
    "budget": 20000,
    "country": "Netherlands",
    "field": "Business / MBA"
}

try:
    # Testing /recommend
    print("Testing /recommend...")
    res = requests.post("http://localhost:8000/recommend", json=profile)
    print("Response Status:", res.status_code)
    print("Response JSON:", res.json())
except Exception as e:
    print("Error connecting to backend:", e)
