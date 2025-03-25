# Backend Server

## Running the Server

To run the backend server (peerServer and websocket), use the following command:

```sh
npm start
```

This will start the server and you should see output indicating that the server is running.

## Building with the dockerfile

```bash
# Building the image locally
docker build -t websocket-server .

# Running the container with a name
docker run -p 8080:8080 --name websocket-server-container websocket-server

# Stoping the container
docker stop websocket-server-container

docker run websocket-server-container

# (Optional) Remove Docker images
docker rmi websocket-server:latest
```

### Kubernetes Usage

```bash
minikube start
# Build websocket-server image
docker build -t websocket-server:latest .

# minikube image load file-server
minikube image load websocket-server:latest 

# Deploy the service
kubectl apply -f websocket-server-deployment.yaml

# Check deployments
kubectl get deployments

# Check pods
kubectl get pods

# Check services
kubectl get services

minikube ip

# Exposing service on localhost: ports may also change, not working
# minikube tunnel

# Tryout this for computers to access on the same network: 
kubectl port-forward svc/websocket-server-service 8080:8080 --address=0.0.0.0

# If need to redeploy yaml file, and for clean up
kubectl delete -f websocket-server-deployment.yaml

minikube stop
```