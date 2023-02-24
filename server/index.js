const express = require("express")
const mysql = require("mysql")
const session = require("express-session");
const cors = require("cors")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const saltRounds = 10;

const app = express();

app.use(express.json())

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(session({
    key: "userId",
    secret: "(G+KbPeSgVkYp3s6v9y$B&E)H@McQfTjWmZq4t7w!z%C*F-JaNdRgUkXp2r5u8x",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000000000000000000000000000000000
    }
}))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'todo',
    charset: 'utf8mb4'
})

// script for sign-up

app.post('/register', (req, res) => {
    const name = req.body.name
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) {
            console.log(err)
        }

        db.query(
            "INSERT INTO users (name, username, password) VALUES (?,?,?)",
            [name, username, hash],

            (err, result) => {
                console.log(err);
                if (result) {

                    db.query(
                        "SELECT * FROM users WHERE username = ?;",
                        username,
                        (err, result) => {
                            if (err) {
                                res.send({ err: err })
                            }

                            if (result.length > 0) {
                                bcrypt.compare(password, result[0].password, (error, response) => {
                                    if (response) {
                                        req.session.user = result;
                
                                        const id = result[0].id
                                        const token = jwt.sign({id}, "8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@", {
                                            expiresIn: 40000,
                                        })  // use a .env file to add the secret, same as mongo (more secure)
                
                                        req.session.user = result;
                
                                        res.json({auth: true, token: token, result: result})
                                    } else {
                                        res.json({
                                             auth: false,
                                             message: "wrong password"
                                            })
                                    }
                                })
                            } else {
                                res.json({ auth: false, message: "Failed to authenticate" })
                            }
                        }
                    )


                }
            }
        )
    }
)
})

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-tokens"]

    if (!token) {
        res.send("Not authenticated")
    } else {
        jwt.verify(token, "8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@", (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "Failed to authenticate user"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.get('/auth', verifyJWT, (req, res) => {
    res.send("Authenticated")
})

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({ loggedIn: false })
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?;",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;

                        const id = result[0].id
                        const token = jwt.sign({id}, "8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@", {
                            expiresIn: 40000,
                        })  // use a .env file to add the secret, same as mongo (more secure)

                        req.session.user = result;

                        res.json({auth: true, token: token, result: result})
                    } else {
                        res.json({
                             auth: false,
                             message: "wrong user"
                            })
                    }
                })
            } else {
                res.send("login failed")
            }
        }
    )
})

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send({ err: err })
        } else {
            res.send("logout successful")
        }
    })
})

// script for posting a new list
app.post("/list", (req, res) => {
    const title = req.body.title
    const icon = req.body.icon
    const userId = req.body.userId

    db.query(
        "INSERT INTO lists (title, icon, userId) VALUES (?,?,?)",
        [title, icon, userId],
        (err, response) => {
            if (err) {
                res.send({ err: err })
            } else {
                res.send({ response: response })
            }
        }
    )
})

app.get("/list", (req, res) => {
    const userId = req.query.userId

    db.query(
        "SELECT * FROM lists WHERE userId = ?;",
        userId,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ result: result })
            }
        }
    )

})

app.get("/test", (req, res) => {
    const id = req.query.id

    db.query(
        "SELECT * FROM lists WHERE id = ?;",
        id,
        (err, result) => {
            if (err) {
                res.send({ err: err }) 
            } else {
                res.send({ result: result })
            }
        }
    )
})

app.put("/changehead", (req, res) => {
    const id = req.body.id
    const title = req.body.title

    db.query(
        "UPDATE lists SET title = ? WHERE id = ?",
        [title, id],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            } else {
                res.send({ result: result })
            }
        }
    )
})

app.post("/newitem", (req, res) => {
    const task = req.body.task
    const completed = req.body.completed
    const owner_id = req.body.owner_id

    db.query(
        "INSERT INTO lists_items (task, completed, owner_id) VALUES (?,?,?)",
        [task, completed, owner_id],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            } else {
                res.send({ result: result })
            }
        }
    )
})

app.get("/getitem", (req, res) => {
    const owner_id = req.query.owner_id

        db.query(
            "SELECT * FROM lists_items WHERE owner_id = ?;",
            owner_id,
            (err, result) => {
                if (err) {
                    res.send({ err: err })
                } else {
                    res.send({ result: result })
                }
            }
        )
    }
)

app.put('/updateitem', (req, res) => {
    const completed = req.body.completed
    const id = req.body.id

    db.query(
        "UPDATE lists_items SET completed = ? WHERE id_items = ?",
        [completed, id],
        (err) => {
            if (err) {
                res.send({ err: err })
            }
        }
    )

})

app.delete('/deletelist', (req, res) => {
    const id = req.query.id

    db.query(
        "DELETE FROM lists WHERE id = ?",
        id,
        (err, response) => {
            if (err) {
                res.send({ err: err })
            } else {
                res.send({ response: response })
            }
        }
    )
})

app.listen(3002, () => {
    console.log("Server running")
})