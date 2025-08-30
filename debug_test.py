import requests
import json

# Simple debug test
try:
    response = requests.post("http://localhost:8000/api/nlp", 
                           json={"query": "hello"}, 
                           timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"Headers: {response.headers}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()