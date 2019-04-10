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


const readline = require('readline'); 
const rl = readline.createInterface( process.stdin, process.stdout ); 
const SQL = require('sql-template-strings'); 

//pack the functions into the module. 
module.exports = { sendQuery, restoreFromCSV, createTables }





/* 
 * This is a general purpose helper function 
 * for sending queries to the geodb using the 'me'
 * user.  This function does not sanatize sql input. 
 */
function sendQuery( mysql_conn, queryString ) {
	
	if( mysql_conn == null)
	{
		throw "The mysql connection argument cannot be null"; 
	}

	function queryExec(resolve, reject) {

		mysql_conn.query( queryString, 	function( error, results) {
			if(error ){
				return reject(error); 
			}
			else 
			{ 
				console.log("Quering geodb: " + queryString ); 
				//console.log(results);
				resolve(results); 
			}
		} );
	};

	return new Promise( queryExec ); 
};


function queryPromiseReject( err )
{
	if(err) { 
		console.log("Your query was rejected. ERROR: " + err.code
			+ "\n QUERY STRING: " + err.sql ); 
	}
}



//	This function will create the neccessary tables in the mysql database
//	
//	The table names / collumn names / collumn data types are all defined by
//	the csvs, so any changes made that are not reflected in the csv will 
//	not carried over. 
//
//
// TODO: Add Relations. 
// TODO: Enum data types
// TODO: Add notnull characteristic to appropriate collumns. 
// NOTE: Not sure if loading into autoincrement column will work.
function createTables( mysql_conn )
{

	//The following variables are SQL statements for creating the tables
	//for our database. 
	let microbilitesTbl = {
		name: 'microbialites', 
		query: SQL`CREATE TABLE microbialites( 
			Northing FLOAT, 
			Easting FLOAT, 
			SampleID varchar(20) NOT NULL, 
			MacrostructureType INT, 
            MesostructureDesc INT, 
            LaminaShape INT, 
            LaminaInheritance INT,
			PRIMARY KEY( SampleID )
		);` 
	}

	let macrostructureDataTbl = {
		name: 'macrostructureData', 
		query: SQL`CREATE TABLE macrostructureData(
			MacrostructureID INT NOT NULL AUTO_INCREMENT, 
			MacrostructureType INT NOT NULL, 
			Comments TEXT, 
			WaypointID INT, 
            SectionHeight INT, 
			MegastructureType INT,
			PRIMARY KEY( MacrostructureID ), 
		);`  
	}

	let macrostructureLocationsTbl = {
		name: 'macrostructureLocations', 
		query: SQL`CREATE TABLE macrostructureLocations(
			WaypointName INT, 
			Northing FLOAT, 
			Easting FLOAT, 
			Datum varchar(10), 
			MacrostructureType INT, 
            MacrostructureID INT,
            MegastructureType INT); ` 
	}

	let mesostructureDataTbl = {
		name: 'mesostructureData', 
		query: SQL`CREATE TABLE mesostructureData(
			SampleIDKey INT NOT NULL AUTO_INCREMENT, 
			SampleID varchar(20), 
			SampleSize varchar(20),
			FieldDescription varchar(50), 
			RockDescription varchar(2000),
			MesostructureDesc INT, 
            LaminaShape INT, 
			LaminaThickness FLOAT, 
            MacrostructureID FLOAT, 
			SynopticRelief FLOAT, 
            Wavelength FLOAT, 
			AmplitudeOrHeight INT, 
			MesostructureTexture INT, 
            MesostructureGrains INT, 
            MesostructureTexture2 INT, 
            Analyst1 INT, 
            LaminaInheritance INT, 
            MesoClotShape INT,
            MesoClotSize INT, 
			PRIMARY KEY (SampleIDKey)
		);`
	}


	// TODO: Correct ordering of collumns.
	// 			Check Data types. 
	// 			Last column ?? 
	let photoLinksDataTbl = {
		name: 'photoLinksData', 
		query: SQL`CREATE TABLE photoLinksData(
			PhotoIDKey INT NOT NULL AUTO_INCREMENT, 
            SampleIDKey INT, 
			C INT, 
            OutcropPhoto BOOLEAN, 
            Photomicrograph BOOLEAN, 
            TSOverview BOOLEAN, 
			CLImage BOOLEAN, 
            OtherImage BOOLEAN, 
            OtherDocument BOOLEAN, 
            MacrostructureID INT, 
            TSDescID INT, 
			WaypointIDKey INT, 
            PhotoLinkRelative TEXT, 
            SampleID INT
			PRIMARY KEY (PhotoIDKey )
		);` 
	}

	let samplesForARCTbl = { 
		name: 'samplesForARC',
		query: SQL`CREATE TABLE samplesForARC(
			SampleID VARCHAR(20), 
            Datum VARCHAR(20), 
			UTMZone1 INT, 
            UTMZone2 varchar(5), 
			Easting FLOAT, 
            Northing FLOAT, 
			DateCollected DATETIME,
			MacrostructureType INT, 
            MacrostructureDesc INT ); ` 
	}

	//check datatype of C, .
	let thinSectionDataTbl = { 
		name: 'thinSectionData', 
		query: SQL`CREATE TABLE thinSectionData(
			TSDescID INT NOT NULL AUTO_INCREMENT, 
			SampleID VARCHAR(20),
			Subsample VARCHAR(10), 
            SampleIDKey INT, 
			TSDescription TEXT, 
			PrimaryTexture INT, 
            SecondaryTexture INT, 
            Cement1 INT, 
            Porosity1 INT, 
			Cement2 INT, 
            Porosity2 INT, 
            PorosityPercentEst INT, 
            CementFill BOOLEAN, 
            Mineralogy1 INT,
            Mineralogy2 INT,
            ClasticGrains1 INT,
            ClasticGrains2 INT,
			PRIMARY KEY (TSDescID)
        ); `
	}

	let thrombolitesOnlyTbl = {
		name: 'thrombolitesOnly', 
		query: SQL`CREATE TABLE thrombolitesOnly(
			Northing FLOAT, 
            Easting FLOAT, 
			SampleID VARCHAR(20), 
			MesostructureDesc INT ); `
	}

	var tables = [microbilitesTbl, macrostructureDataTbl, macrostructureLocationsTbl, 
		mesostructureDataTbl, photoLinksDataTbl, 
		samplesForARCTbl, thinSectionDataTbl, thrombolitesOnlyTbl];


	//where the queries are made. 
	for( let table of tables )
	{
		let queryPromise = sendQuery(mysql_conn, table.query.sql ); 
		queryPromise.then( () => { console.log("Added table " + table.name);  }, queryPromiseReject ); 
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
		let queryPromise = sendQuery( mysql_conn, queryString ); 
		queryPromise.then( function( tableNames ) {

			//for each table delete the contents of that table. 
			for( let i = 0; i < tableNames.length; i++) 
			{
				let tableName = tableNames[i].TABLE_NAME;
				let queryString = "TRUNCATE TABLE " + tableName + ";";

				let deleteQueryPromise = sendQuery(mysql_conn, queryString); 
				deleteQueryPromise.then( restoreData(tableName), queryPromiseReject ); 
			}
		}, queryPromiseReject );
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
					
				//console.log("\n ======DATABASE RESTORED======\n") ;  
				
			}
			else { console.log("Not restoring geodb"); }
			rl.close(); 
		}); 
}



