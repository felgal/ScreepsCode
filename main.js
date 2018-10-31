var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

function bodyCost (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

function criarRuas(){
    for(var spName in Game.spawns){
        var sp = Game.spawns[spName];
        var posX  = sp.pos.x;
        var posY = sp.pos.y;
        var sources = sp.room.find(FIND_SOURCES);
        for (var j = 0; j < sources.length; j++)
        {
            var blocos = sp.pos.findPathTo(sources[j].pos);
            for (var i = 0; i < blocos.length; i++) 
            {
                sp.room.createConstructionSite(blocos[i].x,blocos[i].y, STRUCTURE_ROAD);
            }
        }
    }
}

function inicializarSpawn(spawnName){
    for(var spName in Game.spawns){
        var sp = Game.spawns[spName];
        var posX  = sp.pos.x;
        var posY = sp.pos.y;
        Game.rooms[sp.room.name].createConstructionSite(posX-1, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX-1, posY, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX+1, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX+1, posY, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX+2, posY-2, STRUCTURE_STORAGE);
    }
}

module.exports = {
    init: inicializarSpawn,
    ruas: criarRuas
}

module.exports.loop = function () {
    for(var spName in Game.spawns){
        var sp = Game.spawns[spName];
        console.log("Energia atual: "+ sp.energy);
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Upgrader: ' + upgraders.length);
    console.log('Harvesters: ' + harvesters.length);
    console.log('Builders: ' +builders.length);
    
    if(harvesters.length < 5 && bodyCost([WORK,CARRY,MOVE])<=Game.spawns["Com"].energy) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Com'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
    }
    else if(upgraders.length < 3 && bodyCost([WORK,CARRY,MOVE])<=Game.spawns["Com"].energy) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Com'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
    }
    else if(builders.length < 2 && bodyCost([WORK,CARRY,MOVE])<=Game.spawns["Com"].energy) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Com'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
    }
    
    if(Game.spawns['Com'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Com'].spawning.name];
        Game.spawns['Com'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Com'].pos.x + 1, 
            Game.spawns['Com'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    var sourceAtual=0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            var sources = creep.room.find(FIND_SOURCES);
            roleHarvester.run(creep,sourceAtual);
            sourceAtual++;
            if(sourceAtual>=sources.length){
                sourceAtual=0;
            }
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}