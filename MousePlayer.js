/*var MousePlayer = function (name, ui_div) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var ui_message_log = $('<div class='text_player_message_log'></div>');
    var play = $(ui_div)
    
    $(ui_div).append(ui_message_log)

    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
    }
    
    this.getName = function () {
	return name;
    }
    
    this.setupNextGame = function (game_of_hearts, pkey) {
	current_game = game_of_hearts;
	player_key = pkey;
	
	game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
	var board  = match.getScoreboard()
    $('#act').empty().append('North: Pass 3 Cards');
    
	
	
	}
	
	
	}

}*/
var MousePlayer = function (name, ui_div) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;
    var selectedCards = []

    var ui_message_log = $("<div class='text_player_message_log'></div>");
    var play = $(ui_div)
    $(ui_div).append(ui_message_log)

    this.setupMatch = function (hearts_match, pos) {
        match = hearts_match;
        position = pos;
        


    }

    var message_log_append = function (msg) {
        ui_message_log.append($(msg));
        ui_message_log.scrollTop(ui_message_log.prop('scrollHeight') - ui_message_log.height());
    }

    this.getName = function () {
        return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
        current_game = game_of_hearts;
        player_key = pkey;
        game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
            var sb = match.getScoreboard();
            $("#act").empty().append('Pass 3 Cards');
            $("#score").empty().append("<div class='text_player_message'>Scoreboard:<ul>" +
				"<li>North" + match.getPlayerName(Hearts.NORTH) + ": " +
				sb[Hearts.NORTH] + "</li>" +
				"<li>East" + match.getPlayerName(Hearts.EAST) + ": " +
				sb[Hearts.EAST] + "</li>" +
				"<li>South" + match.getPlayerName(Hearts.SOUTH) + ": " +
				sb[Hearts.SOUTH] + "</li>" +
				"<li>West" + match.getPlayerName(Hearts.WEST) + ": " +
				sb[Hearts.WEST] + "</li>" +
				"</ul></div>");
            play.empty().append($("<div class='text_player_message'>" + e.toString() + "</div>"));
            var dealt = current_game.getHand(player_key).getDealtCards(player_key);
            var dealt_list = $("<div id='cardList'></div>");
            dealt.forEach(function (c) {
                f = $("<div id='" + c.toString() + "'>" + c.toString() + '</div>');
                dealt_list.append(f)
                f.click(function () {
                    var x = true;
                    selectedCards.forEach(function (m) {
                        if (m == c) {
                            x = false;
                            selectedCards.splice(selectedCards.indexOf(c), 1);
                        }
                    })
                    if (x) {
                        $(this).css('background-color', 'red')
                       // $(this).css('color', 'white')
                        $(this).data('card', c)
                        selectedCards.push(c)
                        if (selectedCards.length == 3) {
                            current_game.passCards(selectedCards, player_key);
                            selectedCards = [];
                        }
                    } else {
                        $(this).css('background-color', '')
                        //$(this).css('color', '')
                    }

                });
            });
            play.append(dealt_list);
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
            if (e.getStartPos() == position) {
                $('#act').empty().append('Your Turn');
            }
            play.empty()
            play.append($("<div class='text_player_message'>" + e.toString() + '</div>'));
            dealt = current_game.getHand(player_key).getUnplayedCards(player_key);
            var dealt_list = $("<div id='>cardList'></div>");
            dealt.forEach(function (c) {
                f = $("<div id='" + c.toString() + "'>" + c.toString() + "</div>");
                dealt_list.append(f)
                var playable = current_game.getHand(player_key).getPlayableCards(player_key);
                var z = false;
                playable.forEach(function (m) {
                    if (c == m) {
                        z = true;
                    }
                });

                if (z && e.getStartPos() == position) {
                    f.css('background-color', 'blue');
                    f.css('color', 'white')
                    f.click(function () {
                        current_game.playCard(c, player_key);
                        $('#act').empty().append('North:');
                        $('#' + position.toLowerCase()).empty().append('NORTH:<br/>' + c.toString());
                    });
                }
            });
            play.append(dealt_list);
        });
        game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
            if (e.getNextPos() == position) {
                $('#act').empty().append('North: It is currently your turn');
            }
            play.empty()
            play.append($('<div class='text_player_message'\'>' + e.toString() + '</div>'));
            dealt = current_game.getHand(player_key).getUnplayedCards(player_key);
            var dealt_list = $("<div id='>cardList'></div>');
            dealt.forEach(function (c) {
                f = $("<div id='>" + c.toString() + "'>" + c.toString() + '</div>');
                dealt_list.append(f)
                var playable = current_game.getHand(player_key).getPlayableCards(player_key);
                var z = false;
                playable.forEach(function (m) {
                    if (c == m) {						z = true;
                    }
                });

                if (z && e.getNextPos() == position) {
                    f.css('background-color', 'blue')
                    f.css('color', 'white')
                    f.click(function () {
                        current_game.playCard(c, player_key);
                        $('#act').empty().append('North:');
                        $('#' + position.toLowerCase()).empty().append('NORTH:<br/>' + c.toString());
                    });
                }
            });
            play.append(dealt_list);
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
            setTimeout(function () {
                var winner = $('#' + e.getTrick().getWinner().toLowerCase());
                winner.css('background-color', 'red');
                winner.css('color', 'white')
                winner.append('<br/>WON TRICK');
                setTimeout(function () {
                    winner.css('background-color', '');
                    winner.css('color', '')
                    $('#north').empty().append('NORTH:');
                    $('#east').empty().append('EAST:');
                    $('#west').empty().append('WEST:');
                    $('#south').empty().append('SOUTH:');
                }, 1000);
            }, 200);
        });
    }
}
