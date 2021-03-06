var roleHarvester = require('role.harvester');
var roleSuperHarvester = require('role.superharvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var inicial = true;
var criaruastempo = 0; 

//custo total do corpo 
function bodyCost (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

//cria ruas entre os sources e spawns
function criarRuas(){
    for(var spName in Game.spawns){
        var sp = Game.spawns[spName];
        var posX  = sp.pos.x;
        var posY = sp.pos.y;
        //cria rua do spawn ate controller
        var control = sp.room.controller;
        var blocos = sp.pos.findPathTo(control.pos);
        for (var i = 1; i < blocos.length-1; i++) 
        {
            sp.room.createConstructionSite(blocos[i].x,blocos[i].y, STRUCTURE_ROAD);
        }
        
        //cria rua do spawn ate source
        var sources = sp.room.find(FIND_SOURCES);
        for (var j = 0; j < sources.length; j++)
        {
            var blocos = sp.pos.findPathTo(sources[j].pos);
            for (var i = 1; i < blocos.length-1; i++) 
            {
                sp.room.createConstructionSite(blocos[i].x,blocos[i].y, STRUCTURE_ROAD);
            }
        }
        
    }
}

//cria as ruas a partir dos creeps, ate o source e spawns
function criarRuasSources(){
    for(var spName in Game.spawns){
        var sp = Game.spawns[spName];
        var posX  = sp.pos.x;
        var posY = sp.pos.y;
        var sources = sp.room.find(FIND_SOURCES);
		var creeps = sp.room.find(FIND_CREEPS);
		
		
	//cria caminho do creep ate source
        for (var j = 0; j < sources.length; j++)
        {
			for( var k=0; k<creeps.length; k++){
				var blocos = creeps[k].pos.findPathTo(sources[j].pos);
				for (var i = 0; i < blocos.length; i++) 
				{
					console.log("teste");
					sp.room.createConstructionSite(blocos[i].x,blocos[i].y, STRUCTURE_ROAD);
				}
			}
        }
        //cria caminho do creep ate spawn
		for (var k=0; k<creeps.length; k++)
        {
			var blocos = creeps[k].pos.findPathTo(sp.pos);
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
        Game.rooms[sp.room.name].createConstructionSite(posX-1, posY+1, STRUCTURE_EXTENSION);
        
        
        Game.rooms[sp.room.name].createConstructionSite(posX-2, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX-2, posY+1, STRUCTURE_EXTENSION);
        
        Game.rooms[sp.room.name].createConstructionSite(posX-3, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX-3, posY+1, STRUCTURE_EXTENSION);
        
        
        Game.rooms[sp.room.name].createConstructionSite(posX-4, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX-4, posY+1, STRUCTURE_EXTENSION);
        
        
        Game.rooms[sp.room.name].createConstructionSite(posX-5, posY-1, STRUCTURE_EXTENSION);
        Game.rooms[sp.room.name].createConstructionSite(posX-5, posY+1, STRUCTURE_EXTENSION);
        
        
        Game.rooms[sp.room.name].createConstructionSite(posX-1, posY+3, STRUCTURE_CONTAINER);
        Game.rooms[sp.room.name].createConstructionSite(posX-2, posY+3, STRUCTURE_CONTAINER);
        Game.rooms[sp.room.name].createConstructionSite(posX-3, posY+3, STRUCTURE_CONTAINER);
        Game.rooms[sp.room.name].createConstructionSite(posX-4, posY+3, STRUCTURE_CONTAINER);
        Game.rooms[sp.room.name].createConstructionSite(posX-5, posY+3, STRUCTURE_CONTAINER);
        
    }
}

module.exports = {
    init: inicializarSpawn,
    ruas: criarRuasSources
}

module.exports.loop = function () {
	//Declara��o de variaveis
	var nomeSpawn = "Spawn1";
    var superharvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'superharvester');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var sourcesTemp = Game.spawns[nomeSpawn].room.find(FIND_SOURCES);
	var quantSources = sourcesTemp.length;
    var quantBuilder=3;
    var quantHarvester = 6;
    var quantSuperHarvester = quantSources;
    var quantUpgrader= 1;
	var totalUpgrader=4;
	
	//funcao que serve para criar ruas dinamicamente conforme o movimento dos creeps
	/*if(criaruastempo == 1000){
		criarRuasSources();
		criarruastempo=0;
		console.log("Cria ruas");
	}
	else{
		criaruastempo+=1;
	}*/
	
	
	
	
	//funcao que inicializa, no momento so serve para criar as baterias
    if(inicial){
        //remove as ruas criadas a serem criadas
    	
    	var thisRoom = Game.spawns["Spawn1"].room;
    	var constructionSites = thisRoom.find(FIND_CONSTRUCTION_SITES);
    		for (var siteName of constructionSites) {
    	  if (siteName.structureType == STRUCTURE_ROAD) {
    		 siteName.remove();
    	 }
    	}
        inicial=false;
        inicializarSpawn(nomeSpawn);
        criarRuas();
    }
	
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
	
    console.log('Upgrader: ' + upgraders.length);
    console.log('Harvesters: ' + harvesters.length);
    console.log('Super-Harvesters: ' + superharvester.length);
    console.log('Builders: ' +builders.length);
    
    if(superharvester.length < quantSuperHarvester && bodyCost([WORK,WORK,WORK,WORK,WORK,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Super-Harvester' + Game.time;
        console.log('Spawning new super-harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE], newName, {memory: {role: 'superharvester'}});
        
    } 
	else if(superharvester.length < quantSuperHarvester && bodyCost([WORK,WORK,WORK,WORK,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Super-Harvester' + Game.time;
        console.log('Spawning new super-harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE], newName, {memory: {role: 'superharvester'}});
        
    } 
	else if(superharvester.length < quantSuperHarvester && bodyCost([WORK,WORK,WORK,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Super-Harvester' + Game.time;
        console.log('Spawning new super-harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE], newName, {memory: {role: 'superharvester'}});
        
    } 
    if(superharvester.length>=quantSources && bodyCost([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Carry Harvester' + Game.time;
        console.log('Spawning new carry harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
		quantBuilder=totalUpgrader;
        
    }
	else if(superharvester.length>=quantSources && bodyCost([CARRY,CARRY,CARRY,CARRY,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Carry Harvester' + Game.time;
        console.log('Spawning new carry harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
		quantBuilder=totalUpgrader;
        
    }
	else if(superharvester.length>=quantSources && bodyCost([CARRY,CARRY,CARRY,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Carry Harvester' + Game.time;
        console.log('Spawning new carry harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
		quantBuilder=totalUpgrader;
        
    }
    else if(harvesters.length+superharvester.length*2 < quantHarvester && bodyCost([WORK,CARRY,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
        
    }
    else if(upgraders.length < quantUpgrader && harvesters.length+superharvester.length*2 > quantHarvester/2 && bodyCost([WORK,CARRY,MOVE])<=Game.spawns[nomeSpawn].energy) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        var sources = Game.spawns[nomeSpawn].room;
        if(sources.energyAvailable>=bodyCost([WORK,CARRY,MOVE,MOVE])){
            Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
        }
        else{
            Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
        }
    }

    else if(builders.length < quantBuilder && bodyCost([WORK,CARRY,MOVE])<=Game.spawns[nomeSpawn].energy && Game.constructionSites.length!=0) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[nomeSpawn].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
    }
    
    if(Game.spawns[nomeSpawn].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns[nomeSpawn].spawning.name];
        Game.spawns[nomeSpawn].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[nomeSpawn].pos.x + 1, 
            Game.spawns[nomeSpawn].pos.y, 
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
