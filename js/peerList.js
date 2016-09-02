var ipLib = require("ip");
var utils = require("./utils.js");

var log = utils.log;

// id, ip, port, ttl
var list = [];

function resetTTL(id){
    var index = getIndexById(id);
    var timestamp = Math.floor(Date.now() / 1000) + 900;

    list[index].TTL = timestamp;
}

function mergeIn(array){
    for(var i in array){
        var peer = array[i];

        var indexById = getIndexById(peer.id);
        var indexByIp = getIndexByIp(peer.ip);

        if((indexById === null && indexByIp === null)){
            add(peer.ip,peer.port, peer.id);
        }
    }
}
// --------------------------------------------------------------------------------------
// UTIL FUNCTIONS

function add(ip, port, id){
    if(isNaN(port)){
        console.log("port in not a number");
        return;
    }

    if( !(ipLib.isV4Format(ip) || ipLib.isV6Format(ip) ) ){
        console.log("ip in not an ip address");
        return;
    }

    var sha1Regex = new RegExp("/([a-f0-9]{40})/");

    //TODO: make sha1 check

    var timestamp = utils.timestamp() + 900;

    list.push({"ip": ip, "port": port, "id": id, "TTL": timestamp})
}

function remove(id){
    var index = getIndexById(id);
    list.splice(index,1);
}

// --------------------------------------------------------------------------------------
// SEARCH FUNCTIONS

function find(id){
    var index = getIndexById(id);
    if(index === null){
        return false;
    }else{
        return list[index];
    }
}

function findByIp(ip){
    var index = getIndexByIp(ip);
    if(index === null){
        return false;
    }else{
        return list[index];
    }
}

function getIndexById(id){
    var i = 0;
    var j = -1;
    for(i in list){
        if(list[i].id === id){
            j = 1;
            break;
        }
    }
    if(j > 0){
        return i;
    }else{
        return null;
    }
}

function getIndexByIp(ip){
    var i = 0;
    var j = -1;
    for(i in list){
        if(list[i].ip === ip){
            j = 1;
            break;
        }
    }
    if(j > 0){
        return i;
    }else{
        return null;
    }
}

// --------------------------------------------------------------------------------------
// GETTER
function getList(){
    return list;
}

module.exports = {
    "add": add,
    "find": find,
    "remove": remove,
    "resetTTL": resetTTL,
    "findByIp": findByIp,
    "getList": getList,
    "mergeIn":mergeIn
};