const inquirer = require("inquirer");
const addManager = require("./addManager");
const whatDo = require("./whatDo");
const employees = require("./employees");
const roles = require("./roles");
const departments = require("./departments")

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
          type: "rawlist",
          message: "What role will the new employee serve in the company?",
          choices: roles,
        },
        {
          name: "manager",
          type: "rawlist",
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
    changeRole: function (employeesArr, rolesArr) {
      // This function recieves employeesArr which will be an array filled with objects that have {firstName: w, lastName: x, manager: y, role: z} format.
      const employees = employeesArr.map((obj) => {
        const firstName = obj.firstName;
        const lastName = obj.lastName;
        firstName[0].toUpperCase() + firstName.slice(1);
        lastName[0].toUpperCase() + lastName.slice(1);
        return firstName + " " + lastName;
      });
      // This function receives rollsArr which will be an array filled with objects that have {role: x, manager: y} format.
      const roles = rolesArr.map((obj) => obj.role);
      return [
        {
          name: "employee",
          type: "rawlist",
          message: "Which employee's role do you wish to change?",
          choices: employees,
        },
        {
          name: "role",
          type: "rawlist",
          message: "What role will the new employee serve in the company?",
          choices: roles,
        },
        {
          name: "changeManager",
          type: "confirm",
          message: "Change employees manager as well?",
        },
        {
          name: "manager",
          type: "rawlist",
          message: "Who will be the new employee's manager?",
          choices: employees,
          default: function () {
            const dept = rolesArr.find((elem) => elem.role === answers.role);
            return dept.manager;
          },
          when: answers.changeManager,
        },
      ];
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
      "Add a department",
      "Add a role to a department",
      "Change a department's manager",
    ],
  },
};
module.exports = questions;
