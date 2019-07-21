var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
		const targets = creep.room.find(FIND_STRUCTURES, {
			filter: object => object.hits < object.hitsMax/3
		});

		targets.sort((a,b) => a.hits - b.hits);

		if(targets.length > 0) {
			if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0]);
			}
		}
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var spawn = creep.room.find(FIND_MY_SPAWNS);
	        if(creep.withdraw(spawn[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    	        creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffaa00'}});
	        }
        }
	}
};

module.exports = roleUpgrader;