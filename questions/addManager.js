const inquirer = require("inquirer");

// rolesArr should be an array filled with objects that have {id: x, role: y, manager: z} format.
// employeesArr should be an array filled with objects that have {id: w, name: x, manager: y, role_id: z} format.
const addManager = function (
  rolesArr,
  employeesArr,
  role = "", // should be the recommended role's id number if applicable
  previousAnswers = "" //for passing information to modifyEmployee
) {
  let roleIdx = 0;
  if (role) {
    roleIdx = rolesArr.findIndex((elem) => elem.id === role);
  }
  const roleManager = rolesArr[roleIdx].manager;
  const employees = employeesArr.map((elem) => elem.name);

  inquirer
    .prompt([
      {
        name: "manager",
        type: "list",
        message: "Who will be the employee's manager?",
        choices: employees,
        default: roleManager,
      },
    ])
    .then((answers) => {
      const idx = employees.findIndex((emp) => emp === answers.manager);
      const manager = employeesArr[idx];
      if (previousAnswers) {
        previousAnswers.employee.manager_id = manager.id;
        previousAnswers.employee.manager = manager.manager;
        return previousAnswers;
      } else {
        return manager;
      }
    });
};
module.exports = addManager;
