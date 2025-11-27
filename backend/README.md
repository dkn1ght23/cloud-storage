# Backend Setup Guide (CloudVault)

This guide explains how to create a virtual environment, install dependencies, set environment variables, and start the backend server — all in one place.

---

## 1. Create and Activate Virtual Environment (venv)

### Create venv
```bash
python -m venv venv
```
### Activate venv (Windows or Mac)
```bash
venv\Scripts\activate
source venv/bin/activate
```

## 2. Install Dependencies

### Make sure your venv is activated, then run:
```bash
pip install -r requirements.txt
```

## 4. Start the Backend (Development Mode)
```bash
uvicorn server:app --reload
```
