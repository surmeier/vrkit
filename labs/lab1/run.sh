#!/usr/bin/env bash

python3 -m venv venv
source venv/bin/activate
pip install Flask
pip install Flask-Cors
python server/main.py &
open http://127.0.0.1:8000/index.html
