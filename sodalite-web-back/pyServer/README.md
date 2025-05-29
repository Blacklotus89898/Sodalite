# Webrtc video stream/processing server

## Cmd
```bash

# Navigate to your project directory
cd C:\path\to\your\project

# Create the virtual environment
python -m venv venv

# Activate the virtual environment on windows
.venv\Scripts\activate

# Install dependencies (optional)
pip install <package-name>

# Install from the requirements
pip install -r requirements.txt

# Deactivate the virtual environment
deactivate

# YOLO model 
yolo export model=yolo11s.pt format=engine device=0

python .\server2.py # yolo

python .\server3.py #tensorRT


```