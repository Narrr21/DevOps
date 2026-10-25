# DevOps Learning App

This project is intentionally small so the first DevOps lessons can focus on Docker.

## Project structure

- `repo-app`: Node.js application and its `Dockerfile`
- `repo-infra`: Kubernetes and other infrastructure configuration

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

## Run with Kubernetes and kind

Prerequisites:

- Docker Desktop
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)

Create a local Kubernetes cluster:

```powershell
kind create cluster --name devops-learning
```

Build the application image from the repository root:

```powershell
cd ..\repo-app
docker build -t devops-learning-app:local .
```

Load the image into kind:

```powershell
kind load docker-image devops-learning-app:local --name devops-learning
```

Apply the Kubernetes resources:

```powershell
cd ..\repo-infra
kubectl apply -f .\kubernetes\app.yaml
```

Wait for both application replicas:

```powershell
kubectl -n devops-learning rollout status deployment/devops-learning-app
kubectl -n devops-learning get pods
```

Open the app through a local port-forward:

```powershell
kubectl -n devops-learning port-forward service/devops-learning-app 3000:80
```

Then visit <http://localhost:3000> and <http://localhost:3000/health>.

Useful commands:

```powershell
kubectl -n devops-learning get all
kubectl -n devops-learning logs deployment/devops-learning-app
kubectl -n devops-learning describe pod <pod-name>
```

Clean up the Kubernetes resources and cluster:

```powershell
kubectl delete namespace devops-learning
kind delete cluster --name devops-learning
```

## Run without Docker

If Node.js 22 or newer is installed:

```powershell
cd ..\repo-app
npm start
```
