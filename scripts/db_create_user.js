r = require('rethinkdb');
let connection = null;

const connectToDb = () => {
    r.connect(
        {
            // Change for your DB host here
            host: "51.210.8.134",
            // Change for you DB client port here
            port: 3002
        },
        (err, conn) => {
            if (err) throw err;
            connection = conn;
            console.log("Database connected");
        }
    ).then( () => insertUser() )
    
}

const insertUser = () => {
    const email = "test@test.com"
    const fistName = "Maxim"
    const lastName = "Test"
    const password = "test"
    r
        .db('MixAndShare')
        .table('users')
        .insert({
            "login": email,
            "firstname": fistName,
            "lastname": lastName,
            "password": password
        }).run(connection)
    console.log('user added.')
    console.log("Mail: ", email)
    console.log("FirstName: ", fistName)
    console.log("LasttName: ", lastName)
    console.log("Password: ", password)
}


const startScript = () => {
    connectToDb()
    setTimeout(insertUser, 5000)
}


startScript()
