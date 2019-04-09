const dbtools = require('./dbtools.js') ;

const express = require('express');
const app = express();

const mysql = require('mysql');
const mysql_conn = mysql.createConnection({
	host        : 'localhost',
	user        : 'me',
	password    : '',
	database    : 'geodb'
});

mysql_conn.connect( function(err) { 
	if(err && err.code === "ER_ACCESS_DENIED_ERROR" ){
		console.log("Error: " + err.code 
			+ ". Have you added 'me'@'localhost' to mysql.user table?"); 
	}
	else if (err) {
		console.log("Error in connecting to the mysql databse: " + err.code ); 
	}
}); 



//dbtools.createTables(mysql_conn); 
//dbtools.restoreFromCSV(mysql_conn); 

app.listen(3000);





