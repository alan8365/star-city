var IdentityThing = require("./identity").IdentityThing;

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
                player.card_list.push(this.card_deck.pop());
            }
        })
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
                this.turn = "betting";
                break;
            default:
                this.turn = "waiting";
                break;
        }
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
}

exports.Gameroom = Gameroom;