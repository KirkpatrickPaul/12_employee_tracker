const connection = require("../server");
const allEmployees = require("./allEmployees");
const allRoles = require("./allRoles")

const db = { allEmployees: allEmployees,
allRoles: allRoles };

module.exports = db;
