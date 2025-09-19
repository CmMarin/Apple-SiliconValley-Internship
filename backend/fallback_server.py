# Simple HTTP server that responds to parse requests with a fallback implementation
# This is meant to be used when the regular backend server is not working

import http.server
import socketserver
import json
import re
from typing import List, Dict, Any, Optional

# Port for the server
PORT = 8000

# Simple task extractor (copy of the client-side implementation)
def extract_tasks(input_text: str) -> List[Dict[str, Any]]:
    tasks: List[Dict[str, Any]] = []
    
    # Split by different types of separators
    for raw in re.split(r"[\.\n;•]+", input_text):
        s = raw.strip()
        if not s or len(s) < 3:
            continue
        
        # Skip greetings
        if s.lower() in {"hi", "hello", "salut", "hey"}:
            continue
            
        # Extract time
        time = None
        time_match = re.search(r"at\s+(\d{1,2}[:h]\d{2}|\d{1,2}\s*(am|pm|a\.m\.|p\.m\.))", s, re.IGNORECASE)
        if time_match:
            time = time_match.group(1)
            
        # Extract deadline
        deadline = None
        deadline_match = re.search(r"by\s+(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|tomorrow|today)", s, re.IGNORECASE)
        if deadline_match:
            deadline = deadline_match.group(1)
            
        # Extract category
        category = None
        category_match = re.search(r"\#(\w+)|\((\w+)\)", s)
        if category_match:
            category = category_match.group(1) or category_match.group(2)
            
        task = {
            "task": s,
            "time": time,
            "deadline": deadline,
            "category": category
        }
        tasks.append(task)
        
    return tasks

class FallbackHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        
    def do_GET(self):
        if self.path == "/":
            self._send_json({"message": "Fallback API Server"})
        elif self.path == "/model/status":
            self._send_json({
                "state": "not_loaded",
                "model": None,
                "error": None,
                "loading_started": False
            })
        else:
            self.send_error(404, "Not Found")
            
    def do_POST(self):
        if self.path == "/parse":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            
            try:
                request = json.loads(post_data)
                text = request.get("text", "")
                
                tasks = extract_tasks(text)
                
                response = {
                    "tasks": tasks,
                    "method": "fallback_server",
                    "model_state": "not_loaded",
                    "message": "Using simplified parsing as the main server is not available"
                }
                
                self._send_json(response)
            except Exception as e:
                self._send_error(str(e))
                
        elif self.path == "/model/load":
            self._send_json({
                "state": "loading",
                "model": "none",
                "error": None,
                "loading_started": True
            })
        else:
            self.send_error(404, "Not Found")
            
    def _send_json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
        
    def _send_error(self, message):
        self.send_response(400)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"error": message}).encode())
        
if __name__ == "__main__":
    handler = FallbackHandler
    
    # Try to create server with retry logic for port conflicts
    for attempt in range(3):
        try:
            with socketserver.TCPServer(("", PORT), handler) as httpd:
                print(f"Serving fallback API at port {PORT}")
                httpd.serve_forever()
                break
        except OSError as e:
            if "Address already in use" in str(e):
                # If port is in use, try the next port
                PORT += 1
                print(f"Port in use, trying port {PORT}...")
            else:
                raise