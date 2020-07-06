# RethinkDB image

## Explaination
RethinkDB doesn't work on Debian < 8.x.
To fix that I made an docker image with Ubuntu and RethinkDB installed.
You can build the image from the `Dockerfile` or pull it from my DockerHub.

## How to make it work?

### From our script
We made a simple script to pull the image, run it and expose the DB on your localhost *(`127.0.0.1`)*.
The Client will be exposed on port `3000` and the admin web interface on port `3002`. 

```bash
sh scripts/run_rethink_db.sh
```

### From the Dockerfile
```bash
docker build -t rethinkdb:latest .
docker run -p 3000:9090 -p 3002:28015 -it graphtylove/rethinkdb:latest
```

### From my DockerHub
```bash
docker pull graphtylove/rethinkdb:latest
docker run -p 3000:9090 -p 3002:28015 -it graphtylove/rethinkdb:latest
```

### WARNING 
**By default, the admin web inerface will be exposed on port `3002`. That mean if you run it
on a server, ANYONE WILL BE ABLE TO ACCES AND CHANGE YOUR DB.**

To secure your database, please configure it in a way that only a defined IP adress can acces the admin pannel
and can query you DB!