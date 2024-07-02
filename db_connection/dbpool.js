const { Pool } = require('pg');
require('dotenv').config()
const pool = new Pool({

  
    user: process.env.DB_USER_OLD,
    password: process.env.DB_PASSWORD_OLD,
    host: process.env.DB_HOST_OLD,
    port: process.env.DB_PORT_OLD,
    database: process.env.DB_DATABASE_OLD ,
    ssl:true,
  });


  exports.pool = pool;