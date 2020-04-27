var IdentityThing = require("./identity").IdentityThing;
var Player = require("./playerController").Player;

const suit_list = ['s', 'h', 'd', 'c'];

class Gameroom extends IdentityThing {
    constructor(props, context) {
        super(props, context);

        let player_list = [];

        for (let i = 0; i < Gameroom.max_player_count; i++) {
            player_list.push(null);
        }

        this.card_deck = this.init_card_deck();
        this.player_list = player_list;
        this.dealer = new Player();
        this.turn = 'waiting';
    }

    static get max_player_count() {
        return 5;
    }

    init_card_deck() {
        let card_deck = [];

        suit_list.forEach(function (e) {
            for (let i = 1; i <= 13; i++) {
                card_deck.push(e + i);
            }
        });

        card_deck.sort(() => Math.random() - 0.5);

        return card_deck;
    }

    init_deal_card() {
        this.player_list.forEach(player => {
            if (player != null) {
                player.get_card(this.card_deck.pop());
            }
        })

        this.dealer.get_card(this.card_deck.pop());
    }

    next_turn() {
        let turn = this.turn;

        switch (turn) {
            case "waiting":
                this.turn = "betting";
                this.card_deck = this.init_card_deck();
                this.init_deal_card();
                break;
            case "betting":
                this.turn = "standing";
                break;
            case "standing":
                this.turn = "dealer";

                this.dealer_acting();
                this.set_settle();

                this.player_list.forEach(e => {
                    if (e != null) {
                        e.is_on_load = false;
                    }
                })
                break;
            case "dealer":
                this.turn = "waiting"

                this.dealer.reset_in_game();
                this.player_list.forEach(e => {
                    if (e != null) {
                        e.reset_in_game();
                    }
                })

                // this.card_deck = this.init_card_deck();
                break;
            default:
                this.turn = "waiting";
                break;
        }
    }

    dealer_acting() {
        let maximum_score = 0;

        for (let i = 0; i < this.player_list.length; i++) {
            let player = this.player_list[i];

            if (player != null && player.is_stand) {
                maximum_score = player.score > maximum_score ? player.score : maximum_score;
            }
        }

        let dealer = this.dealer;

        while (dealer.score < maximum_score) {
            dealer.get_card(this.card_deck.pop());
        }
    }

    set_settle() {
        this.player_list.forEach(e => {
            if (e != null) {
                if (e.is_busted) {
                    return;
                } else if (e.is_win) {
                    e.get_pay(10);
                } else {
                    if (this.dealer.is_busted) {
                        e.get_pay(2);
                    }

                    if (this.dealer.score < e.score) {
                        e.get_pay(2);
                    }
                }
            }
        })
    }

    is_all_on_load() {
        if (this.player_list.every(e => e == null)) {
            return false;
        }

        for (let i = 0; i < Gameroom.max_player_count; i++) {
            let player = this.player_list[i];

            if (player != null && !player.is_on_load) {
                return false;
            }
        }

        return true;
    }

    is_all_bet_in() {
        for (let i = 0; i < Gameroom.max_player_count; i++) {
            let player = this.player_list[i];

            if (player != null && player.stack == null) {
                return false;
            }
        }

        return true;
    }

    is_all_player_over() {
        for (let i = 0; i < Gameroom.max_player_count; i++) {
            let player = this.player_list[i];

            if (player != null && !player.is_set_over()) {
                return false;
            }
        }

        return true;
    }
}

exports.Gameroom = Gameroom;