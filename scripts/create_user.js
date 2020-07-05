r = require('rethinkdb');

let connection = null;

const connectToDb = () => {
    r.connect(
        {
            host: "51.210.8.134",
            port: 3002
        },
        function (err, conn) {
            if (err) throw err;
            connection = conn;
            console.log("Database connected");
        }
    )
}

const insertUser = () => {
    r
        .db('MixAndShare')
        .table('users')
        .insert({
            "id": 1,
            "login": "maxim.berge@gmail.com",
            "firstname": "Maxim",
            "lastname": "berge",
            "password": "test"
        }).run(connection)
    console.log("user inserted.")
}



const startScript = () => {
    connectToDb()
    setTimeout(insertUser, 5000)
}

startScript()




