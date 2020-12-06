const questions = {
  whatDo: {
    name: "whatDo",
    type: "list",
    message: "What would you like to look at and/or modify?",
    choices: ["Employees", "Roles", "Departments"],
  },
  employees: {
    name: "employees",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "See all employees",
      "Add an employee",
      "Change an employee's role",
      "Change an employee's manager",
    ],
    //add here will be called by typing questions.employees.add()
    add: function (rolesArr, employeesArr) {
      // This function receives rollsArr which will be an array filled with objects that have {role: x, manager: y} format.
      const roles = rolesArr.map((obj) => obj.role);
      return [
        {
          name: "firstName",
          type: "input",
          message: "What is the new employee's FIRST name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the new employee's LAST name?",
        },
        {
          name: "role",
          type: "list",
          message: "What role will the new employee serve in the company?",
          choices: roles,
        },
        {
          name: "manager",
          type: "list",
          message: "Who will be the new employee's manager?",
          choices: employeesArr,
          default: function () {
            const dept = rolesArr.find((elem) => elem.role === answers.role);
            return dept.manager;
          },
        }, // This site suggested that answers.role should work:
        // https://stackoverflow.com/questions/49520423/is-there-a-way-to-use-previous-answers-in-inquirer-when-presenting-a-prompt-inq
      ];
    },
    addManager: function (rolesArr, role, employeesArr) {
      const roleDefault = rolesArr.find((elem) => elem.role === role);
      return {
        name: "manager",
        type: "list",
        message: "Who will be the new employee's manager?",
        choices: employeesArr,
        default: roleDefault,
      };
    },
  },
  roles: {
    name: "roles",
    type: "list",
    message: "What would you like to do?",
    choices: ["See all roles", "Add a role", "Change an employee's role"],
  },
  departments: {
    name: "departments",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "See all departments",
      "Add a role to a department",
      "Change a department's manager",
    ],
  },
};
module.exports = questions;
