import { v4 as uuid } from 'uuid';

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

export function getUser(session) {
    const foundSession = activeSessions.find(s => s.session === session)
    if (!foundSession) {
        return
    }
    return foundSession.user
}

export function checkPassword (accountName, password) {
    if (!users[accountName]) {
        return false
    }
    return users[accountName].password === password
}

export function addSession(user) {
    const sessionId = uuid()
    const foundUser = activeSessions.find(u => u.user === user)
    if (foundUser) {
        return foundUser.session
    } else {
        activeSessions.push({session: sessionId, user: user})
        return sessionId
    }
}

const activeSessions = []
