# Mix and Share

## The origin of the project:
**Mix and Share** was developped while the hackathon **Space Office** at **Microsoft innovation center**.
the concept was proposed by some students from the UCL Mons that we worked with.

## The concept:
**Mix and Share** is a web-app that allow users to organise their party with friends and know which cocktail they can di with their alcohol bottle.

## Features:
* User take **one photo** of all his alcohol bottle and the app automatically detech the brand and de type of alcohol for each bottle. All the bottle are added to the event's collection.
* **Depending on the kind of alcohol available** in the event's collection, the app will list **all the cocktail that are possible to make**. It will also explain how to do them, what are the requirements,...
* Every month, a **cocktail of the month** will be proposed.

## Stack:
* NodeJS
* **.Ejs** format for front
* RethinkDB
* Custom Vision API *(for the object recognition -> deeplearning)*

## Make it run:
In order to make it run, you will need to set-up the database. For the Database we use RethinkDB that is tricky to install.
That's why we made a Docker container that install everything for you. To run it you will need docker.
When Docker is installed, simply run these commands in you terminal:
```bash
docker pull graphtylove/rethinkdb:latest
docker run -it graphtylove/rethinkdb:latest
```
The Database will be installed and will run on port `28015`.

# Team:
* [Maxim Berge](https://www.linkedin.com/in/maxim-berge-94b486179/) **(PM & Intégraption and training Custom Vision & front-end)**
* [Niky Denis](https://www.linkedin.com/in/nikitadenis/)  **(Back-end & DB)**
* [Oliver Vandevelde](https://www.linkedin.com/in/vandevelde-oliver/) **(Front-end)**
* [Matthieu Meurant](https://www.linkedin.com/in/matthieu-meurant-112778178/) **(Front-end)**
* Perry-Keanou Nowak
