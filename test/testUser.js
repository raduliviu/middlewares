import assert from 'assert'
import {  getUser, checkPassword, addSession } from '../app/controllers/user.js'

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
    describe('Check addSession', function() {
        it('should create a new session for a user', function() {
            let sessionId = addSession('test@test.com')
            let userName = getUser(sessionId)
            assert.equal(userName, 'test@test.com')
        })
        it('test that existing session is reused', function() {
            let firstSessionId = addSession('test@test.com')
            let secondSessionId = addSession('test@test.com')
            assert.equal(firstSessionId, secondSessionId)
        })
    })
})