var IdentityThing = require("./identity").IdentityThing;

class Player extends IdentityThing {
    constructor(props, context) {
        super(props, context);

        this.card_list = [];
        this.name = this.id.slice(-4);
        this.is_on_load = false;
    }
}

class Dealer {
    constructor() {

    }

}

exports.Player = Player;