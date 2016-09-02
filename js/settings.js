var sha1 = require("sha1");
var utils = require("./utils.js");
var type = require("../type.js");

if (type == "client"){
    port = utils.getRandomInt(49152, 65535);
}else{
    port = 8888;
}

var settings = {
    "id": sha1(utils.getRandomInt(1, 1000000000)),
    "port": port
};

// --------------------------------------------------------------------------------------
// EXPORTS

module.exports = settings;