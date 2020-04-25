var Gameroom = require('./gameroomController').Gameroom

var gameroom = new Gameroom();

exports.create_game_room = function (req, res) {
    res.render('gameroom', {game_room_id: gameroom.id});
};

exports.gameroom = gameroom;