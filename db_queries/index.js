const connection = require("../server");
const allEmployees = require("./allEmployees");
const allRoles = require("./allRoles");
const modifyEmployee = require("./modifyEmployee");
const addEmployee = require("./addEmployee");

const db = {
  allEmployees: allEmployees,
  allRoles: allRoles,
  modifyEmployee: modifyEmployee,
  addEmployee: addEmployee,
};

module.exports = db;
