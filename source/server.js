const Dbtools = require('./dbtools.js') ;
const Types = require('./types.js'); 

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



//Dbtools.createTables(mysql_conn); 
//Dbtools.restoreFromCSV(mysql_conn); 


var macroTestMap = new Map( [ ["MacroStructureID", 1], 
    ["MacrostructureType", Types.MacrostructureType.SMALL_DOMAL], 
    ["WaypointID", 10] ] ); 

var myMacrostructure = Types.structureFactory( Types.StructureType.MACROSTRUCTURE, macroTestMap ); 
console.log( myMacrostructure ); 
Types.getParents( myMacrostructure, mysql_conn ); 




app.listen(3000);





