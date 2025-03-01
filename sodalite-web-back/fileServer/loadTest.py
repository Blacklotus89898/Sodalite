import requests
import threading

def send_request():
    try:
        response = requests.get("http://your-server-address")
        print(f"Status: {response.status_code}")
    except Exception as e:
        print(f"Request failed: {e}")

# Simulate 100 concurrent requests
threads = []
for _ in range(100):
    thread = threading.Thread(target=send_request)
    threads.append(thread)
    thread.start()

# Wait for all threads to complete
for thread in threads:
    thread.join()
