/***************************************************************
**                  EXPRESS (Serveur web)                     **
**                  Server Mix and Share                      **
***************************************************************/

/*****************************************************
**                  CONFIG GLOBAL                   **
*****************************************************/

// ---------- IMPORT ----------
let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let multer = require("multer");
let path = require("path");
const app = express();

// ---------- ROUTS CONFIG ----------
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extend: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(
    session({
        secret: 'ihihn9893jdqz1h,JD!&ék',
        resave: false,
        saveUninitialized: true,
    })
);

// ---------- MULTER CONFIG ----------
// ----- Multer is a package that I use to upload images in the server for Custom Vision API-----
let storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./public/img");
    },
    // Format the name of the file
	filename: function(req, file, callback) {
		callback(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	}
});
multerHandler = multer({
	storage: storage,
	limits: {
		fileSize: 15 * 1024 * 1024,
		fieldSize: 500 * 1024 * 1024
	}
});

// ---------- DATABASE connect ----------
r = require('rethinkdb');
let connection = null;
r.connect(
	{
		host: "54.37.157.250",
		port: 28015
	},
	function(err, conn) {
		if (err) throw err;
		connection = conn;
		console.log("Database connected");
	}
);


/*****************************************************
**                 ROUTING                          **
** ------------------------------------------------ **
**  1. Log In page (index.ejs)                      **
**      2. Register (register.ejs)                  **
**      3. Password Forgot (mailchanger.ejs)        **
**  4. Home (home.ejs)                              **
**      5. Log Out (?)                              **
**      6. Profile (profil.ejs)                     **
**      7. Cocktail (cocktails.ejs)                 **
**      8. Events (event.ejs)                       **
**          9. Create event (createevent.ejs)       **
**          10. Event x (soiree.ejs)                **
**          11. Add bottel (upload.ejs)             **
**      12. Cocktail of the month (infoAlcool.ejs)  **
*****************************************************/

// ---------- 1. Log In page (index.ejs)  ----------
app.get('/', function (req, res) {
    if (req.session.connected) {
        res.redirect('/home');
        return;
    }
    res.render('index.ejs');
});

// ---------- 2. Register (register.ejs) ----------

// Fuction to verify if email is in correct format
function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

// Route
app.get('/register', function (req, res) {
    res.render('register.ejs');
});
app.post('/register', function (req, res) {
    let name = req.body.name;
    let firstname = req.body.firstname;
    let login = req.body.login;
    let password = req.body.password;
    let password2 = req.body.password2;

    if(name.length > 2 && firstname.length > 2 && validateEmail(login) && password === password2){
        // Request DB:
        r
        .db('MixAndShare')
        .table('users')
        .getAll(login, {
            index: 'login'
        }).run(connection, function (err, cursor) {
            cursor.next(function (err, user) {
                if (err) {
                    r
                    .db('MixAndShare')
                    .table('users')
                    .insert({
                        name,
                        firstname,
                        login,
                        password,
                        password2
                    })
                    .run(connection);
                    res.redirect('/');
                    console.log(`User Registration succes! name: ${firstname}, mail: ${login}`);
                } else {
                res.render({message :"mail existant"});
                res.redirect('/register');
                }
            });
        });
    }
    else{
        res.redirect('/register');
        console.log('User registration failed');
        return;
    }
});

// ---------- 3. Password Forgot (mailchanger.ejs) ----------
app.get('/mailchanger', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    res.render('mailchanger.ejs');
});


// ---------- Log Out ----------
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// ---------- 4. Home (home.ejs) [while connected]   ----------
app.get('/home', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    res.render('home.ejs', {
        user: req.session.user
    });
});

// ---------- 5. Log Out (?) ----------
app.post('/', function (req, res) {
    let login = req.body.login;
    let password = req.body.password;
    r
    .db('MixAndShare')
    .table('users')
    .getAll(login, {
        index: 'login'
    }).run(connection, function (err, cursor) {
        cursor.next(function (err, user) {
            if (err) {
                res.redirect('/');
            } else {
                if (user.password == password) {
                    req.session.connected = true;
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    res.redirect('/');
                }
            }
        });
    });
});

// ---------- 6. Profile (profil.ejs)  ----------
app.get('/profil', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    res.render('profil.ejs', {
        user: req.session.user
    });
});

