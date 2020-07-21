# Pull the image
docker pull graphtylove/rethinkdb:latest;
# Run the container and redirect container's ports:
# 9090 (admin panel) to localhost port 3000
# 28015 (client for request) to localhost port 3002
docker run --name "mix-and-share-db" -p 3000:9090 -p 3002:28015 -it graphtylove/rethinkdb:latest;
# Create all the db and tables needed to make the project run
echo "* ---------- RETHINK DB ---------- *"l;
echo "DB Running...";
echo "Client on port: 3002";
echo "Admin UI on  port: 3002";
echo "-------------------------------------";