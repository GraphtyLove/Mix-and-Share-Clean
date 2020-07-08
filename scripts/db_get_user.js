
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

const getUser = () => {
    r
        .db('MixAndShare')
        .table('users')
        .filter({
            "login": "maxim.berge@gmail.com"
        })
        .run(connection, function(err, cursor) {
            cursor.next(function (err, result) {
                console.log('res: ', result)
            })
        })
    console.log("user inserted.")
}



const startScript = () => {
    connectToDb()
    setTimeout(getUser, 5000)
}

startScript()




