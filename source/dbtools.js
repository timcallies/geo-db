/*				dbtools.js
 *
 *	This module contains functions that are meant to 
 *	aid the developers of this application in the administration / maintainance of the database. 
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





/* This is a general purpose helper function 
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
	
	
	//Project Name is enum
	//Section name ?? 
	let waypointsTbl = {
		name: 'Waypoints', 
		query: SQL`CREATE TABLE Waypoints(
			WaypointID          INT NOT NULL AUTO_INCREMENT, 
			Latitude            FLOAT, 
			Longitude           FLOAT, 
			Northing            FLOAT, 
			Easting             FLOAT, 
			UTMZone1            INT, 
			UTMZone2            INT, 
			Datum               VARCHAR(20), 
			Projection          VARCHAR(5), 
			Feildbook           VARCHAR(50), 
			FeildbookPage       INT, 
			Formation           VARCHAR(20), 
			SiteOrLocationName  VARCHAR(100),
			DateCollected       DATETIME, 
			Elevation           INT, 
			ProjectName         VARCHAR(20), 
			Measured            BOOLEAN, 
			SectionName         VARCHAR(20), 
			Comments            TEXT, 
			PRIMARY KEY( WaypointID )
		);`
	}

			
	let macrostructuresTbl = {
		name: 'Macrostructures', 
		query: SQL`CREATE TABLE Macrostructures(
            MacrostructureID    INT NOT NULL AUTO_INCREMENT, 
            MacrostructureType  INT, 
            MegastructureType   INT,
            SectionHeight       INT, 
            Northing            FLOAT, 
            Easting             FLOAT, 
            Datum               varchar(10), 
            WaypointID          INT NOT NULL, 
            Comments            TEXT, 
            PRIMARY KEY( MacrostructureID ), 
            FOREIGN KEY( WaypointID ) REFERENCES Waypoints(WaypointID)
		);`  
	}


	let mesostructuresTbl = {
		name: 'Mesostructures', 
		query: SQL`CREATE TABLE Mesostructures(
            MesostructureID         INT NOT NULL AUTO_INCREMENT, 
            SampleID                varchar(20), 
            SampleSize              varchar(20),
            FieldDescription        varchar(50), 
            RockDescription         varchar(2000),
            MesostructureDesc       INT, 
            MacrostructureID        INT NOT NULL, 
            LaminaThickness         FLOAT, 
            SynopticRelief          FLOAT, 
            Wavelength              FLOAT, 
            AmplitudeOrHeight       INT, 
            MesostructureTexture    INT, 
            MesostructureGrains     INT, 
            MesostructureTexture2   INT, 
            Analyst                 INT, 
            LaminaShape             INT, 
            LaminaInheritance       INT, 
            MesoClotShape           INT,
            MesoClotSize            INT, 
            PRIMARY KEY (MesostructureID),
            FOREIGN KEY (MacrostructureID ) REFERENCES Macrostructures( MacrostructureID )
		);`
	}

	let thinSectionsTbl = { 
		name: 'ThinSections', 
		query: SQL`CREATE TABLE ThinSections(
            TSID            INT NOT NULL AUTO_INCREMENT, 
            SampleID            VARCHAR(20) NOT NULL,
            Subsample           VARCHAR(10), 
            MesostructureID     INT NOT NULL, 
            TSDescription       TEXT, 
            PrimaryTexture      INT, 
            SecondaryTexture    INT, 
            Cement1             INT, 
            Porosity1           INT, 
            Cement2             INT,
            Porosity2           INT, 
            PorosityPercentEst  INT, 
            CementFill          BOOLEAN, 
            Mineralogy1         INT,
            Mineralogy2         INT,
            ClasticGrains1      INT,
            ClasticGrains2      INT,
            PRIMARY KEY (TSID),
            FOREIGN KEY (MesostructureID) REFERENCES Mesostructures(MesostructureID)
        ); `
	}

	// TODO: Relative file paths.  
	let photoLinksTbl = {
		name: 'PhotoLinks', 
		query: SQL`CREATE TABLE PhotoLinks(
            PhotoID         INT NOT NULL AUTO_INCREMENT, 
            OutcropPhoto    BOOLEAN, 
            Photomicrograph BOOLEAN, 
            CLImage         BOOLEAN, 
            OtherImage      BOOLEAN, 
            TSOverview      BOOLEAN, 
            OtherDocument   BOOLEAN, 
            WaypointID          INT, 
            MacrostructureID    INT, 
            MesostructureID     INT,
            TSID                INT, 
            PhotoLinkRelative   TEXT, 
            PRIMARY KEY (PhotoID), 
            FOREIGN KEY (MacrostructureID) REFERENCES Macrostructures(MacrostructureID),
            FOREIGN KEY (MesostructureID) REFERENCES Mesostructures(MesostructureID),
            FOREIGN KEY (TSDescID) REFERENCES ThinSections(TSDescID),
            FOREIGN KEY (WaypointID) REFERENCES Waypoints(waypointID)
		);` 
	}


	// no relation
	let microbilitesTbl = {
		name: 'Microbialites', 
		query: SQL`CREATE TABLE Microbialites( 
            Northing            FLOAT, 
            Easting             FLOAT, 
            SampleID            varchar(20) NOT NULL, 
            MacrostructureType  INT, 
            MesostructureDesc   INT, 
            LaminaShape         INT, 
            LaminaInheritance   INT,
            PRIMARY KEY( SampleID )
		);` 
	}


	// no relation
	let samplesForARCTbl = { 
		name: 'SamplesForARC',
		query: SQL`CREATE TABLE SamplesForARC(
			SampleID            VARCHAR(20) NOT NULL, 
            Datum               VARCHAR(20), 
            UTMZone1            INT, 
            UTMZone2            CHAR(1), 
            Easting             FLOAT, 
            Northing            FLOAT, 
            DateCollected       DATETIME,
            MacrostructureType  INT, 
            MacrostructureDesc  INT,
            PRIMARY KEY (SampleID) 
		); ` 
	}


	// no relation
	let thrombolitesOnlyTbl = {
		name: 'ThrombolitesOnly', 
		query: SQL`CREATE TABLE ThrombolitesOnly(
            Northing    FLOAT, 
            Easting     FLOAT, 
            SampleID    VARCHAR(20), 
            MesostructureDesc INT,
            PRIMARY KEY (SampleID)
		); `
	}

	var tables = [waypointsTbl, macrostructuresTbl, mesostructuresTbl,
		 thinSectionsTbl, photoLinksTbl, microbilitesTbl,
		 samplesForARCTbl, thrombolitesOnlyTbl];


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
				let queryString = "DELETE FROM " + tableName + ";";

				let deleteQueryPromise = sendQuery(mysql_conn, queryString); 
				deleteQueryPromise.then( restoreData(tableName), queryPromiseReject ); 
			}
		}, queryPromiseReject );
	}

	function restoreData(tableName)
	{
		let queryString = "LOAD DATA LOCAL INFILE './../csv/" + tableName + ".txt' INTO TABLE " + tableName + " FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES; " ;
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



