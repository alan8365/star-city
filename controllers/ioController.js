var Player = require("./playerController").Player;
var gameroom = require("./indexController").gameroom;
var Gameroom = require("./gameroomController").Gameroom;


exports.on_connection = function (socket) {
    let player_pos;
    let player = new Player();
    console.log('a user connected');
    socket.emit("init", player, gameroom);

    socket.on('join-game', (new_player_pos) => {
        if (gameroom.player_list[new_player_pos] == null) {
            gameroom.player_list[new_player_pos] = player;
            player_pos = new_player_pos;
        }

        this.emit("refresh", player, gameroom);
    });

    socket.on('on-load', () => {
        player.is_on_load = true;

        if (gameroom.is_all_on_load()) {
            gameroom.next_turn();
        }

        this.emit("refresh", player, gameroom);
    });

    socket.on('stack-in', (stack) => {
        player.stack = stack;

        console.log(gameroom);

        if (gameroom.is_all_bet_in()) {
            gameroom.next_turn();
        }

        this.emit("refresh", player, gameroom);
    })

    socket.on('call', () => {
        if (player.score < 10.5) {
            player.get_card(gameroom.card_deck.pop());
        }

        if (gameroom.is_all_player_over()) {
            gameroom.next_turn();
        }

        this.emit("refresh", player, gameroom);
    })

    socket.on('stand', () => {
        player.is_stand = true;

        if (gameroom.is_all_player_over()) {
            gameroom.next_turn();
        }

        this.emit("refresh", player, gameroom);
    })

    socket.on('reset', () => {
        gameroom = new Gameroom;

        this.emit('reset');
    });

    socket.on("disconnect", () => {
        console.log(player_pos);
        gameroom.player_list[player_pos] = null;
        console.log(gameroom);
        console.log(player.name + " go out");

        this.emit("refresh", player, gameroom);
    });
};