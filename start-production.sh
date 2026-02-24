#!/bin/bash
# Load environment variables from .env file and start the production server

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Export all variables from .env file
export $(grep -v '^#' .env | xargs)

# Start the production server
node .output/server/index.mjs