// ---------- 7. Cocktail (cocktails.ejs) ----------
app.get('/cocktail', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
r.db('MixAndShare').table('liste_cocktails').run(connection, function (err, cursor) {
    cursor.toArray(function (err, liste) {
        let data = {};
        
        if (err) {
            data.liste = [];
        } else {
            data.liste = liste;
        }
        
        res.render('cocktail.ejs', data);
    });
    });
});

// ---------- 8. Events (event.ejs) ----------
app.get('/event', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    r.
    db('Event').table('event_info').run(connection, function (err, cursor) {
        cursor.toArray(function (err, events) {
            let data = {};
            if (err) {
                data.events = [];
            } else {
                data.events = events;
            }
            res.render('event.ejs', data);
        });
    });
});

// ---------- 9. Create event (createevent.ejs) ----------
app.get('/createevent', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    r
    .db('Event').table('event_info').limit(1).run(connection, function (err, cursor) {
        cursor.next(function (err, event) {
            let data = {};
            if (err) {
                data.event = null;
            } else {
                data.event = event;
            }
        res.render('createevent.ejs', data);
        });
    });
    app.post('/createevent', function (req, res) {
        let name_event = req.body.name_event;
        let adresse = req.body.adresse;
        let date_event = req.body.date_event;
        // Request DB:
        r
        .db('Event')
        .table('event_info')
        .getAll(name_event, {
            index: 'name_event'
        })
        .run(connection, function (err, cursor) {
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
                        .run(connection);
                    res.redirect('/event');
                } else {
                    res.redirect('/createevent');
                }
            });
        });
    });
});

// ---------- 10. Event x (soiree.ejs) ----------
app.get('/soiree', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    r.db('Event').table('event_info').limit(1).run(connection, function (err, cursor) {
        cursor.next(function (err, event) {
            let data = {};
            if (err) {
                data.event = null;
            } else {
                data.event = event;
            }
            res.render('event.ejs', data);
        });
    });
    app.post('/soiree', function (req, res) {
        let bottle_name = req.body.bottle_name;
        let bottle_number = req.body.bottle_number;
        // Request DB:
        r
        .db('Event')
        .table('bottle')
        .getAll(bottle_name, {
            index: 'bottle_name'
        })
        .run(connection, function (err, cursor) {
            cursor.next(function (err, event) {
                if (err) {
                    r
                    .db('Event')
                    .table('event_info')
                    .insert({
                        bottle_name,
                        bottle_number,
                    })
                        .run(connection);
                    res.redirect('/soiree');
                } else {
                    res.redirect('/ soiree');
                }
            });
        });
    });
});

// ---------- 11. Add bottles (upload.ejs) ----------
app.get("/upload", function(req, res) {
	if (!req.session.connected) {
		res.redirect("/");
		return;
	}
	res.render("upload.ejs");
});
// --- Set where and how images are upload in the server ---
app.post("/upload", function(req, res) {
	let fs = require("fs-extra");
	multerHandler.fields([
		{ name: "picture", maxCount: 1 }
	])(req, res, function(r) {
		let file = req.files.picture[0];
		let path = file.path.replace("public/", "");
		res.send(JSON.stringify({ url: "http://54.37.157.250:80/" + path }));
	});
});

// ---------- 12. Cocktail of the month (infoAlcool.ejs) ----------
app.get('/infoAlcool', function (req, res) {
    if (!req.session.connected) {
        res.redirect('/');
        return;
    }
    r
    .db('MixAndShare').table('liste_cocktails').limit(1).run(connection, function (err, cursor) {
        cursor.next(function (err, liste) {
            let data = {};
                if (err) {
                    data.liste = null;
                } else {
                    data.liste = liste;
                }
            res.render('infoAlcool.ejs', data);
        });
    });
});


/*****************************************************
**             WEBSITE PORT LISTENING               **
*****************************************************/

app.listen(80);

let Nikita = class Nikita{
    constructor(trainingStage){
        this.trainingStage = trainingStage;
    }

    if(trainingStage < 7){
        stage = " in training";
        status = "Learner";
    } else if (trainingStage > 7){
        stage = "in internship";
        status = "trainee";
    }
};

let nikita = new Nikita(5)

