#!/bin/bash
# Go to script directory
cd "$(dirname "$0")"

# Install requirements if needed (quietly)
pip install -r requirements.txt > /dev/null 2>&1

# Run the app
echo "Starting News Summarizer..."
python3 -m streamlit run app.py
