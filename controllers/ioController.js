var Player = require("./playerController").Player;
var gameroom = require("./indexController").gameroom;


exports.on_connection = function (socket) {
    let player_pos;
    let player = new Player();
    console.log('a user connected');
    socket.emit("init", player, gameroom);

    socket.on('join-game', (new_player_pos) => {
        if (gameroom.player_list[new_player_pos] == null) {
            gameroom.player_list[new_player_pos] = player;
            player_pos = new_player_pos
        }

        this.emit("refresh", player, gameroom);
    })

    socket.on("disconnect", () => {
        console.log(player_pos);
        gameroom.player_list[player_pos] = null;
        console.log(gameroom)
        console.log(player.name + " go out");

        this.emit("refresh", player, gameroom);
    });
}