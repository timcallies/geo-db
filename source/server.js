function main()
{
	const readline = require('readline'); 
	const rl = readline.createInterface( process.stdin, process.stdout ); 

	const express = require('express');
	const app = express();

	const mysql = require('mysql');
	const connection = mysql.createConnection({
		host        : 'localhost',
		user        : 'me',
		password    : '',
		database    : 'geodb'
	});

	connection.connect();

	restoreFromCSV(); 
	
	app.listen(3000);
	rl.close(); 
}






/* ===============WARNING=================
 *
 *
 * This function is meant only for dev purposes. 
 * Use this function if you mess up the database
 * and want to restore it back to it's original state. 
 * This function will ask for confirmation on the command line. 
 * 
 */
function restoreFromCSV( )
{

	function deleteData()
	{

		//get the name of the tables. 
		let queryString = "SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'geodb';"
		let queryPromise = sendQuery( queryString ); 
		queryPromise.then( function( tableNames ) {

			//for each table delete the contents of that table. 
			for( let i = 0; i < tableNames.length; i++) 
			{
				let tableName = tableNames[i].TABLE_NAME;
				let queryString = "TRUNCATE TABLE " + tableName + ";";

				let deleteQueryPromise = sendQuery(queryString); 
				deleteQueryPromise.then( restoreData( tableName ) ); 
			}
		});


	}

	function restoreData(tableName)
	{

		let queryString = "LOAD DATA LOCAL INFILE './../csv/" + tableName + ".txt' INTO TABLE " + tableName + " FIELDS TERMINATED BY ','; " ;
		sendQuery(queryString); 
	}

	rl.question("Are you sure you want to restore geodb? (yes / no)\n", function (answer) 
		{
			if(answer === 'yes')
			{
				console.log("\n\n=====RESTORING DATABASE====="); 
				deleteData(); 
				//console.log("\n ======DATABASE RESTORED======\n") );  

			}
			else { console.log("Not restoring geodb"); }

	}); 
}



/* This is a general purpose helper function 
 * for sending queries to the geodb using the 'me'
 * user.  This function does not sanatize sql input. 
 */
function sendQuery( queryString, callback ){

	function queryExec(resolve, reject) {

		connection.query( queryString, 	function( error, results) {
				if(error) return reject(error); 
				else { 
					console.log("Quering geodb: " + queryString ); 
					//console.log(results);
					resolve(results); 
				}
			});
	};
	
	return new Promise( queryExec ); 
};




main(); 
