const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: "memos_pinturas",
});

connection.connect((err) => {
  if (err) {
    console.log(`Error in database ${err}`);
    return;
  }
  console.log("connection to database was successful");
});

module.exports = connection;
