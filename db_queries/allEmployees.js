const connection = require("../server.js");

// this function is taken from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const allEmployees = function () {
  connection.query(
    "SELECT * FROM employees LEFT OUTER JOIN roles ON employees.role_id = roles.id;",
    function (err, res) {
      if (err) {
        throw err;
      }
      const prettified = res.map((emp) => {
        const nameF = capFirstLetter(emp.first_name);
        const nameL = capFirstLetter(emp.last_name);

        const empManager = res.find(
          (employee) => employee.id === emp.manager_id
        );
        const managerNameF = capFirstLetter(empManager.first_name);
        const managerNameL = capFirstLetter(empManager.last_name);

        return {
          name: nameF + " " + nameL,
          manager: managerNameF + " " + managerNameL,
          role: emp.title,
        };
      });
      return prettified;
    }
  );
};
module.exports = allEmployees;
