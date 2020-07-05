FROM ubuntu

# --- Install depencies ---
RUN apt update && apt install -y curl wget gnupg2
# Fix some issues with the source command
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# --- Install RethinkDB ---
RUN source /etc/lsb-release && echo "deb https://download.rethinkdb.com/repository/ubuntu-$DISTRIB_CODENAME $DISTRIB_CODENAME main" | tee /etc/apt/sources.list.d/rethinkdb.list
RUN wget -qO- https://download.rethinkdb.com/repository/raw/pubkey.gpg | apt-key add -
RUN apt-get update -y
RUN apt-get install -y rethinkdb

# --- Run RethinkDB ---
CMD rethinkdb --bind all