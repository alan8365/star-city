// TODO let the game wait until socket connect
socket = io.connect('ws://localhost:3000');

socket.on("init", function (player, gameroom) {
    if (gameroom.player_list.length >= 5) {
        $("#join-game").prop("disabled", true);
    }
})