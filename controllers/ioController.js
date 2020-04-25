var Player = require("./playerController").Player;
var gameroom = require("./indexController").gameroom;

exports.on_connection = function (socket) {
    let player = new Player();
    console.log('a user connected');
    socket.emit("init", player, gameroom);

    socket.on("disconnect", () => {
        console.log("a user go out");
    });
}