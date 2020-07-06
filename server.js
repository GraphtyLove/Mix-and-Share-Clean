/***************************************************************
**                      EXPRESS SERVER                        **
**                  Server Mix and Share                      **
***************************************************************/

/*****************************************************
**                  CONFIG GLOBAL                   **
*****************************************************/

// ---------- IMPORT ----------
let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')
let multer = require("multer")
let path = require("path")
const app = express()

// ---------- ROUTS CONFIG ----------
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extend: true
}))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')
app.use(
    session({
        secret: 'ihihn9893jdqz1h,JD!&ék',
        resave: false,
        saveUninitialized: true,
    })
)

// ---------- MULTER CONFIG ----------
// ----- Multer is a package that I use to upload images in the server for Custom Vision API-----
let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/img")
    },
    // Format the name of the file
    filename: function (req, file, callback) {
        callback(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})
multerHandler = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024,
        fieldSize: 500 * 1024 * 1024
    }
})

// ---------- DATABASE connect ----------
r = require('rethinkdb')
let connection = null
r.connect(
    {
        host: "127.0.0.1",
        port: 3002
    },
    (err, conn) => {
        if (err) throw err
        connection = conn
        console.log("Database connected")
    }
)


/**********************************************************
**                 ROUTING                               **
** ------------------------------------------------      **
**  1. Log In page (index.ejs) ✅                        **
**      2. Register (register.ejs) ✅                    **
**      3. Password Forgot (forgotPassword.ejs) ❌       **
**  4. Home (home.ejs) ✅                                **
**      5. Log Out (?) ✅                                **
**      6. Profile (profile.ejs) ✅                        **
**      7. Cocktail (cocktails.ejs) ✅                   **
**      8. Events (event.ejs)   ❌                       **
**          9. Create event (createevent.ejs) ❌         **
**          10. Event x (soiree.ejs) ❌                  **
**          11. Add bottel (upload.ejs) ❌               **
**      12. Cocktail of the month (infoCocktail.ejs) ✅  **
**********************************************************/

// ---------- 1. Log In page (index.ejs) ✅  ----------
app.get('/', (req, res) => {
    if (req.session.connected) {
        res.redirect('/home')
        return
    }
    res.render('index.ejs')
})

// ---------- 2. Register (register.ejs) ✅ ----------
// Fuction to verify if email is in correct format
const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

// Page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})
// Request
app.post('/register', (req, res) => {
    let lastname = req.body.lastname
    let firstname = req.body.firstname
    let login = req.body.login
    let password = req.body.password
    let password2 = req.body.password2

    if (lastname.length > 2 && firstname.length > 2 && validateEmail(login) && password === password2) {
        // Request DB:
        r
            .db('MixAndShare')
            .table('users')
            .filter({ "login": login })
            .run(connection, (err, cursor) => {
                if (err){
                    console.log("Internal server error during register. Is users table exist?")
                    res.redirect('/')
                }
                cursor.next( (err, user) => {
                    if (err) {
                        r
                            .db('MixAndShare')
                            .table('users')
                            .insert({
                                lastname,
                                firstname,
                                login,
                                password,
                            })
                            .run(connection)
                        res.redirect('/')
                        console.log(`User Registration success! name: ${firstname}, mail: ${login}`)
                    } else {
                        res.render({ message: "mail existant" })
                        res.redirect('/register')
                    }
                })
            })
    }
    else {
        res.redirect('/register')
        console.log('User registration failed')
        return
    }
})

// ---------- 3. Password Forgot (forgotPassword.ejs) ❌ ----------
// TODO: Create forgotPassword.ejs + implement the logic.
app.get('/forgotPassword', (req, res) => {
    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    res.render('forgotPassword.ejs')
})


// ---------- Log Out ✅ ----------
app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/')
    })
})

// ---------- 4. Home (home.ejs) [while connected] ✅   ----------
app.get('/home', (req, res) => {
    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    res.render('home.ejs', {
        user: req.session.user
    })
})

// ---------- 5. Log IN ✅ ----------
app.post('/', (req, res) => {
    let login = req.body.login
    let password = req.body.password
    r
        .db('MixAndShare')
        .table('users')
        .filter({"login": login})
        .run(connection, (err, cursor) => {
            if (err) {
                console.log("SERVER ERROR: ", err)
                res.redirect('/')
            }
            cursor.next( (err, user) => {
                if (err) {
                    console.log("User not found...")
                    res.redirect('/')
                }else if (!user) {
                    console.log("user empty!")
                } else if (!password) {
                    console.log("password empty!")
                    res.redirect('/')
                } else if (password === user.password) {
                    console.log("Connected!")
                    req.session.connected = true
                    req.session.user = user
                    res.redirect('/home')
                } else {
                    console.log("Password doesn't match with user...")
                    res.redirect('/')
                }
            })
            cursor.close()
        })
})

// ---------- 6. Profile (profile.ejs) ✅  ----------
app.get('/profile', (req, res) => {
    if (!req.session.connected) {
        res.redirect('/')
        // TODO: Check if it's really needed
        return
    }

    res.render('profile.ejs', {
        user: req.session.user
    })
})

