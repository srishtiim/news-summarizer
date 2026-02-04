#!/bin/bash
# Go to script directory
cd "$(dirname "$0")"

# Install requirements if needed (quietly)
pip install -r requirements.txt > /dev/null 2>&1

echo "Starting Authentication Server (Port 5001)..."
python3 auth_server.py &
AUTH_PID=$!

echo "Starting News Summarizer App (Port 8501)..."
python3 -m streamlit run app.py &
STREAMLIT_PID=$!

echo "Both services are running!"
echo "Please visit: http://localhost:5001 to Login"

# Wait for process to end (trap signals to kill both)
trap "kill $AUTH_PID $STREAMLIT_PID; exit" SIGINT SIGTERM # Kill both on Ctrl+C

wait
