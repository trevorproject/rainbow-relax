#!/bin/bash
set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Build the widget first
echo "Building widget..."
cd "$SCRIPT_DIR"
npm run build:widget

# Change to dist-widget directory and start server
echo "Starting server..."
cd dist-widget
python3 -m http.server 8080
