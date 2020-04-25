var IdentityThing = require("./identity").IdentityThing

class Gameroom extends IdentityThing {
    constructor(props, context) {
        super(props, context);

        this.player_list = [];
    }
}

exports.Gameroom = Gameroom;