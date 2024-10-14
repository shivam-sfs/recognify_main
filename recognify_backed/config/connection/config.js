require('dotenv').config(); // Ensure to load environment variables

let knex;

try {
  knex = require('knex')({
    client: process.env.DB_CLIENT, // e.g., 'mysql'
    connection: {
      host: process.env.DB_HOST,     // e.g., 'localhost'
      port: process.env.DB_PORT,     // e.g., 3306
      user: process.env.DB_USERNAME,  // e.g., 'root'
      password: process.env.DB_PASSWORD || '', // Default to empty string if no password
      database: process.env.DB_NAME   // Your database name
    },
    pool: {
      min: 2,
      max: 10,
    },
  });

  // Optional: Test the connection
  knex.raw('SELECT 1 + 1 AS result').then(() => {
    console.log('MySQL Database connected successfully');
  }).catch((error) => {
    console.error('Database connection test failed:', error);
  });
} catch (error) {
  console.error('Error connecting to the database:', error);
}

module.exports = knex;