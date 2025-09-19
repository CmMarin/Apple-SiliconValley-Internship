import sys
import os
import time
import json
import threading

# Simple server status checker
def main():
    # Print out env info
    print("Python version:", sys.version)
    print("Current directory:", os.getcwd())
    print("Checking backend availability...")
    
    import requests
    from requests.exceptions import ConnectionError, Timeout
    
    backend_url = "http://localhost:8000"
    max_attempts = 5
    
    def check_backend():
        for attempt in range(max_attempts):
            try:
                print(f"Attempt {attempt+1}/{max_attempts} to connect to backend...")
                resp = requests.get(backend_url, timeout=2)
                print(f"Backend is up! Status: {resp.status_code}")
                return True
            except (ConnectionError, Timeout) as e:
                print(f"Error connecting to backend: {str(e)}")
                time.sleep(1)
        print("Failed to connect to backend after multiple attempts")
        return False
    
    # Try to check the backend
    if not check_backend():
        print("Starting backend server...")
        try:
            # Start backend in a separate thread
            def run_backend():
                try:
                    os.system("python -m app.main")
                except Exception as e:
                    print(f"Error starting backend: {e}")
            
            backend_thread = threading.Thread(target=run_backend)
            backend_thread.daemon = True
            backend_thread.start()
            
            # Wait for backend to start
            time.sleep(3)
            check_backend()
        except Exception as e:
            print(f"Failed to start backend: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()