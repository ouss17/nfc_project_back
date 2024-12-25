var mysql = require("mysql2");
const { createDatabase } = require("../modules/database_creation");
require("dotenv").config();

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    multipleStatements: true,
});

con.connect(function (err) {
    if (err) {
        console.error(
            "❌ A problem occured while trying to establish mysql connection",
            err
        );
        return { result: false };
    }
    console.log("✅ Mysql Database connected");
    createDatabase(con);
});

module.exports = con;
