const readline = require('readline'); 
const rl = readline.createInterface( process.stdin, process.stdout ); 

const SQL = require('sql-template-strings'); 


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

//restoreFromCSV(); 

app.listen(3000);







// TODO: Replace A, B, C... with correct column names.
// TODO: Add Relations. 
// TODO: Enum data types? 
function createTables()
{

	//The following variables are SQL statements for creating the tables
	//for our database. 
	let microbilitesTbl = SQL`CREATE TABLE microbilites( 
		A FLOAT, 
		B FLOAT, 
		C varchar(20), 
		D INT, E INT, F INT, G INT);`; 	
						

	let macrostructureDataTbl = SQL`CREATE TABLE macrostructureData(
		A INT, 
		B INT, 
		C varchar(100), 
		D INT, E INT, 
		F varchar(10) );` ; 


	let macroStructureLocationTbl = SQL`CREATE TABLE macrostructureLocations(
		A varchar(1), 
		B FLOAT, 
		C FLOAT, 
		D varchar(10), 
		E INT, F INT ); `; 


	//TODO: Check datatypes of D,M,N,O,P,Q,R 
	let mesostructureDataTbl = SQL`CREATE TABLE mesostructureData(
		A INT, 
		B varchar(20), 
		C varchar(20),
		D INT, 
		E varchar(100),
		F INT, G INT, 
		H FLOAT, I FLOAT, 
		J FLOAT, K FLOAT, 
		L INT, 
		M INT, N INT, O INT, P INT, Q INT, R INT );`; 


	let photoLinksDataTbl = SQL`CREATE TABLE photoLinksData(
		A INT, B INT, C INT, D INT, E INT, F INT, 
		G INT, H INT, I INT, J INT, K INT, 
		L varchar(100), M INT);` ; 


	//TODO: The date format in the CSV is backwards.  
	//		Datetime needs to be in the format of YYYYMMDD HH:MM:SS
	let samplesForARCTbl= SQL`CREATE TABLE samplesForARC(
		A VARCHAR(20), B VARCHAR(20), 
		C INT, D CHAR, 
		E FLOAT, F FLOAT, 
		G DATETIME
		H INT, I INT ); `; 

	
	let thinSectionDataTbl = SQL`CREATE TABLE thinSectionData(



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
			rl.close(); 
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










