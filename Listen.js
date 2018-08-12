var dgram = require("dgram");
var server = dgram.createSocket("udp4");

    server.on("message", function (msg, rinfo) {

    });
       
    server.on("listening", function () {
       
        });
        
        server.bind(20500);