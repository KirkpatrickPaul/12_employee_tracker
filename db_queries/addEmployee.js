const connection = require("../server");

const addEmployee = function (employeeObj) {
  connection.query(
    "INSERT INTO employees SET ?",
    {
      first_name: employeeObj.employee.first_name,
      last_name: employeeObj.employee.last_name,
      role_id: employeeObj.employee.role_id,
      manager_id: employeeObj.employee.manager_id,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
    }
  );
};
module.exports = addEmployee;