// ---------- 7. Cocktail (cocktails.ejs) ✅ ----------
app.get('/cocktail', (req, res) => {
    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    r
        .db('MixAndShare')
        .table('list_cocktails')
        .run(connection, (err, cursor) => {
        if (err) {
            console.log("list_cocktails table doesn't exist or server error.")
            res.redirect('/home')
        } else {
            cursor.toArray( (err, liste) => {
                let data = {}

                if (err) {
                    data.liste = []
                    console.log("Cocktail list empty!")
                } else {
                    data.liste = liste
                }
                res.render('cocktail.ejs', data)
            })
        }
    })
})

// ---------- 8. Events (event.ejs) ❌ ----------
app.get('/event', (req, res) => {
    // TODO: To remove, prevent server to crash because the route is buggy.
    res.redirect('/')
    return

    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    r.
        db('Event').table('event_info').run(connection, (err, cursor) => {
            cursor.toArray(function (err, events) {
                let data = {}
                if (err) {
                    data.events = []
                } else {
                    data.events = events
                }
                res.render('event.ejs', data)
            })
        })
})

// ---------- 9. Create event (createevent.ejs) ❌ ----------
app.get('/createevent', (req, res) => {
    // TODO: To remove, prevent server to crash because the route is buggy.
    res.redirect('/')
    return

    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    r
        .db('Event').table('event_info').limit(1).run(connection, (err, cursor) => {
            cursor.next(function (err, event) {
                let data = {}
                if (err) {
                    data.event = null
                } else {
                    data.event = event
                }
                res.render('createevent.ejs', data)
            })
        })
    app.post('/createevent', (req, res) => {
        let name_event = req.body.name_event
        let adresse = req.body.adresse
        let date_event = req.body.date_event
        // Request DB:
        r
            .db('Event')
            .table('event_info')
            .getAll(name_event, {
                index: 'name_event'
            })
            .run(connection, (err, cursor) => {
                cursor.next(function (err, event) {
                    if (err) {
                        r
                            .db('Event')
                            .table('event_info')
                            .insert({
                                name_event,
                                adresse,
                                date_event
                            })
                            .run(connection)
                        res.redirect('/event')
                    } else {
                        res.redirect('/createevent')
                    }
                })
            })
    })
})

// ---------- 10. Event x (soiree.ejs) ❌ ----------
app.get('/soiree', (req, res) => {
    // TODO: To remove, prevent server to crash because the route is buggy.
    res.redirect('/')
    return

    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    r.db('Event').table('event_info').limit(1).run(connection, (err, cursor) => {
        cursor.next(function (err, event) {
            let data = {}
            if (err) {
                data.event = null
            } else {
                data.event = event
            }
            res.render('event.ejs', data)
        })
    })
    app.post('/soiree', (req, res) => {
        let bottle_name = req.body.bottle_name
        let bottle_number = req.body.bottle_number
        // Request DB:
        r
            .db('Event')
            .table('bottle')
            .getAll(bottle_name, {
                index: 'bottle_name'
            })
            .run(connection, (err, cursor) => {
                cursor.next(function (err, event) {
                    if (err) {
                        r
                            .db('Event')
                            .table('event_info')
                            .insert({
                                bottle_name,
                                bottle_number,
                            })
                            .run(connection)
                        res.redirect('/soiree')
                    } else {
                        res.redirect('/ soiree')
                    }
                })
            })
    })
})

// ---------- 11. Add bottles (upload.ejs) ❌ ----------
app.get("/upload", (req, res) => {
    // TODO: To remove, prevent server to crash because the route is buggy.
    res.redirect('/')
    return

    if (!req.session.connected) {
        res.redirect("/")
        return
    }
    res.render("upload.ejs")
})
// --- Set where and how images are upload in the server ❌ ---
app.post("/upload", (req, res) => {
    // TODO: To remove, prevent server to crash because the route is buggy.
    res.redirect('/')
    return

    let fs = require("fs-extra")
    multerHandler.fields([
        { name: "picture", maxCount: 1 }
    ])(req, res, function (r) {
        let file = req.files.picture[0]
        let path = file.path.replace("public/", "")
        res.send(JSON.stringify({ url: "http://127.0.0.1:1200/" + path }))
    })
})

// ---------- 12. Cocktail of the month (infoCocktail.ejs) ✅ ----------
app.get('/infoCocktail', (req, res) => {
    if (!req.session.connected) {
        res.redirect('/')
        return
    }
    r
        .db('MixAndShare')
        .table('list_cocktails')
        .limit(1)
        .run(connection, (err, cursor) => {
            if (err) {
                console.log("table list_cocktails doesn't exist or server error.")
                res.redirect('/home')
            } else {
                cursor.next(function (err, list) {
                    let data = {}
                    if (err) {
                        data.list = null
                    } else {
                        data.list = list
                    }
                    res.render('infoCocktail.ejs', data)
                })
            }
        })
})


/*****************************************************
**             WEBSITE PORT LISTENING               **
*****************************************************/
const PORT=1200
console.log('Server running on port: ', PORT)
app.listen(PORT)
