const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");
// const { default: app } = require("../app");


const dbConnection = mysql.createPool({
  user: "evangadi_admin",
  database: "evangadi_forum",
  host: "localhost",
  password: "123456789",
  connectionLimit: 10,
});

// // Test database connection
// dbConnection.execute("select 'test' ", (err, result)=>{
//     if(err){
//         console.log(err.message)
//     }else{
//         console.log(result)
//     }
// })



module.exports = dbConnection.promise(); 