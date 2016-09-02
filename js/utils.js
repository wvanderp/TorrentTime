function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var log = console.log;

function timestamp(){
    return Math.floor(Date.now() / 1000);
}

module.exports = {
    "getRandomInt": getRandomInt,
    "timestamp": timestamp,
    "log": log
};