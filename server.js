const mysql = require("mysql");
const questions = require("./questions");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});
connection.connect(function (err) {
  if (err) throw err;
  questions()
});
module.exports = connection