# DevOps Learning App

This project is intentionally small so the first DevOps lessons can focus on Docker.

## Project structure

- `repo-app`: Node.js application and its `Dockerfile`
- `repo-infra`: Docker Compose configuration

## Run with Docker Compose

From the `repo-infra` directory:

```powershell
docker compose up --build
```

Open <http://localhost:3000> in a browser.

The health endpoint is available at <http://localhost:3000/health>.

To stop the app:

```powershell
docker compose down
```

## Run without Docker

If Node.js 22 or newer is installed:

```powershell
cd ..\repo-app
npm start
```
