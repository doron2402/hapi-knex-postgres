# hapi-knex-postgres
Hapi.js plugin using Knex supporting for postgres

## Install
  `npm i hapi-knex-postgres`

## Why 
  - I'm using hapi
  - I want to use knex
  - I want to use pooling

## Dependcies
  - postgres
  - (knex)[http://knexjs.org/]
  - (generic-pool)[https://github.com/coopernurse/node-pool]

## Use
  - Register plugin
  ```javascript
    const plugin = {
      register: require('hapi-knex-postgres'),
      options: {
        connection: 'postgres://username:password@localhost/database' or knex connection object,
        attach: 'onPreHandler', // By default will be attach to onPreHandler
        detach: 'tail', // by default, will close the pool connection when request end
        searchPath: 'public', you can overwrite it
        pool: { // checkout generic-pool  },
        debug: boolean, //default false
        acquireConnectionTimeout: 10000
      }
    };

    server.register(plugin, (err) => {
      if (err) {
        console.error('Failed loading "hapi-knex-postgres" plugin');
      }
    });
  ```
  - Manifest
    ```javascript
    "plugins": {
      "hapi-knex-postgres": {
        "connection": {
          host : '127.0.0.1',
          user : 'your_database_user',
          password : 'your_database_password',
          database : 'myapp_test'
        },
        attach: 'onPreHandler',
        detach: 'tail',
        debug: false
      }
    }
    ```

## Contribute
  - feel free to ping me via email or twitter
