#!/bin/bash

# Navigate to the project directory
# (Using the absolute path based on where this file is located)
cd "$(dirname "$0")"

# Log start time
echo "Starting update at $(date)" >> update.log

# Run the update script
# Ensure python3 is in the path. You might need to specify the full path to python3 if cron doesn't find it.
# e.g., /usr/local/bin/python3 or /usr/bin/python3
if command -v python3 &> /dev/null; then
    python3 daily_update.py >> update.log 2>&1
else
    echo "Error: python3 not found" >> update.log
fi

# Log completion
echo "Update finished at $(date)" >> update.log
echo "-----------------------------------" >> update.log
