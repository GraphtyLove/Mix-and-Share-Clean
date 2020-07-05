# RethinkDB image

## Explaination
RethinkDB doesn't work on Debian < 8.x.
To fix that I made an docker image with Ubuntu and RethinkDB installed.
You can build the image from the `Dockerfile` or pull it from my DockerHub.

## How to make it work?
### From the Dockerfile
```bash
docker build -t rethinkdb:latest .
docker run -it rethinkdb:latest
```

### From my DockerHub
```bash
docker pull graphtylove/rethinkdb:latest
docker run -it graphtylove/rethinkdb:latest
```