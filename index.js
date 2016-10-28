'use strict'
const Knex = require('knex')
const Hoek = require('hoek')

let postgres
const DEFAULTS = {
  connection: undefined,
  attach: 'onPreHandler',
  detach: 'tail',
  searchPath: 'public',
  pool: {
    destroy: client => client.end(),
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    log: true
  },
  debug: false,
  acquireConnectionTimeout: 10000
}

exports.register = function (server, options, next) {
  const config = Hoek.applyToDefaults(DEFAULTS, options)
  const { connection, pool, searchPath, acquireConnectionTimeout, debug } = config
  Hoek.assert(connection !== undefined, new Error('connection is undefined'))
  postgres = Knex({
    client: 'pg',
    connection,
    pool,
    searchPath,
    acquireConnectionTimeout,
    debug
  })

  server.ext(config.attach, (request, reply) => {
    request.pg = postgres
    reply.continue()
  })

  server.on(config.detach, (request, err) => {
    if (request.pg) {
      request.pg.destroy()
    }
  })

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
