var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/duel.ts"/>
    /// <reference path="../../models/entities/betting.ts"/>
    /// <reference path="../choosehand/chip.ts"/>
    /// <reference path="../../libs/typings/greensock.d.ts"/>
    (function (states) {
        var PlayerInfo = (function () {
            function PlayerInfo(root, playerInfo) {
                this.playerId = playerInfo.player.playerId;
                this.health = playerInfo.score;
                var playerElement = root.getElementsByClassName('player' + (this.playerId + 1))[0];
                this.iconElement = playerElement.getElementsByClassName('playericon')[0];
                this.nameElement = playerElement.getElementsByClassName('playername')[0];
                this.nameElement.innerText = playerInfo.player.name;
                this.healthElement = playerElement.getElementsByClassName('remainingHealth')[0];
                this.readyElement = playerElement.getElementsByClassName('playerready')[0];
                this.showReady(false);
                this.updateHealth();
            }
            PlayerInfo.prototype.showReady = function (show) {
                this.readyElement.style.visibility = show ? '' : 'hidden';
            };

            PlayerInfo.prototype.updateHealth = function () {
                this.healthElement.style.width = ((this.health / 5) * 100) + '%';
            };

            PlayerInfo.prototype.onTurnResult = function (winningPlayer) {
                this.showReady(false);
                if (winningPlayer && winningPlayer.playerId !== this.playerId) {
                    --this.health;
                    this.updateHealth();
                }
            };
            return PlayerInfo;
        })();

        var playerKeys = [];
        playerKeys[0] = [];
        playerKeys[1] = [];
        playerKeys[0][65] = models.entities.BetType.Left;
        playerKeys[0][87] = models.entities.BetType.Up;
        playerKeys[0][68] = models.entities.BetType.Right;
        playerKeys[0][83] = models.entities.BetType.Down;
        playerKeys[1][37] = models.entities.BetType.Left;
        playerKeys[1][38] = models.entities.BetType.Up;
        playerKeys[1][39] = models.entities.BetType.Right;
        playerKeys[1][40] = models.entities.BetType.Down;

        function removeClasses(classList, spaceDeliminiatedClassesToRemove) {
            var classesToRemove = spaceDeliminiatedClassesToRemove.split(" ");
            for (var i = 0, c = classesToRemove.length; i < c; ++i) {
                var classToRemove = classesToRemove[i];
                if (classList.contains(classToRemove)) {
                    classList.remove(classToRemove);
                }
            }
        }

        var Duel = (function () {
            function Duel(datacontext) {
                this.id = "views.states.Duel";
                this.scoreboardShown = false;
                this.datacontext = datacontext;
                this.layer = document.getElementById('duel-layer');
                this.showScoreboardButton = document.getElementById('toggle-scoreboard-button');
                this.players = [];
                var gamePlayers = datacontext.GetCurrentPlayers();
                this.players[0] = new PlayerInfo(this.layer, gamePlayers[0]);
                this.players[1] = new PlayerInfo(this.layer, gamePlayers[1]);

                this.countdownElement = document.getElementById('countdown');
                this.countdownElement.style.visibility = 'hidden';
                this.countdown = 3;
                this.currentTurn = 1;

                this.resetScoreboard();
                this.chips = [];
            }
            Duel.prototype.enter = function (previousState) {
                var _this = this;
                this.datacontext.turnReady.add(this.onTurnReady, this);
                this.datacontext.turnResult.add(this.onTurnResult, this);

                var that = this;
                this.showScoreboardButton.onclick = function (event) {
                    if (that.scoreboardShown) {
                        document.getElementById('scoreboard').style.top = '-300px';
                        that.showScoreboardButton.classList.remove('glyphicon-chevron-up');
                        that.showScoreboardButton.classList.add('glyphicon-chevron-down');
                    } else {
                        document.getElementById('scoreboard').style.top = '84px';
                        that.showScoreboardButton.classList.remove('glyphicon-chevron-down');
                        that.showScoreboardButton.classList.add('glyphicon-chevron-up');
                    }

                    _this.scoreboardShown = !_this.scoreboardShown;
                };

                var chips = this.layer.getElementsByClassName('chips')[0];
                for (var i = 0; i < 10; i++) {
                    var chip = new views.choosehand.Chip(models.entities.BetType.Unknown, x, -100, 10 + 10 * i);
                    var x = i % 2 == 0 ? -200 : 1000;
                    chips.appendChild(chip.element);
                    this.chips.push(chip);

                    TweenLite.to(chip.element, 0.5, { top: 440 - 10 * i, left: 338, delay: i * 0.05, ease: Cubic.easeOut });
                }

                document.onkeyup = function (event) {
                    _this.onKeyUp(event.keyCode);
                };

                window.setTimeout(this.flipNextChip.bind(this), 2000);
            };

            Duel.prototype.exit = function (nextState) {
                this.datacontext.turnReady.remove(this.onTurnReady, this);
                this.datacontext.turnResult.remove(this.onTurnResult, this);
                this.showScoreboardButton.onclick = null;
                document.onkeyup = null;
            };

            Duel.prototype.forEachTurnElement = function (turn, func) {
                var elements = document.getElementsByClassName("turn" + turn);
                for (var i = 0, c = elements.length; i < c; ++i) {
                    var element = elements[i];
                    func(element);
                }
            };

            Duel.prototype.resetScoreboard = function () {
                for (var i = 1; i < 11; ++i) {
                    this.forEachTurnElement(i, function (element) {
                        removeClasses(element.classList, 'past-turn current-turn');
                        if (element.classList.contains('rowplayer1') || element.classList.contains('rowplayer2') || element.classList.contains('rowactual')) {
                            var chip = element.getElementsByClassName('chip')[0];
                            removeClasses(chip.classList, 'up down left right');
                        } else if (element.classList.contains('rowwinner')) {
                            element.innerHTML = "";
                        }

                        if (i === 1) {
                            element.classList.add('current-turn');
                        }
                    });
                }
            };

            Duel.prototype.updateTurnInformation = function (bet1, bet2, betWin, playerWin) {
                this.forEachTurnElement(this.currentTurn, function (element) {
                    element.classList.remove('current-turn');
                    element.classList.add('past-turn');
                    if (element.classList.contains('rowplayer1')) {
                        var chip = element.getElementsByClassName('chip')[0];
                        chip.classList.add(views.choosehand.Chip.GetColor(bet1));
                    } else if (element.classList.contains('rowplayer2')) {
                        var chip = element.getElementsByClassName('chip')[0];
                        chip.classList.add(views.choosehand.Chip.GetColor(bet2));
                    } else if (element.classList.contains('rowactual')) {
                        var chip = element.getElementsByClassName('chip')[0];
                        chip.classList.add(views.choosehand.Chip.GetColor(betWin));
                    } else if (element.classList.contains('rowwinner')) {
                        if (playerWin !== null) {
                            // $TODO: put correct player image here
                            element.innerHTML = "" + (playerWin + 1);
                            //element.innerHTML = "<img class=\"profile-pic\" src =\"http://lorempixel.com/16/16\" />";
                        } else {
                            element.innerHTML = "&ndash;";
                        }
                    }
                });
                ++this.currentTurn;
                this.forEachTurnElement(this.currentTurn, function (element) {
                    element.classList.add('current-turn');
                });
            };

            Duel.prototype.onKeyUp = function (keyCode) {
                for (var playerId = 0; playerId < playerKeys.length; ++playerId) {
                    if (keyCode in playerKeys[playerId]) {
                        if (this.datacontext.MakeBet(playerId, playerKeys[playerId][keyCode])) {
                            this.players[playerId].showReady(true);
                        }
                    }
                }
            };

            Duel.prototype.onTurnReady = function () {
                if (this.countdown > 0) {
                    this.countdownElement.innerText = "" + this.countdown;
                    this.countdownElement.style.visibility = "";
                    --this.countdown;

                    // Kick off timer
                    var that = this;
                    window.setTimeout(function () {
                        that.onTurnReady();
                    }, 1000);
                } else {
                    this.countdownElement.style.visibility = "hidden";
                    this.countdown = 3;
                    this.datacontext.TakeTurn();
                }
            };

            Duel.prototype.onTurnResult = function (winningPlayer, betType, players) {
                for (var i = 0; i < this.players.length; ++i) {
                    this.players[i].onTurnResult(winningPlayer);
                }

                // Update turn information
                this.updateTurnInformation(players[0].currentBet, players[1].currentBet, betType, winningPlayer ? winningPlayer.playerId : null);

                this.datacontext.AdvanceGame();

                this.flipNextChip();
            };

            Duel.prototype.flipNextChip = function () {
                if (this.chips.length > 0) {
                    this.activeChip = this.chips.pop();
                    TweenLite.to(this.activeChip.element, .5, { top: -100, ease: Cubic.easeOut });
                    TweenMax.to(this.activeChip.element, 0.1, { scaleY: 0, yoyo: true, repeat: 8 });
                }
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=duel.js.map
