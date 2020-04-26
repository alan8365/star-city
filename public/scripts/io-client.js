// TODO let the game wait until socket connect
var player;
var gameroom;
var gameroom_display;

class GameroomDisplay {
    constructor(origin_game_room, main_player) {
        this.main_player = main_player;
        this.origin_game_room = origin_game_room;
    }

    get origin_game_room() {
        return this._origin_game_room;
    }

    set origin_game_room(gameroom) {
        console.log(gameroom);
        this._origin_game_room = gameroom;
        let player_list = gameroom.player_list.slice();
        let main_player_pos = this.get_player_index(this.main_player);

        for (let i = 0; i < 5; i++) {
            let join_game_btn = $(".join-game:nth(" + i + ")")
            let player_name = $(".player-name:nth(" + i + ")");
            let player = player_list[i];

            if (player == null) {
                join_game_btn.prop('disabled', false);
                player_name.text('name');
            } else {
                join_game_btn.prop('disabled', true);
                player_name.text(player.name);

                if (i === main_player_pos) {
                    player_name.addClass('main-player');
                }
            }
        }
    }

    get_player_index(player) {
        let player_list = this.origin_game_room.player_list.slice();

        for (let i = 0; i < player_list.length; i++) {
            if (player_list[i] != null && player_list[i].id === player.id) {
                return i;
            }
        }

        return -1;
    }
}

$(document).ready(function () {
    socket = io.connect('ws://localhost:3000');

    var $join_game_btn = $(".join-game");

    socket.on("init", function (new_player, this_gameroom) {
        player = new_player;
        gameroom = this_gameroom;

        gameroom_display = new GameroomDisplay(gameroom, player);
    })

    socket.on("refresh", function (new_player, this_gameroom) {
        gameroom = this_gameroom;
        gameroom_display.origin_game_room = this_gameroom;
    })

    $join_game_btn.on('click', function () {
        $join_game_btn.prop("disabled", true);

        let btn_pos = $(this).data('pos');
        socket.emit('join-game', btn_pos);
    });
})