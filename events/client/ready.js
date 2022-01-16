const ms = require(`ms`)
const mysql = require(`mysql`)

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "awesomeB",
    database: "activity"
});

module.exports = (client, prefix) => {

    console.log(`${client.user.username} is now ready! iujhyf`)

    client.user.setActivity("L IS REAL😱😱😱");

}

















