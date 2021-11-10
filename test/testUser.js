import assert from 'assert'
import {  getUserFromToken, checkPassword, createSession, addUser, getUserByAccount, verifyUserPassword, generateSession } from '../app/controllers/user.js'

describe('Tests for ensuring user authentication works', function() {
    describe('Check password', function() {
        it('should return false for a wrong password', function() {
            let result = checkPassword('jane@doe.com', 'wrongpw')
            assert.equal(result, false)
        })
        it('should return true for a correct password', function() {
            let result = checkPassword('jane@doe.com', 'somepw1x2c3v4')
            assert.equal(result, true)
        })
        it('should return false for a correct password but wrong user', function() {
            let result = checkPassword('janet@doe.com', 'somepw1x2c3v4')
            assert.equal(result, false)
        })
    })
    // describe('Check createSession', function() {
    //     it('should create a new session for a user', function() {
    //         let sessionId = createSession('test@test.com')
    //         let userName = getUserFromToken(sessionId)
    //         assert.equal(userName, 'test@test.com')
    //     })
    //     it('test that existing session is reused', function() {
    //         let firstSessionId = createSession('test@test.com')
    //         let secondSessionId = createSession('test@test.com')
    //         assert.equal(firstSessionId, secondSessionId)
    //     })
    // })
    describe('addUser', function() {
        it('should create a new user and hash the password', async function() {
            const account = 'test@test.com'
            const password = 'test_pass'
            const result = await addUser(account, password)
            const user = getUserByAccount(account)
            assert.equal(account, user.account)
            assert.notEqual(password, user.passwordHash)
        })
        it('adding same account twice should generate an error', async function() {
            const account = 'test2@test.com'
            const password = 'test_pass'
            let result = await addUser(account, password)
            assert.notEqual(false, result)
            result = await addUser(account, password)
            assert.equal(false, result)
        })
        it('should verify user password', async function() {
            const account = 'test3@test.com'
            const password = 'test_pass'
            let result = await addUser(account, password)
            
            result = await verifyUserPassword(account, password)
            assert.equal(true, result)

            result = await verifyUserPassword(account, "wrong_pw")
            assert.equal(false, result)
        })
        it('should generate jwt token containing user account', async function() {
            const account = 'test4@test.com'
            
            let result = await generateSession(account)
            assert.equal(164, result.length)
        })
        it('should verify jwt token and return account from the session', function() {
            const account = 'test5@test.com'
            let token = generateSession(account)
            let accountInSession = getUserFromToken(token)
            assert.equal(account, accountInSession)
        })
    })
})