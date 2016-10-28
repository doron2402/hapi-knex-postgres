'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Hoek = require('hoek')
const Proxyquire = require('proxyquire')
let tmp = null
const stub = {
  knex: function (constructorObj) {
    tmp = constructorObj
  }
}
const Plugin = Proxyquire('../', {
  'knex': stub.knex
})

const lab = exports.lab = Lab.script()
let request
let server

const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const experiment = lab.experiment
const describe = lab.describe
const it = lab.it
const expect = Code.expect

beforeEach((done) => {
  server = new Hapi.Server()
  server.connection({ port: 0 })
  server.route({
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
      reply('success')
    }
  })

  request = {
    method: 'GET',
    url: '/'
  }

  done()
})
afterEach((done) => {
  tmp = null
  done()
})

experiment('hapi-knex-postgres Plugin', () => {
  lab.test('it registers the plugin', (done) => {
    expect(() => {
      server.register(Plugin, Hoek.ignore).to.throw('my error message')
    })
    done()
  })
  describe('Connection', () => {
    describe('When connection is a string', () => {
      it('Should connect to postgres', (done) => {
        const connestionString = 'postgres://user:pass@localhost:1234/hapi-knex-postgres'
        const pluginWithConfig = {
          register: Plugin,
          options: {
            connection: connestionString
          }
        }
        server.register(pluginWithConfig, (err) => {
          expect(err).to.not.exist()
          server.inject(request, (response) => {
            expect(response.statusCode).to.equal(200)
            expect(tmp.connection).to.equal(connestionString)
            expect(tmp.client).to.equal('pg')
            done()
          })
        })
      })
    })
    describe('When connection is an object', () => {
      it('Should connect to postgres', (done) => {
        const pluginWithConfig = {
          register: Plugin,
          options: {
            connection: {
              host: '127.0.0.1',
              user: 'your_database_user',
              password: 'your_database_password',
              database: 'myapp_test',
              port: 1234
            },
            acquireConnectionTimeout: 2000
          }
        }
        server.register(pluginWithConfig, (err) => {
          expect(err).to.not.exist()
          server.inject(request, (response) => {
            expect(response.statusCode).to.equal(200)
            expect(tmp.connection).to.be.an.object
            expect(tmp.connection).to.include(['host', 'user', 'password', 'database', 'port'])
            expect(tmp.client).to.equal('pg')
            expect(tmp.debug).to.be.false
            expect(tmp.acquireConnectionTimeout).to.be.equal(2000)
            done()
          })
        })
      })
    })
  })
})
