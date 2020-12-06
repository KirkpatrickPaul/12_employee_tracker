const connection = require("../server");
const allEmployees = require("./allEmployees");

const db = { allEmployees: console.table(allEmployees()) };

module.exports = db;
