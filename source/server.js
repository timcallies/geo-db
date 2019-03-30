var stdin = process.stdin; 
stdin.setEncoding('utf-8'); 


var express = require('express');
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host        : 'localhost',
    user        : 'me',
    password    : '',
    database    : 'geodb'
});

connection.connect();












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

	console.log("Are you sure you want to restore geodb? (yes / no"); 
	stdin.on('data', function(data)  {

		if(data === 'yes'){
			//remove and re-add geodb.
			
			//load the csv files into geodb. 

		}
	}); 
};



/* This is a general purpose helper function 
 * for sending queries to the geodb using the 'me'
 * user.  This function does not sanatize sql input. 
 */
function sendQuery( queryString, callback ){

	function queryExec(resolve, reject) {

		connection.query( queryString, 	function( error, results) {
				if(error) return reject(error); 
				else { 
					console.log('fulfilled query promise'); 
					resolve(results); 
				}
			});
	};
	
	return new Promise( queryExec ); 
};






app.get('/', function(req, res){
    queryByName('Zach').then( results => {
        console.log('Got results!');
        console.log(results);
        res.send(results);
    });
    //res.send("Hello world"); 
});

function queryByName(name, callback){
    return new Promise(function (resolve, reject){
        connection.query('SELECT * FROM test_table WHERE name = "' + name + '"', function (error, results) {
            if (error) return reject(error);
            else {
                console.log('fulfilled query promise');
                resolve(results);
            }
        });
    });
};

app.listen(3000);
