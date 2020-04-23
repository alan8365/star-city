var index_controller = require("../controllers/indexController");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('gameroom', {title: 'Express'});
});

router.post('/index/create', index_controller.create_game_room);

module.exports = router;
