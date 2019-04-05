/*				dbtools.js
 *
 *	This module contains functions that are meant to 
 *	aid the developers of this application in the 
 *	administration / maintainance of the database. 
 *
 *
 *  Public methods: 
 *  	sendQuery( mysql_conn,  queryString ) 
 * 		createTables( mysql_conn )
 *		restoreFromCSV( mysql_conn )
 *
 */



const mysql = require('mysql');
const connection = mysql.createConnection({
	host        : 'localhost',
	user        : 'me',
	password    : '',
	database    : 'geodb'
});

var mysql_conn1 = connection.connect();
sendQuery( mysql_conn1, ""); 


const readline = require('readline'); 
const rl = readline.createInterface( process.stdin, process.stdout ); 
const SQL = require('sql-template-strings'); 

module.exports = { sendQuery, restoreFromCSV, createTables }

/* 
 * This is a general purpose helper function 
 * for sending queries to the geodb using the 'me'
 * user.  This function does not sanatize sql input. 
 */
function sendQuery( mysql_conn, queryString ) {

	function queryExec(resolve, reject) {

		mysql_conn1.query( queryString, 	function( error, results) {
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





//	This function will create the neccessary tables in the mysql database
//	
//	The table names / collumn names / collumn data types are all defined by
//	the csvs, so any changes made that are not reflected in the csv will 
//	not carried over. 
//
//
// TODO: Replace A, B, C... with correct column names.
// TODO: Add Relations. 
// TODO: Enum data types
// TODO: Add notnull characteristic to appropriate collumns. 
function createTables( mysql_conn )
{

	//The following variables are SQL statements for creating the tables
	//for our database. 
	let microbilitesTbl = {
		name: 'microbialites', 
		query: SQL`CREATE TABLE microbialites( 
			A FLOAT, 
			B FLOAT, 
			C varchar(20), 
			D INT, E INT, F INT, G INT);` 
	}

	let macrostructureDataTbl = {
		name: 'macrostructureData', 
		query: SQL`CREATE TABLE macrostructureData(
			A INT, 
			B INT, 
			C varchar(100), 
			D INT, E INT, 
			F varchar(10) );`  
	}

	let macrostructureLocationsTbl = {
		name: 'macrostructureLocations', 
		query: SQL`CREATE TABLE macrostructureLocations(
			A varchar(1), 
			B FLOAT, 
			C FLOAT, 
			D varchar(10), 
			E INT, F INT ); ` 
	}

	//TODO: Check datatypes of D,M,N,O,P,Q,R 
	let mesostructureDataTbl = {
		name: 'mesostructureData', 
		query: SQL`CREATE TABLE mesostructureData(
			A INT, 
			B varchar(20), 
			C varchar(20),
			D INT, 
			E TEXT,
			F INT, G INT, 
			H FLOAT, I FLOAT, 
			J FLOAT, K FLOAT, 
			L INT, 
			M INT, N INT, O INT, P INT, Q INT, R INT );`
	}

	let photoLinksDataTbl = {
		name: 'photoLinksData', 
		query: SQL`CREATE TABLE photoLinksData(
			A INT, B INT, C INT, D INT, E INT, F INT, 
			G INT, H INT, I INT, J INT, K INT, 
			L TEXT, M INT);` 
	}

	//TODO: The date format in the CSV is backwards.  
	//		Datetime needs to be in the format of YYYYMMDD HH:MM:SS
	let samplesForARCTbl = { 
		name: 'samplesForARC',
		query: SQL`CREATE TABLE samplesForARC(
			A VARCHAR(20), B VARCHAR(20), 
			C INT, D CHAR, 
			E FLOAT, F FLOAT, 
			G DATETIME,
			H INT, I INT ); ` 
	}

	//check datatype of C, .
	let thinSectionDataTbl = { 
		name: 'thinSectionData', 
		query: SQL`CREATE TABLE thinSectionData(
			A INT, 
			B VARCHAR(20),
			C INT, D INT, 
			E TEXT, 
			F INT, G INT, H INT, I INT, 
			J INT, K INT, L INT, M INT, N INT ); `
	}

	let thrombolitesOnlyTbl = {
		name: 'thrombolitesOnly', 
		query: SQL`CREATE TABLE thrombolitesOnly(
			A FLOAT, B FLOAT, 
			C VARCHAR(20), 
			D INT ); `
	}

	var tables = [microbilitesTbl, macrostructureDataTbl, macrostructureLocationsTbl, 
		mesostructureDataTbl, photoLinksDataTbl, 
		samplesForARCTbl, thinSectionDataTbl, thrombolitesOnlyTbl];


	//where the queries are made. 
	for( let table of tables )
	{
		//console.log(table.query.sql); 
		let queryPromise = sendQuery(mysql_conn, table.query.sql ); 
		queryPromise.then( () => { console.log("Added table " + table.name);  } ); 
	}

}




/* ===============WARNING=================
 *
 *
 * This function is meant only for dev purposes. 
 * Use this function if you mess up the database
 * and want to restore it back to it's original state. 
 * This function will ask for confirmation on the command line. 
 *
 * Note that this function will only work if there are actually 
 * tables in the database. 
 * 
 */
function restoreFromCSV( mysql_conn )
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
		sendQuery(mysql_conn, queryString); 
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



