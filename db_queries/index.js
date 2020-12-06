const connection = require("../server");
const allEmployees = require("./allEmployees");
const allRoles = require("./allRoles");
const modifyEmployee = require("./modifyEmployee");
const chooseEmployee = require("./chooseEmployee");

const db = {
  allEmployees: allEmployees,
  allRoles: allRoles,
  modifyEmployee: modifyEmployee,
  chooseEmployee: chooseEmployee
};

module.exports = db;
