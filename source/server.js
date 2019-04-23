
const Dbtools = require('./dbtools.js') ;
const Types = require('./types.js'); 
const pug = require('pug');


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
//Types.getParents( myMacrostructure, mysql_conn ); 


//A basic JSON object that is only for testing purposes
var demoJSON = {
  entry: {
      type:"Mesostructure",
      id:"23",
      path:[
          {
              type:"Waypoint",
              id:"99"
          },
          {
              type:"Macrostructure",
              id:"212"
          }
      ],
      descriptions:[
          {
              type:"Field Description",
              content:"Laminated top of a domal stromatolite.",
          },
          {
              type:"Rock Description",
              content:"Possible stromatolite in gypsum units."
          }
      ],
      properties:[
          {
              group:"Properties",
              properties:[
                  {
                      name:"General Type",
                      value:"Thrombolitic",
                      values:["Thrombolitic","Columnar","Digitate"]
                  },
                  {
                      name:"Texture 1",
                      value:"None",
                      values:["None","",""]
                  },
                  {
                      name:"Texture 2",
                      value:"None",
                      values:["None","",""]
                  },
                  {
                      name:"Grains",
                      value:"None",
                      values:["None","",""]
                  }
              ]
          },

          {
              group:"Lamina Properties",
              properties:[
                  {
                      name:"Lamina Shape",
                      value:"None",
                      values:["None","",""]
                  },
                  {
                      name:"Lamina Inheritance",
                      value:"None",
                      values:["None","",""]
                  },
                  {
                      name:"Lamina Thickness",
                      value:0,
                      values:[1,2,3,4,5,6,7,8,9,10]
                  },
                  {
                      name:"Synoptic Relief",
                      value:0,
                      values:[1,2,3,4,5,6,7,8,9,10]
                  },
                  {
                      name:"Wavelength",
                      value:0,
                      values:[1,2,3,4,5,6,7,8,9,10]
                  },
                  {
                      name:"Amplitude",
                      value:0,
                      values:[1,2,3,4,5,6,7,8,9,10]
                  }
              ]
          }
      ],
      images:[
          "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fdarhosta.files.wordpress.com%2F2011%2F11%2Fimg_7248.jpg&f=1",
          "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fb%2Fb4%2FLogan_Rock_Treen_closeup.jpg&f=1",
          "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.JD-zA2oD2BYLN7iX_wtGQwHaF7%26pid%3DApi&f=1",
          "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Nxy5yY5qRjKXMYRu0kidDQHaE8%26pid%3DApi&f=1"
      ],
      children:[
          {
              src:"https://cdn-images-1.medium.com/max/1200/1*d8DyNLUIa8xo5rGrO-2FSg.jpeg",
              type:"Thin Section",
              id:"1982"
          }
      ]
  }
};

//When the user requets an entry
app.get("/", function(req,res){
	res.render("template",demoJSON);
});

app.get("/src/:id", function(req,res){
	res.sendFile(__dirname +req.url)
});

//dbtools.createTables(mysql_conn);
//dbtools.restoreFromCSV(mysql_conn);

app.listen(3000);
app.set('view engine', 'pug');
