import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const jwtKey = "2dadafac3adaa2dasda3dadadad3adasdasd3gr4v54gsgs"

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

export function getUserFromToken(token) {
    try {
        let data = jwt.verify(
            token,
            jwtKey
        )
        return data.account || false
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export function checkPassword(accountName, password) {
    if (!users[accountName]) {
        return false
    }
    return users[accountName].password === password
}

export function createSession(user) {
    const sessionId = uuid()
    const foundUser = activeSessions.find(u => u.user === user)
    if (foundUser) {
        return foundUser.session
    } else {
        activeSessions.push({ session: sessionId, user: user })
        return sessionId
    }
}

export async function addUser(account, password) {
    const result = getUserByAccount(account)
    if (result) {
        return false
    }
    const salt = await bcrypt.genSalt(saltRounds)
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser = {
        account: account,
        passwordHash: passwordHash
    }
    users[account] = newUser
    return newUser
}

export function getUserByAccount(account) {
    return users[account]
}

export async function verifyUserPassword(account, password) {
    const user = getUserByAccount(account)
    if (!user) {
        return false
    }
    return bcrypt.compare(password, user.passwordHash)
}

export function generateSession(account) {
    const token = jwt.sign(
        { account },
        jwtKey,
        { expiresIn: '1h' }
    )
    return token
}