const Enum = require('node-enumjs'); 

const StructureType = Enum.define( "Structure", ["WAYPOINT", "MACRO", "MESO", "THINSECTION"] );


//TODO: generate this enum from the file types/MacroStructureType.txt
const MacrostructureType = Enum.define( "Macrostructure", 
    ["SMALL_DOMAL", "LARGE_DOMAL", "DENDROLITITC", "STRATIFORM", "CYLINDRICAL", 
        "CONICAL", "OTHER", "ROUNDED_DEPRESSION", "COMPOSITE", "TEEPEE", "CONICALVOID", 
        "MEDIUM_DOMAL", "HEMISPHEREICAL", "TURBINATE",  "UNDULATORY" ] ); 



// Structure is an immutable object with a variable number
// of possible properties, not all properties are gareenteed 
// to be there. Best practice would be to check that the 
// property is there before you access that property. 
//
//
// or I am really hoping that it is immutable.
function Structure( properties )
{
    this.parentID; 
    this.parentType;
    this.structureType; 
    for( var[key, value] of properties)
    {
        this[key] = value;
    }
}



function Waypoint( properties )
{
    Structure.call(this, properties); 
    this.structureType = StructureType.WAYPOINT;


    Object.freeze(this); 
}
Waypoint.prototype = Object.create( Structure.prototype ); 




function Macrostructure( properties )
{
    Structure.call(this, StructureType.MACRO, properties); 
    this.structureType = StructureType.MACRO; 
   

    if( 'waypointID' in this ) //wtf js
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
    this.structureType = StructureType.MESO; 

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

    if( 'MesostructureID' in this ) 
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




// I am going to opt to use the functional 
// route for defining these functions, such that the object 
// is not changed when these methods are called on them. 
//
function toPug( Structure ) { return 0; }
function toSQL( Structure ) { return 0; }

function getParents( Structure )
{
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






// short test.
var myMap = new Map( [ ["waypointID", 1], ["latitude", 1234.1234], ["longitude", 1234.1234] ]); 
var myWaypoint = structureFactory( StructureType.WAYPOINT,  myMap); 
console.log( myWaypoint instanceof Waypoint); 
console.log( myWaypoint instanceof Structure );
console.log( Object.entries( myWaypoint ) ); 

//Module Export 
module.exports = { StructureType, Structure, MacrostructureType, StructureType  };
