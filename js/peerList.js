// id, ip, port, ttl
var list = [];

function add(ip, port, id){
    list.push({"ip": ip, "port": port, "id": id, "TTL": 900})
}

function find(id){
    return list[getIndexById(id)];
}

function remove(id){
    var index = getIndexById(id);
    list.splice(index,1);
}

function resetTTL(id){
    var index = getIndexById(id);
}

function getIndexById(id){
    var i = 0;
    for(i in list){
        if(list[i].id == id){
            break;
        }
    }
    return i;
}

module.exports = {
    "add": add,
    "find": find,
    "remove": remove,
    "resetTTL": resetTTL
};