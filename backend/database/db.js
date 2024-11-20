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










// const mysql = require("mysql2");
// require("dotenv").config();

// const conn = mysql.createConnection({
//     user: process.env.DB_USERNAME,
//     host: process.env.DB_HOST,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME, 
// });

// // Test the connection
// conn.connect((err) => {
//     if (err) {
//         console.error("Database connection failed:", err.stack);
//         process.exit(1); // Exit the application if the connection fails
//     } else {
//         console.log("Connected to the database successfully!");
//     }
// });

// module.exports = conn;


