const connection = require("../server.js");

// this function is taken from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
const allRoles = function () {
  connection.query(
    `SELECT * FROM roles AS rol
  LEFT OUTER JOIN departments AS dept 
  ON rol.department_id = dept.id 
  LEFT OUTER JOIN
  (SELECT emp.id, emp.first_name, emp.last_name FROM employees AS emp
  INNER JOIN departments AS dep
  ON dep.manager_id = emp.id) AS man
  ON man.id = dept.manager_id;`,
    (err, res) => {
      if (err) {
        throw err;
      }
      const prettified = res.map((rol) => {
        const nameF = capFirstLetter(emp.first_name);
        const nameL = capFirstLetter(emp.last_name);
        return {
          role: rol.title,
          department: rol.name,
          manager: nameF + " " + nameL,
        };
      });
      return prettified;
    }
  );
};
module.exports = allRoles;
