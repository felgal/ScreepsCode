var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 collecting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	        creep.say('🚧 build');
	    }
	    else {
	        var spawn = creep.room.find(FIND_MY_SPAWNS);
	        if(spawn[0].energy>=50){
	            
    	        if(creep.withdraw(spawn[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            	  creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        	    
    	        }
	        }
	        else{
	            var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
	        
            
	    }
	}
};

module.exports = roleBuilder;