var IdentityThing = require("./identity").IdentityThing;

class Player extends IdentityThing {
    constructor(props, context) {
        super(props, context);

        this.money = 2000;
        this.name = this.id.slice(-4);

        this.reset_in_game();
    }

    get_card(card) {
        if (this.score < 10.5) {
            this.card_list.push(card);

            let card_number = parseInt(card.slice(1));

            if (card_number > 10) {
                this.score += 0.5;
            } else {
                this.score += card_number;
            }

            if (this.score > 10.5) {
                this.is_busted = true;
            } else if (this.score === 10.5 || this.card_list.length >= 5) {
                this.is_win = true;
            }
        }
    }

    get_pay(rate) {
        this.money += this.stack * rate;
    }

    is_set_over() {
        return this.is_stand || this.is_busted || this.is_win;
    }

    reset_in_game() {
        this.score = 0;
        this.stack = null;
        this.is_win = false;
        this.card_list = [];
        this.is_stand = false;
        this.is_busted = false;
        this.is_on_load = false;
    }

    set stack(new_stack) {
        if (new_stack != null) {
            this.money -= new_stack;
        }

        this._stack = new_stack;
    }

    get stack() {
        return this._stack;
    }
}

class Dealer {
    constructor() {

    }
}

exports.Player = Player;