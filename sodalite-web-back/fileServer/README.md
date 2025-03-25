# File Server

## Running the Server

To run the file server, use the following command:

```sh
node .\server.js
```

This will start the server and you should see output indicating that the server is running.


## Docker container

```bash
docker build -t file-server .

# need to adjust the paths
docker run -p 8081:8081 -v $(pwd)/uploads:/usr/src/app/uploads --name file-server-container-local file-server

docker stop file-server-container-local

# if you would like to have the files hidden inside the container
docker run -p 8081:8081 --name file-server-container file-server

```
The uploads directory is created inside the container during the build process to ensure it exists.

If you want to persist uploaded files outside the container, you can mount a volume to the uploads directory. For example:
