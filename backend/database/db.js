const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
});

pool.getConnection()
    .then(connection => {
        console.log("Database connected successfully!");
        connection.release(); 
    })
    .catch(error => {
        console.error("Error connecting to database:", error.message);
    });

module.exports = pool;



