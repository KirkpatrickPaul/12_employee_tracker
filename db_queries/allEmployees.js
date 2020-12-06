const connection = require("../server.js");

const allEmployees = function () {
  connection.query(
    "SELECT * FROM employees LEFT OUTER JOIN roles ON employees.role_id = roles.id;",
    function (err, res) {
      if (err) {
        throw err;
      }
      const prettified = res.map((emp) => {
        const nameF = emp.first_name[0].toUpperCase() + emp.first_name.slice(1);
        const nameL = emp.last_name[0].toUpperCase() + emp.last_name.slice(1);

        const empManager = res.find(
          (employee) => employee.id === emp.manager_id
        );
        const managerNameF =
          empManager.first_name[0].toUpperCase() +
          empManager.first_name.slice(1);
        const managerNameL =
          empManager.last_name[0].toUpperCase() + empManager.last_name.slice(1);

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
