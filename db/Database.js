require("dotenv").config();
const pgp = require('pg-promise')();
let db;

module.exports.connectDB = async () => {
    db = pgp(process.env["DATABASE_URL"]);
    console.log(`Database is connected!`);
}
  
module.exports.getDB = () => {
    return db;
}