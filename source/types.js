const Enum = require('node-enumjs'); 
const dbtools = require('./dbtools.js'); 
const SQL = require('sql-template-strings'); 

const StructureType = Enum.define( "Structure", ["WAYPOINT", "MACROSTRUCTURE", "MESOSTRUCTURE", "THINSECTION"] );


//TODO: generate this enum from the file types/MacroStructureType.txt
const MacrostructureType = Enum.define( "Macrostructure", 
    ["SMALL_DOMAL", "LARGE_DOMAL", "DENDROLITITC", "STRATIFORM", "CYLINDRICAL", 
        "CONICAL", "OTHER", "ROUNDED_DEPRESSION", "COMPOSITE", "TEEPEE", "CONICALVOID", 
        "MEDIUM_DOMAL", "HEMISPHEREICAL", "TURBINATE",  "UNDULATORY" ] ); 




// These are the methods for the Structure Type. 
// Structure Objects are immutable after creation
// so these functions are purely funcitonal. 
function toPug( Structure ) { return 0; }
function toSQL( Structure ) { return 0; }


function getParents( structure, mysql_conn )
{
    result = []
    console.log(Structure.parentID ); 
    if( !(this.parentID) || !(this.parentType) ) 
    {
        console.log("Tried to get the parent of a object that is an orphan!"); 
        return result; 
    }

    query_string = SQL`SELECT * FROM ${this.parentType.name()}s 
        WHERE ${this.parentType.name()}ID = ${this.parentID}`


    queryPromise = dbtools.sendQuery( mysql_conn, queryString.SQL ); 
    queryPromise.then( (parents) => console.log(parents) ); 

    return 0; 
}

function getChildern( Structure )
{ 
    return 0; 
} 

function updateProperties(Structure, newProperties )
{ 
    return 0; 
}

function getPhotos( Structure )
{ 
    return 0; 
}
// var addChild = function(){ return 0; } 
// deleteEntry = function(){ return 0; } 





// Structure is an immutable object with a variable number
// of possible properties, not all properties are gareenteed 
// to be there. Best practice would be to check that the 
// property is there before you access that property. 
//
function Structure( properties )
{
    this.parentID; 
    this.parentType;
    this.structureType; 
    for( var[key, value] of properties)
    {
        //TODO: convert string keys/values to lowercase? 

        this[key] = value;
    }
}
//add in Structure's Methods. 
Structure.prototype.toPug = toPug; 
Structure.prototype.toSQL = toSQL; 
Structure.prototype.getParents = getParents; 
Structure.prototype.getChildern = getChildern; 
Structure.prototype.updateProperties = updateProperties; 
Structure.prototype.getPhotos = getPhotos; 




function Waypoint( properties )
{
    Structure.call(this, properties); 
    this.structureType = StructureType.WAYPOINT;

    Object.freeze(this); 
}
Waypoint.prototype = Object.create( Structure.prototype ); 




function Macrostructure( properties )
{
    Structure.call(this,  properties); 
    this.structureType = StructureType.MACROSTRUCTURE; 
   
    if( 'waypointID' in this ) 
    {
        this.parentID = this.waypointID; 
        this.parentType = StructureType.WAYPOINT; 
    }

    Object.freeze(this); 
}
Macrostructure.prototype = Object.create( Structure.prototype ); 




function Mesostructure( properties ) 
{
    Structure.call(this,  properties); 
    this.structureType = StructureType.MESOSTRUCTURE; 

    if( 'macrostructureID' in this)
    {
        this.parentID = this.macrostructureID; 
        this.parentType = StructureType.MACRO; 
    }
    
    Object.freeze(this);
}
Mesostructure.prototype = Object.create( Structure.prototype ); 





function ThinSection( properties )
{
    Structure.call(this, properties); 
    this.structureType = StructureType.THINSECTION; 

    if( 'mesostructureID' in this ) 
    {
        this.parentID = this.mesostructureID; 
        this.parentType = StructureType.MESO;
    }

    Object.freeze(this);
}
ThinSection.prototype = Object.create( Structure.prototype ); 




// properties is a map of possible key value pairs.  
function structureFactory( structureType, properties )
{ 
   
    switch( structureType.ordinal() )
    {
        //Waypoint
        case 0: 
            result = new Waypoint( properties ); 
            break; 

        //Macrostructure
        case 1: 
            result = new Macrostructure( properties );
            break; 

        //Mesostructure
        case 2: 
            result = new Mesostructure( properties ); 
            break; 

        //Thinsection
        case 3: 
            result = new ThinSection( properties ); 
            break 

        //photo? 
        default: 
            throw "Did not recoginize entry type" 
    }

    return result; 
}


/*
// short test.
var myMap = new Map( [ ["waypointID", 1], ["latitude", 1234.1234], ["longitude", 1234.1234] ]); 
var myWaypoint = structureFactory( StructureType.WAYPOINT,  myMap); 
console.log( myWaypoint instanceof Waypoint); 
console.log( myWaypoint instanceof Structure );
console.log( Object.entries( myWaypoint ) ); 
console.log( myWaypoint.toPug ); 
*/



//Module Export 
module.exports = { StructureType, Structure, MacrostructureType, structureFactory, getParents};
