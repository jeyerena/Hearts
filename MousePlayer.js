var MousePlayer = function (name, ui_div) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var ui_message_log = $("<div class='text_player_message_log'></div>");
    var play = $(ui_div);
    $(ui_div).append(ui_message_log);

    this.setupMatch = function (hearts_match, pos) {
        match = hearts_match;
        position = pos;
    };

    this.getName = function () {
        return name;
    };

    var clicked = [];
    this.setupNextGame = function (game_of_hearts, pkey) {
        current_game = game_of_hearts;
        player_key = pkey;

        var get_score = function(){
            var scores = match.getScoreboard();
            var board = $("#score");
            board.empty();
            board.append("<div class='text_player_message'>Score:<ul>" +
                "<a class='player'>" + match.getPlayerName(Hearts.NORTH) + ": " + scores[Hearts.NORTH] + "\t</a>" +
                "<a class='player'>" + match.getPlayerName(Hearts.EAST) + ": " + scores[Hearts.EAST] + "\t</a>" +
                "<a class='player'>" + match.getPlayerName(Hearts.SOUTH) + ": " + scores[Hearts.SOUTH] + "\t</a>" +
                "<a class='player'>" + match.getPlayerName(Hearts.WEST) + ": " + scores[Hearts.WEST] + "</a>" +
                "</ul></div>");
        };
        
        var clear_score = function () {
            var scores = match.getScoreboard();
            var board = $("#score");
            board.empty();
            board.append("<div class='text_player_message'>Score:<ul>" +
                "<a class='player'>" + match.getPlayerName(Hearts.NORTH) + ": " + '0' + "\t</a>" +
                "<a class='player'>" + match.getPlayerName(Hearts.EAST) + ": " + '0' + "\t</a>" +
                "<a class='player'>" + match.getPlayerName(Hearts.SOUTH) + ": " + '0' + "\t</a>" +
                "<a class='player'>" + match.getPlayerName(Hearts.WEST) + ": " + '0' + "</a>" +
                "</ul></div>");
        };

        game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
            get_score();
            $("#act").empty().append('Pass 3 Cards');
            play.empty();
            play.append($("<div class='text_player_message'>" + e.toString() + "</div>"));

            var hand = current_game.getHand(player_key);
            hand = hand.getDealtCards(player_key);
            var dealt_list = $("<div id='Hand'></div>");

            //break this out into its own function?
            hand.forEach(function (card) {
                var dealtCard = $("<div id='" + card.toString() + "'>" + card.toString() + '</div>');
                dealt_list.append(dealtCard);
                dealtCard.click(function () {
                    var picked = false;
                    // var clicked = [];
                    clicked.forEach(function (select) {
                        if (select == card) {
                            clicked.splice(clicked.indexOf(card), 1);
                            picked = true;
                        }
                    });
                    //fix vars and booleans here
                    if (!picked) {
                        $(this).css('background-color', 'red');
                        $(this).css('color', 'white');
                        $(this).data('card', card);
                        clicked.push(card);
                        if (clicked.length == 3) {
                            current_game.passCards(clicked, player_key);
                            clicked = [];
                        }
                    } else {
                        $(this).css('background-color', '');
                        $(this).css('color', '');
                    }
                });
            });
            play.append(dealt_list);
        });
        
        var get_playable = function () {
            var hand = current_game.getHand(player_key);
            hand = hand.getUnplayedCards(player_key);
            var dealt_list = $("<div id='>Hand'></div>");
            hand.forEach(function (card) {
                var dealtCard = $("<div id='" + card.toString() + "'>" + card.toString() + "</div>");
                dealt_list.append(dealtCard);
                var playable = current_game.getHand(player_key).getPlayableCards(player_key);
                var isPlayable = false;
                playable.forEach(function (pla) {
                    if (card == pla) {
                        isPlayable = true;
                    }
                });
                if (isPlayable) {
                    dealtCard.css('background-color', 'blue');
                    dealtCard.css('color', 'white');
                    dealtCard.click(function () {
                        current_game.playCard(card, player_key);
                        $('#' + position.toLowerCase()).empty().append('NORTH:<br>' + card.toString());
                    });
                }
            });
            play.append(dealt_list);
        };

        game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
            if (e.getStartPos() == position) {
                $('#act').empty().append('Your Turn');
            }
            play.empty();
            play.append($("<div class='text_player_message'>" + e.toString() + '</div>'));
            get_playable();
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
            if (e.getNextPos() == position) {
                $('#act').empty().append('Your Turn');
            }
            play.empty();
            play.append($("<div class='text_player_message'>" + e.toString() + '</div>'));
            get_playable();
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
            get_score();
            setTimeout(function () {
                var player = $('#' + e.getTrick().getWinner().toLowerCase());
                player.css('background-color', 'blue');
                player.css('color', 'white');
                player.append(' wins trick');
                setTimeout(function () {
                    player.css('background-color', '');
                    player.css('color', '');
                    $('#north').empty().append('NORTH:');
                    $('#east').empty().append('EAST:');
                    $('#west').empty().append('WEST:');
                    $('#south').empty().append('SOUTH:');
                }, 1000);
            }, 1000);
        });

        game_of_hearts.registerEventHandler(Hearts.GAME_OVER_EVENT, function(){
            get_score();
        });
    }
};