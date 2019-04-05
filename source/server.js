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


//dbtools.createTables(mysql_conn); 
dbtools.restoreFromCSV(mysql_conn); 

app.listen(3000);





