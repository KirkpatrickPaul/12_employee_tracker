const connection = require("../server.js");

// Should recieve employee object with at minimum an id, first_name, last_name, role_id, manager_id
const modifyEmployee = function (employee) {
  connection.query(
    `UPDATE employees SET 
  first_name = ?
  , last_name = ?
  , role_id = ?
  , manager_id = ?
  WHERE ?`,
    [
      employee.first_name,
      employee.last_name,
      employee.role_id,
      employee.manager_id,
      employee.id,
    ],
    function (err, data) {
      if (err) {
        throw err;
      }
    }
  );
};
module.exports = modifyEmployee;
