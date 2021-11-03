import express from 'express'
import { v4 as uuid } from 'uuid';

const app = express()

function logRequest(req, res, next) {
    console.log(`Request to ${req.url} and method is ${req.method}`)
    console.log(activeSessions)
    next()
}

const activeSessions = [
    // {session: "dad23ad3ad3a3d", user: "john@doe.com"},
    // {session: "cawd3asd3ac3af", user: "jane@doe.com"}
]

const users = {
    "john@doe.com": {
        password: "somepw",
        name: "John Doe"
    },
    "jane@doe.com": {
        password: "somepw1x2c3v4",
        name: "Jane Doe"
    }
}

function checkPassword (accountName, password) {
    if (!users[accountName]) {
        return false
    }
    return users[accountName].password === password
}

function getUser(session) {
    const foundSession = activeSessions.find(s => s.session === session)
    if (!foundSession) {
        return
    }
    return foundSession.user
}

function checkSession(req, res, next) {
    if (req.query.session) {
        const user = getUser(req.query.session)
        if (!user) {
            res.status(400).send({error: "Unknown user"})
            return
        }
        req.user = user
        next()
    } else {
        res.status(400).send({error: "User not authenticated"})
    }
}

app.use(logRequest)
app.use("/private", checkSession)
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello esteemed " + (req.user || "Unknown"))
})

app.get("/private/greeting", (req, res) => {
    res.send("Hello esteemed user " + req.user)
})

app.post("/login", (req, res) => {
    if (checkPassword(req.body.accountName, req.body.password)) {
        const sessionId = uuid()
        activeSessions.push(
            {session: sessionId, user: req.body.accountName}
        )
        return res.status(200).send({sessionId})
    } else {
        res.status(400).send({error: "Wrong username or password"})
    }
})

app.listen(5000, ()=>{console.log("App listening on 5000")})