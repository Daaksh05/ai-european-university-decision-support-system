---
description: How to run the EuroPath AI project
---

To run the complete application, you need to start both the backend and frontend servers in separate terminal windows.

### 1. Start the Backend Server
Open a terminal and navigate to the project folder, then run:

```bash
cd backend
source venv/bin/activate
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
> [!NOTE]
> Ensure port 8000 is free. If you get an "Address already in use" error, you can find the process with `lsof -i :8000` and kill it with `kill -9 <PID>`.

### 2. Start the Frontend Server
Open a **second** terminal window and navigate to the project folder, then run:

```bash
cd frontend
npm start
```

### 3. Verification
- The backend should be running at: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- The frontend should open automatically at: [http://localhost:3000](http://localhost:3000)
- You can now Log In or Register using the new Authentication system.
