var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep,sourceAtual) {
        if(creep.carry.energy < creep.carryCapacity) {
	        var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,{filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});
            if(dropenergy!= null){
                if(creep.pickup(dropenergy) == ERR_NOT_IN_RANGE){
                    creep.moveTo(dropenergy.pos);
					/*if(creep.room.lookAt(creep.pos.x,creep.pos.y)[0].type!=ConstructionSite  && creep.room.lookAt(creep.pos.x,creep.pos.y)[1].type!=ConstructionSite){
						creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
					}*/
                }
                creep.say('🔄 collecting_dropped');
            }
            else{
                var sources = creep.room.find(FIND_SOURCES);
                
                if(creep.harvest(sources[sourceAtual]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[sourceAtual], {visualizePathStyle: {stroke: '#ffaa00'}});
					
					/*if(creep.room.lookAt(creep.pos.x,creep.pos.y)[0].type!=ConstructionSite  && creep.room.lookAt(creep.pos.x,creep.pos.y)[1].type!=ConstructionSite){
						creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
					}*/
                }
                creep.say('🔄 collecting_source');
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        	        creep.say('🚧 storing');
					
					/*if(creep.room.lookAt(creep.pos.x,creep.pos.y)[0].type!=ConstructionSite  && creep.room.lookAt(creep.pos.x,creep.pos.y)[1].type!=ConstructionSite){
						creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
					}*/    
				}
            }
        }
	}
};

module.exports = roleHarvester;
