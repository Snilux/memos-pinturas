const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password:process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME|| "memos_pinturas",
});

connection.connect((err) => {
  if (err) {
    console.log(`Error in database ${err}`);
    return;
  }
  console.log("connection to database was successful");
});

module.exports = connection;
