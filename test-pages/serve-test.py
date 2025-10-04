#!/usr/bin/env python3
"""
Simple HTTP server for testing the Rainbow Relax widget.
Serves both the test pages and the dist-widget directory.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Get the project root directory
project_root = Path(__file__).parent.parent
dist_widget_path = project_root / "dist-widget"
test_pages_path = project_root / "test-pages"

# Change to project root so we can serve both directories
os.chdir(project_root)


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for widget testing
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_GET(self):
        # Handle test pages
        if self.path.startswith("/test-pages/"):
            self.path = self.path[12:]  # Remove '/test-pages/' prefix
            self.directory = str(test_pages_path)
        # Handle dist-widget files
        elif self.path.startswith("/dist-widget/"):
            self.path = self.path[12:]  # Remove '/dist-widget/' prefix
            self.directory = str(dist_widget_path)
        # Default to project root
        else:
            self.directory = str(project_root)

        return super().do_GET()


def main():
    port = 8086  # Use a different port to avoid conflicts

    print(f"Starting test server on port {port}")
    print(f"Project root: {project_root}")
    print(f"Test pages: {test_pages_path}")
    print(f"Widget files: {dist_widget_path}")
    print()
    print("Available test pages:")
    print(f"  - Dynamic Test: http://localhost:{port}/test-pages/dynamic-test.html")
    print(f"  - Widget Files: http://localhost:{port}/dist-widget/")
    print()
    print("Press Ctrl+C to stop the server")

    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(
                f"Port {port} is already in use. Please stop the existing server or use a different port."
            )
            sys.exit(1)
        else:
            raise


if __name__ == "__main__":
    main()
