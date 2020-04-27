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
            let bet_btn = $(".bet-btn:nth(" + i + ")");
            let call_btn = $(".call-btn:nth(" + i + ")");
            let stand_btn = $(".stand-btn:nth(" + i + ")");
            let bet_input = $(".bet-input:nth(" + i + ")");
            let on_load_btn = $(".on-load:nth(" + i + ")");
            let loading_btn = $(".loading:nth(" + i + ")");
            let continue_btn = $(".continue:nth(" + i + ")");
            let player_name = $(".player-name:nth(" + i + ")");
            let join_game_btn = $(".join-game:nth(" + i + ")");
            let player_pocket = $(".player-pocket:nth(" + i + ")");

            on_load_btn.hide();
            join_game_btn.show();

            if (player == null) {
                if (main_player_pos === -1)
                    join_game_btn.prop('disabled', false);
                player_name.text('name');
            } else {
                this.player_card_deck_update(player, i);
                this.dealer_card_deck_update();

                switch (gameroom.turn) {
                    case "waiting":
                        join_game_btn.prop('disabled', true);

                        player_name.text(player.name);

                        continue_btn.hide();

                        player_pocket.show();
                        on_load_btn.show();
                        join_game_btn.hide();
                        on_load_btn.prop('disabled', true);

                        if (player.is_on_load) {
                            on_load_btn.prop('disabled', true);
                            on_load_btn.hide();
                            loading_btn.show();
                        } else if (i === main_player_pos) {
                            player_name.addClass('main-player');
                            on_load_btn.prop('disabled', false);
                            bet_btn.prop('disabled', false);
                        }
                        break;
                    case "betting":
                        join_game_btn.hide();
                        continue_btn.hide();
                        loading_btn.hide();
                        bet_btn.show();

                        if (i === main_player_pos && player._stack == null) {
                            bet_input.show();
                            bet_btn.prop('disabled', false);
                        }

                        break;
                    case "standing":
                        join_game_btn.hide();
                        bet_btn.hide();
                        bet_input.hide();

                        call_btn.show();
                        stand_btn.show();

                        if (i === main_player_pos && !player.is_stand) {
                            call_btn.prop('disabled', false);
                            stand_btn.prop('disabled', false);
                        }

                        if (player.score >= 10.5 || player.card_list.length >= 5) {
                            call_btn.prop('disabled', true);
                            stand_btn.prop('disabled', true);
                        }
                        break;
                    case "dealer":
                        join_game_btn.hide();

                        call_btn.hide();
                        stand_btn.hide();

                        player_pocket.text('餘額:' + player.money);

                        continue_btn.show();

                        if (i === main_player_pos && !player.is_on_load) {
                            continue_btn.prop('disabled', false);
                        }
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

    player_card_deck_update(player, player_pos) {
        let $card_row = $(".card-row:nth(" + player_pos + ")");

        $(".card-row:nth(" + player_pos + ") > img:not(.card-area)").remove();

        if (player.card_list.length === 0) {
            for (let i = 1; i <= 5; i++) {
                $card_row.removeClass('card-row-' + i);
            }
        }

        player.card_list.forEach(e => {
            $card_row.append("<img class='position-absolute' src='images/cards/" + e + ".gif'>");
        })

        $card_row.addClass('card-row-' + player.card_list.length);
    }

    dealer_card_deck_update() {
        let $card_row = $(".card-row-dealer");
        let dealer = this.origin_game_room.dealer;

        $(".card-row-dealer > img:not(.card-area)").remove();

        dealer.card_list.forEach(e => {
            $card_row.append("<img class='position-absolute' src='images/cards/" + e + ".gif'>");
        })

        $card_row.addClass('card-row-' + dealer.card_list.length);
    }
}

$(document).ready(function () {
    socket = io.connect('ws://localhost:3000');

    let $bet_btn = $(".bet-btn");
    let $call_btn = $(".call-btn");
    let $stand_btn = $(".stand-btn");
    let $on_load_btn = $(".on-load");
    let $continue_btn = $(".continue");
    let $join_game_btn = $(".join-game");

    let $reset_world_btn = $("#reset-world");

    let main_player_pos;

    $bet_btn.prop('disabled', true);
    $call_btn.prop('disabled', true);
    $stand_btn.prop('disabled', true);
    $continue_btn.prop('disabled', true);

    socket.on("init", function (new_player, this_gameroom) {
        player = new_player;
        gameroom = this_gameroom;

        gameroom_display = new GameroomDisplay(gameroom, player);
    });

    socket.on("refresh", function (new_player, this_gameroom) {
        gameroom = this_gameroom;
        gameroom_display.origin_game_room = this_gameroom;
    });

    socket.on('reset', function () {
        location.reload();
    });

    $join_game_btn.on('click', function () {
        $join_game_btn.prop("disabled", true);
        $(this).hide();

        main_player_pos = $(this).data('pos');
        socket.emit('join-game', main_player_pos);

        $(".on-load:nth(" + main_player_pos + ")").show();
    });

    $on_load_btn.on('click', function () {
        socket.emit('on-load')
    });

    $bet_btn.on('click', function () {
        let $bet_input = $(".bet-input:nth(" + main_player_pos + ")");
        let stack = parseInt($bet_input.val());

        if (player.money < stack) {
            alert("還敢亂輸入阿");
        } else {
            $(this).prop('disabled', true);

            socket.emit('stack-in', stack);
        }
    })

    $call_btn.on('click', function () {
        socket.emit('call')
    })

    $stand_btn.on('click', function () {
        $(this).prop('disabled', true);
        $(".call-btn:nth(" + main_player_pos + ")").prop('disabled', true);

        socket.emit('stand')
    })

    $continue_btn.on("click", function () {
        $(this).prop('disabled', true);

        socket.emit('on-load');
    })

    $reset_world_btn.on('click', function () {
        console.log($(this));
        socket.emit('reset');
    })

    // TODO complete change name
    // $(".player-name").on('click', function () {
    //     let t = $(this).text();
    //     $(this).html($('<input>', {'value': t}).val(t));
    // })
});