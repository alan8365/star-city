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
            let player = player_list[i];
            let on_load_btn = $(".on-load:nth(" + i + ")");
            let player_name = $(".player-name:nth(" + i + ")");
            let join_game_btn = $(".join-game:nth(" + i + ")");

            on_load_btn.hide();
            join_game_btn.show();

            if (player == null) {
                if (main_player_pos === -1)
                    join_game_btn.prop('disabled', false);
                player_name.text('name');
            } else {
                switch (gameroom.turn) {
                    case "waiting":
                        join_game_btn.prop('disabled', true);

                        player_name.text(player.name);

                        on_load_btn.show();
                        join_game_btn.hide();
                        on_load_btn.prop('disabled', true);

                        if (player.is_on_load) {
                            on_load_btn.prop('disabled', true);
                            on_load_btn.text("");
                            on_load_btn.append($("<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>"));
                        } else if (i === main_player_pos) {
                            player_name.addClass('main-player');
                            on_load_btn.prop('disabled', false);
                        }
                        break;
                    case "betting":
                        on_load_btn.hide();
                        break;
                    case "standing":
                        break;
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

    let $join_game_btn = $(".join-game");
    let $on_load_btn = $(".on-load");

    socket.on("init", function (new_player, this_gameroom) {
        player = new_player;
        gameroom = this_gameroom;

        gameroom_display = new GameroomDisplay(gameroom, player);
    });

    socket.on("refresh", function (new_player, this_gameroom) {
        gameroom = this_gameroom;
        gameroom_display.origin_game_room = this_gameroom;
    });

    $join_game_btn.on('click', function () {
        $join_game_btn.prop("disabled", true);
        $(this).hide();

        let btn_pos = $(this).data('pos');
        socket.emit('join-game', btn_pos);

        $(".on-load:nth(" + btn_pos + ")").show();
    });

    $on_load_btn.on('click', function () {
        socket.emit('on-load')
    });
});

function reset() {
    socket.emit('reset');
}