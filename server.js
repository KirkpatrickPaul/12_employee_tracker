const mysql = require("mysql");
const inquirer = require("inquirer");
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
  //where to put my starting function
});
inquirer.prompt(questions.whatDo).then(function (answers) {
  if (answers.whatDo === "Employees") {
    inquirer.prompt(questions.employees).then(function (answers) {
      switch (answers.employees) {
        case "Add an employee":
          inquirer.prompt(
            questions.employees.add(
              [
                { role: "Chicken", manager: "Bock Bagock" },
                { role: "Dog", manager: "Scruff the Woof" },
              ],
              ["Bock Bagock", "Scruff the Woof", "Big Biggerson"]
            )
          );
      }
    });
  }
});
