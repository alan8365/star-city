var IdentityThing = require("./identity").IdentityThing

class Gameroom extends IdentityThing {
    constructor(props, context) {
        super(props, context);

        let player_list = [];

        for (let i = 0; i < Gameroom.max_player_count; i++) {
            player_list.push(null);
        }

        this.player_list = player_list;
    }

    static get max_player_count() {
        return 5;
    }
}

exports.Gameroom = Gameroom;