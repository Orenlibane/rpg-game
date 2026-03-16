#!/usr/bin/env python3
"""Simple HTTP server for serving the RPG game."""
import http.server
import os
import sys

class GameHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

port = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 8123))
print(f"Serving on port {port}")
http.server.HTTPServer(('0.0.0.0', port), GameHandler).serve_forever()
