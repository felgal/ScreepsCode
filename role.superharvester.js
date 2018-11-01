var roleSuperHarvester = {

    /** @param {Creep} creep **/
    run: function(creep,sourceAtual) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            
            if(creep.harvest(sources[sourceAtual]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceAtual], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        /*else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }*/
	}
};

module.exports = roleSuperHarvester;