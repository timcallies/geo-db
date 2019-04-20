const Enum = require('node-enumjs'); 

//modules.exports = {  };


var EntryType = Enum.define( "Entry", ["WAYPOINT", "MACROSTRUCTURE", "MESOSTRUCTURE", "THINSECTION"] );


//TODO: generate this enum from the file types/MacroStructureType.txt
var MacrostructureType = Enum.define( "Macrostructure", 
    ["SMALL_DOMAL", "LARGE_DOMAL", "DENDROLITITC", "STRATIFORM", "CYLINDRICAL", 
        "CONICAL", "OTHER", "ROUNDED_DEPRESSION", "COMPOSITE", "TEEPEE", "CONICALVOID", 
        "MEDIUM_DOMAL", "HEMISPHEREICAL", "TURBINATE",  "UNDULATORY" ] ); 




var toPug = function() { return 0; }
var toSQL = function() { return 0; }
var getParents = function(){ return 0; }
var getChildern = function(){ return 0; } 
var updateProperties = function(){ return 0; }
var getPhotos = function(){ return 0; }
// var addChild = function(){ return 0; } 
// deleteEntry = function(){ return 0; } 




// properties is a map of possible key value pairs.  
function entryFactory( entryType, properties )
{ 
   
    switch( entryType.ordinal() )
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


// if js does lazy eval then this will load all the methods in 
// on creation of the object. 
function Entry( )
{
    this.toPug = toPug; 
    this.toSQL = toSQL; 
    this.getParents = getParents; 
    this.updateProperties = updateProperties; 
    this.getPhotos = getPhotos; 
}


function Waypoint( properties )
{
    Entry.call(this); 

    for( var[key, value] of properties)
    {
        this[key] = value;
    }

}


function Macrostructure( properties )
{
    Entry.call(this); 

    for( var[key, value] of properties )
    {
        this[key] = value;
    }

}


function Mesostructure( properties ) 
{
    Entry.call(this); 

    for( var[key, value] of properties)
    {
        this[key] = value;
    }

}

function ThinSection( properties )
{
    Entry.call(this); 
    for( var[key, value] of properties)
    {
        this[key] = value;
    }

    ThinSection.prototype = Object.create(Entry.prototype); 
}


// short test.
var myMap = new Map( [ ["waypointID", 1], ["latitude", 1234.1234], ["longitude", 1234.1234] ]); 
var myWaypoint = entryFactory( EntryType.WAYPOINT,  myMap); 
console.log( myWaypoint instanceof Waypoint); 
console.log( myWaypoint instanceof Entry );


