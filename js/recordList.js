var ipLib = require("ip");
var _ = require("lodash");
// mbid, [resources]
var list = [];

function add(){
    list.push({"ip": ip, "port": port, "id": id, "TTL": timestamp})
}

function find(id){
    var index = getIndexById(id);
    if(index === null){
        return false;
    }else{
        return list[index];
    }
}

function remove(id){
    var index = getIndexById(id);
    list.splice(index,1);
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
function getList(){
    return list;
}

module.exports = {
    "add": add,
    "find": find,
    "remove": remove,
    "resetTTL": resetTTL,
    "findByIp": findByIp,
    "getList": getList
};