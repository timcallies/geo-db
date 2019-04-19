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



//
// This is a general purpose helper function 
// for sending queries to the geodb using the 'me'
// user.  This function does not sanatize sql input.  
//
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
				console.log("Quering geodb..."  ); 
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
//	the csvs, so any changes made to the database will not be reflected in
//	the csv. 
//
// TODO: Enum data types
function createTables( mysql_conn, tables )
{
    //Tables should be an object that has a name property describing the
    //name of the table, and sql template query makes the CREATE TABLE call.  

	//where the queries are made. 
	for( let table of tables )
	{
        if( table.query == NULL || table.name == NULL) { continue;  }

		let queryPromise = sendQuery(mysql_conn, table.query.sql ); 
		queryPromise.then( () => { console.log("Added table " + table.name);  }, queryPromiseReject ); 
	}
}



// This function just sets up the column names and 
// the associated data types and then makes the call to createTables().
//
// Table Name is Upper Camel Case.
// Column name is lower Camel Case. 
// Acrynomns are capitalized. 
function createDataTables( mysql_conn )
{
	//The following variables are SQL statements for creating the tables
	//for our database. 
	
	let waypointsTbl = {
		name: 'Waypoints', 
		query: SQL`CREATE TABLE Waypoints(
			waypointID          INT NOT NULL AUTO_INCREMENT, 
			latitude            FLOAT, 
			longitude           FLOAT, 
			northing            FLOAT, 
			easting             FLOAT, 
			UTMZone1            INT, 
			UTMZone2            INT, 
			datum               VARCHAR(20), 
			projection          VARCHAR(5), 
			feildbook           VARCHAR(50), 
			feildbookPage       INT, 
			formation           VARCHAR(20), 
			siteOrLocationName  VARCHAR(100),
			dateCollected       DATETIME, 
			elevation           INT, 
			projectName         VARCHAR(20), 
			measured            BOOLEAN, 
			sectionName         VARCHAR(20), 
			comments            TEXT, 
			PRIMARY KEY( waypointID )
		);`
	}

			
	let macrostructuresTbl = {
		name: 'Macrostructures', 
		query: SQL`CREATE TABLE Macrostructures(
            macrostructureID    INT NOT NULL AUTO_INCREMENT, 
            macrostructureType  INT, 
            megastructureType   INT,
            sectionHeight       INT, 
            northing            FLOAT, 
            easting             FLOAT, 
            datum               varchar(10), 
            waypointID          INT NOT NULL, 
            comments            TEXT, 
            PRIMARY KEY( MacrostructureID ), 
            FOREIGN KEY( WaypointID ) REFERENCES Waypoints(WaypointID)
		);`  
	}


	let mesostructuresTbl = {
		name: 'Mesostructures', 
		query: SQL`CREATE TABLE Mesostructures(
            mesostructureID         INT NOT NULL AUTO_INCREMENT, 
            sampleName              varchar(20), 
            sampleSize              varchar(20),
            fieldDescription        varchar(50), 
            rockDescription         varchar(2000),
            mesostructureType       INT, 
            macrostructureID        INT NOT NULL, 
            laminaThickness         FLOAT, 
            synopticRelief          FLOAT, 
            wavelength              FLOAT, 
            amplitudeOrHeight       INT, 
            mesostructureTexture    INT, 
            mesostructureGrains     INT, 
            mesostructureTexture2   INT, 
            analyst                 INT, 
            laminaShape             INT, 
            laminaInheritance       INT, 
            mesoClotShape           INT,
            mesoClotSize            INT, 
            PRIMARY KEY (mesostructureID),
            FOREIGN KEY (macrostructureID ) REFERENCES Macrostructures( macrostructureID )
		);`
	}

	let thinSectionsTbl = { 
		name: 'ThinSections', 
		query: SQL`CREATE TABLE ThinSections(
            thinSectionID                INT NOT NULL AUTO_INCREMENT, 
            sampleName          VARCHAR(20) NOT NULL,
            subsample           VARCHAR(10), 
            mesostructureID     INT NOT NULL, 
            tSDescription       TEXT, 
            primaryTexture      INT, 
            secondaryTexture    INT, 
            cement1             INT, 
            porosity1           INT, 
            cement2             INT,
            porosity2           INT, 
            porosityPercentEst  INT, 
            cementFill          BOOLEAN, 
            mineralogy1         INT,
            mineralogy2         INT,
            clasticGrains1      INT,
            clasticGrains2      INT,
            PRIMARY KEY (tsID),
            FOREIGN KEY (mesostructureID) REFERENCES Mesostructures(mesostructureID)
        ); `
	}

	// TODO: Relative file paths.  
	let photoLinksTbl = {
		name: 'PhotoLinks', 
		query: SQL`CREATE TABLE PhotoLinks(
            photoID         INT NOT NULL AUTO_INCREMENT, 
            outcropPhoto    BOOLEAN, 
            photomicrograph BOOLEAN, 
            CLImage         BOOLEAN, 
            otherImage      BOOLEAN, 
            tSOverview      BOOLEAN, 
            otherDocument   BOOLEAN, 
            waypointID          INT, 
            macrostructureID    INT, 
            mesostructureID     INT,
            thinSectionID       INT, 
            photoLinkRelative   TEXT, 
            PRIMARY KEY (photoID), 
            FOREIGN KEY (macrostructureID) REFERENCES Macrostructures(macrostructureID),
            FOREIGN KEY (mesostructureID) REFERENCES Mesostructures(mesostructureID),
            FOREIGN KEY (thinSectionID) REFERENCES ThinSections(thinSectionID),
            FOREIGN KEY (waypointID) REFERENCES Waypoints(waypointID)
		);` 
	}


	// no relation
	let microbilitesTbl = {
		name: 'Microbialites', 
		query: SQL`CREATE TABLE Microbialites( 
            northing            FLOAT, 
            easting             FLOAT, 
            sampleName          varchar(20) NOT NULL, 
            macrostructureType  INT, 
            mesostructureDesc   INT, 
            laminaShape         INT, 
            laminaInheritance   INT,
            PRIMARY KEY( sampleName )
		);` 
	}


	// no relation
	let samplesForARCTbl = { 
		name: 'SamplesForARC',
		query: SQL`CREATE TABLE SamplesForARC(
			sampleName          VARCHAR(20) NOT NULL, 
            datum               VARCHAR(20), 
            UTMZone1            INT, 
            UTMZone2            CHAR(1), 
            easting             FLOAT, 
            northing            FLOAT, 
            dateCollected       DATETIME,
            macrostructureType  INT, 
            macrostructureDesc  INT,
            PRIMARY KEY (SampleID) 
		); ` 
	}


	// no relation
	let thrombolitesOnlyTbl = {
		name: 'ThrombolitesOnly', 
		query: SQL`CREATE TABLE ThrombolitesOnly(
            northing    FLOAT, 
            easting     FLOAT, 
            sampleName  VARCHAR(20), 
            mesostructureDesc INT,
            PRIMARY KEY (sampleName)
		); `
	}

	var tables = [waypointsTbl, macrostructuresTbl, mesostructuresTbl,
		 thinSectionsTbl, photoLinksTbl, microbilitesTbl,
		 samplesForARCTbl, thrombolitesOnlyTbl];

    createTables( mysql_conn, tables); 
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



