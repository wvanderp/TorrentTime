var net = require("net");
var settings = require("./settings.js");
var peers = require("./peerlist.js");



var server = net.createServer(function(socket){

    console.log("socket made at: " + socket.remoteAddress + ":" + socket.remotePort);

    socket.on('data', function(socket, data){
        parseData(data);
    });

    socket.on('close', function(data){
        console.log("CLOSED: " + + socket.remoteAddress + ":" + socket.remotePort);
    });


});

server.listen(8888);


//{"type": "hallo", "message": {"peerlist": [{"ip": "1.1.1.1", "port":"8888"}, {"ip": "192.169.3.2", "port": "8888"}]}}

function parseData(socket, data) {
    try {
        var json = JSON.parse(data);
    }catch (e){
        console.log("that is no json");
        console.log(e);
        return;
    }

    if (json.type == "hallo"){
        var ret = {"type": "halloAnswer", "message": {"id": settings.id}};
        socket.write(JSON.stringify(ret));
    }

    if (json.type == "peers"){
        var ret = {"type": "peersAnswer", "message": {"peerlist": peers}};
        socket.write(JSON.stringify(ret));
    }

    if (json.type == "request"){
        var ret = {"type": "requestAnswer", "message": "unimplemented"};
        socket.write(JSON.stringify(ret));
    }

    if (json.type == "goodbye"){
        var ret = {"type": "goodbyeAnswer", "message": {}}; // this is done
        socket.write(JSON.stringify(ret));
    }

    if (json.type == "halloAnswer"){

    }

    if (json.type == "peersAnswer"){

    }

    if (json.type == "requestAnswer"){

    }

    if (json.type == "goodbyeAnswer"){

    }

}

