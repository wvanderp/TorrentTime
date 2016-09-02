var net = require("net");
var utils = require("./utils.js");
var settings = require("./settings.js");
var peers = require("./peerList.js");

var log = utils.log;

// --------------------------------------------------------------------------------------
// SOCKET STUFF

var server = net.createServer(function(socket){

    log("socket connection from: " + socket.remoteAddress + ":" + socket.remotePort);

    socket.on('data', function(data){
        //log("receved: ", data);
        data = data.toString();

        parseData(socket, data);
    });

    socket.on('close', function(){
        log("CLOSED: " + socket.remoteAddress + ":" + socket.remotePort);
    });
});

server.listen(settings.port);

function parseData(socket, data){
    try {
        var json = JSON.parse(data);
    }catch (e){
        //log("that is no json");
        //log(e);
        return;
    }

    if (json.type == "hallo"){
        log("hallo from ", socket.remoteAddress, ":", socket.remotePort);

        if(peers.find(json.message.id)){
            peers.resetTTL(json.message.id);
        }else{
            peers.add(socket.remoteAddress, json.message.port, json.message.id);
        }

        var ret = {"type": "halloAnswer", "message": {"id": settings.id, "port": settings.port}};
        socket.write(JSON.stringify(ret));

        return;
    }

    if (json.type == "peers"){
        log("peers from ", socket.remoteAddress, ":", socket.remotePort);
        var ret = {"type": "peersAnswer", "message": {"peerlist": peers.getList()}};
        socket.write(JSON.stringify(ret));
        return;
    }

    if (json.type == "request"){
        log("request from ", socket.remoteAddress, ":", socket.remotePort);
        var ret = {"type": "requestAnswer", "message": "unimplemented"};
        socket.write(JSON.stringify(ret));
        return;
    }

    if (json.type == "goodbye"){
        //TODO: remove peer from db when goodbye
        log("goodbye from ", socket.remoteAddress, ":", socket.remotePort);
        var ret = {"type": "goodbyeAnswer", "message": {}}; // this is done
        socket.write(JSON.stringify(ret));
        return;
    }

    if (json.type == "halloAnswer"){
        log("halloAnswer from ", socket.remoteAddress, ":", socket.remotePort);

        if(peers.find(json.message.id)){
            peers.resetTTL(json.message.id);
        }else{
            peers.add(socket.remoteAddress, json.message.port, json.message.id);
        }

        return;
    }

    if (json.type == "peersAnswer"){
        log("peersAnswer from ", socket.remoteAddress, ":", socket.remotePort);

        //log(json.message.peerlist);

        peers.mergeIn(json.message.peerlist);

        return;
    }

    if (json.type == "requestAnswer"){
        //TODO: make the reqest function
        log("requestAnswer from ", socket.remoteAddress, ":", socket.remotePort);

        return;
    }

    if (json.type == "goodbyeAnswer"){
        //NOTE: noting to do here
        log("goodbyeAnswer from ", socket.remoteAddress, ":", socket.remotePort);

        return;
    }
}

function sendMessage(ip , port, message){
    var client = new net.Socket();

    client.connect(port, ip, function() {
        log('Connected to ', ip, ":", port);
    });

    client.write(message);

    client.on('data', function(data) {
        parseData(client, data);
        client.destroy();
    });


    client.on('timeout', function(data) {
        log('connection timed out');
        log("on ", ip, ":", port);
        client.destroy();
    });

    client.on('error', function(error) {
        client.destroy();
        throw error;
        //log('connection timed out');

    });


    client.on('close', function() {
        log('Connection closed');
    });

}

// --------------------------------------------------------------------------------------
// FUNCTION CALLS
// HALLO
function hallo2All(){
    var list = peers.getList();

    for(var i in list){
        halloById(list[i].id);
    }
}

function halloById(id){
    var peer = peers.find(id);
    var ip = peer.ip;
    var port = peer.port;

    halloByIp(ip,port);
}

function halloByIp(ip, port){
    try{
        sendMessage(ip, port, JSON.stringify(
            {"type": "hallo", "message": {"id": settings.id, "port": settings.port}}
        ));
    }catch (err){
        log(err);
    }
}

//PEERS
function peers2All(){
    var list = peers.getList();

    for(var i in list){
        peersById(list[i].id);
    }
}

function peersById(id){
    var peer = peers.find(id);
    var ip = peer.ip;
    var port = peer.port;

    peersByIp(ip,port);
}

function peersByIp(ip, port){
    sendMessage(ip, port, JSON.stringify({"type": "peers", "message": {}}));
}

// --------------------------------------------------------------------------------------
// TIMERS
//check for new hallos
//setInterval(function(){
//    var timestamp = utils.timestamp();
//    var list = peers.getList();
//
//    for(var i in list){
//        var peer = list[i];
//
//        if(peer.TTL < timestamp){
//            halloById(peer.id);
//            setTimeout(function(id){
//                var peer = peers.find(id);
//                if(peer.TTL < utils.timestamp()){
//                    peers.remove(id);
//                }
//            }, 1000, peer.id)
//        }
//    }
//}, 10000);

setInterval(function() {
    log("--------------------------------------------------");
    for(var i in peers.getList()){
        log(peers.getList()[i].ip);
    }
}, 3000);

setInterval(function(){
    hallo2All();
    peers2All();
}, 10000);


// --------------------------------------------------------------------------------------
// TEST CODE

halloByIp("188.166.67.38" , 8888);
