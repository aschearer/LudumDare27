var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/duel.ts"/>
    /// <reference path="../../models/entities/betting.ts"/>
    /// <reference path="../choosehand/chip.ts"/>
    /// <reference path="../../libs/typings/greensock.d.ts"/>
    /// <reference path="../../libs/typings/jquery/jquery.d.ts"/>
    /// <reference path="../../libs/typings/jquery/jqueryui.d.ts"/>
    (function (states) {
        var PlayerInfo = (function () {
            function PlayerInfo(root, playerInfo) {
                this.playerId = playerInfo.player.playerId;
                this.health = 3 - playerInfo.score;
                var playerElement = root.getElementsByClassName('player' + (this.playerId + 1))[0];
                this.iconElement = playerElement.getElementsByClassName('playericon')[0];
                this.nameElement = playerElement.getElementsByClassName('playername')[0];
                this.nameElement.innerText = playerInfo.player.name;
                this.healthElement = playerElement.getElementsByClassName('remainingHealth')[0];
                this.updateHealth();
            }
            PlayerInfo.prototype.updateHealth = function () {
                this.healthElement.style.width = ((Math.max(0, this.health) / 3) * 100) + '%';
            };

            PlayerInfo.prototype.onTurnResult = function (winningPlayer) {
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
                this.currentInstruction = -1;
                this.datacontext = datacontext;
                this.layer = document.getElementById('duel-layer');
                this.showScoreboardButton = document.getElementById('toggle-scoreboard-button');
                this.players = [];
                var gamePlayers = datacontext.GetCurrentPlayers();
                this.players[0] = new PlayerInfo(this.layer, gamePlayers[0]);
                this.players[1] = new PlayerInfo(this.layer, gamePlayers[1]);
                this.startTurnLabel = document.getElementById('start-turn-text');

                this.currentTurn = 1;

                this.resetScoreboard();
                this.chips = [];
                this.player1Chip = new views.choosehand.Chip(models.entities.BetType.Unknown, 25, 1000, 200);
                this.player2Chip = new views.choosehand.Chip(models.entities.BetType.Unknown, 650, 1000, 200);

                this.player1Bullet = document.getElementById('player1-bullet');
                this.player2Bullet = document.getElementById('player2-bullet');

                this.instructions = this.layer.getElementsByClassName('instructions')[0];
            }
            Duel.prototype.enter = function (previousState) {
                var _this = this;
                this.turnInProgress = false;
                this.turnLocked = false;
                this.datacontext.turnReady.add(this.onTurnReady, this);
                this.datacontext.turnResult.add(this.onTurnResult, this);

                var initialTraps = this.datacontext.getInitialTraps();
                for (var j = 0; j < initialTraps.length; j++) {
                    document.getElementById('initial-trap-count-' + j).innerHTML = 'x' + 2 * initialTraps[j];
                }

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

                var chipsContainer = this.layer.getElementsByClassName('chips')[0];
                for (var i = 0; i < 10; i++) {
                    var chip = new views.choosehand.Chip(models.entities.BetType.Unknown, x, -100, 10 + 10 * i);
                    var x = i % 2 == 0 ? -200 : 1000;
                    chipsContainer.appendChild(chip.element);
                    this.chips.push(chip);

                    TweenLite.to(chip.element, 0.75, { top: 440 - 10 * i, delay: i * 0.05 });
                    TweenLite.to(chip.element, 0.75, { left: 338, delay: i * 0.05, ease: Cubic.easeOut });
                }

                chipsContainer.appendChild(this.player1Chip.element);
                chipsContainer.appendChild(this.player2Chip.element);

                document.onkeydown = function (event) {
                    _this.onKeyDown(event.keyCode, event);
                };

                this.chips[this.chips.length - 1].element.onclick = this.startNewTurn.bind(this);

                var tutor = this.layer.getElementsByClassName('tutor')[0];
                tutor.style.display = 'block';
                this.currentInstruction = 0;
                this.activateInstruction(this.currentInstruction);
            };

            Duel.prototype.exit = function (nextState) {
                this.datacontext.turnReady.remove(this.onTurnReady, this);
                this.datacontext.turnResult.remove(this.onTurnResult, this);
                this.showScoreboardButton.onclick = null;
                var chipsContainer = this.layer.getElementsByClassName('chips')[0];
                for (var i = 0; i < chipsContainer.childElementCount; i++) {
                    (chipsContainer.children[i]).onclick = null;
                }

                while (chipsContainer.childElementCount > 0) {
                    chipsContainer.removeChild(chipsContainer.children[0]);
                }

                if (this.activeButton) {
                    this.activeButton.onclick = null;
                }

                if (this.lessButton) {
                    this.lessButton.onclick = null;
                }

                document.onkeydown = null;
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
                            var imageName = playerWin == 0 ? 'sally' : 'riley';
                            element.innerHTML = "<img class=\"profile-pic\" src =\"images/players/" + imageName + ".png\" width=\"16\" height=\"16\" />";
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

            Duel.prototype.onKeyDown = function (keyCode, e) {
                if (keyCode == 32) {
                    e.preventDefault();
                    if (!this.turnInProgress && !this.turnLocked) {
                        this.startNewTurn();
                    }
                }

                for (var playerId = 0; playerId < playerKeys.length; ++playerId) {
                    if (keyCode in playerKeys[playerId]) {
                        e.preventDefault();
                        if (!this.turnInProgress || this.turnLocked) {
                            return;
                        }

                        var newBet = playerKeys[playerId][keyCode];
                        var previousBet = this.datacontext.MakeBet(playerId, newBet);
                        if (null === previousBet) {
                            var playerChip = playerId === 0 ? this.player1Chip : this.player2Chip;

                            playerChip.element.style.opacity = "1";
                            playerChip.element.style.visibility = "visible";
                            TweenMax.fromTo(playerChip.element, 0.2, { top: 1000 }, { top: 300, ease: Cubic.easeOut });
                        } else if (newBet !== previousBet) {
                            // flip chip
                            var playerChip = playerId === 0 ? this.player1Chip : this.player2Chip;

                            // flip guesses to reveal them
                            var p1ChipTimeline = new TimelineMax();
                            p1ChipTimeline.to(playerChip.element, 0.1, { scaleX: 0 });
                            p1ChipTimeline.to(playerChip.element, 0.1, { scaleX: 1 });
                            p1ChipTimeline.play();
                        }
                    }
                }
            };

            Duel.prototype.onTurnReady = function () {
                window.setTimeout(function () {
                    this.turnLocked = true;
                    this.datacontext.TakeTurn();
                }.bind(this), 1000);
            };

            Duel.prototype.onTurnResult = function (winningPlayer, betType, players) {
                this.activeChip.setBetType(betType);

                var activeChipTimeline = new TimelineMax();
                activeChipTimeline.to(this.activeChip.element, 0, { scaleY: 1 });
                activeChipTimeline.to(this.activeChip.element, 1, { top: 300 });
                if (winningPlayer != null) {
                    activeChipTimeline.to(this.activeChip.element, 0.1, { scaleX: 0 }, "+=1.4");
                    activeChipTimeline.to(this.activeChip.element, 0.1, { scaleX: 1 });
                }

                activeChipTimeline.play();

                TweenMax.to(this.activeChip.element, 0.4, { autoAlpha: 0, delay: 3.2 });
                TweenMax.to(this.activeChip.element, .2, { scaleX: 0, yoyo: true, repeat: 3, delay: .1 });

                // flip guesses to reveal them
                var p1Chip = this.player1Chip;
                var p1ChipTimeline = new TimelineMax();
                p1ChipTimeline.to(this.player1Chip.element, 0.1, {
                    scaleX: 0,
                    delay: 1,
                    onComplete: function () {
                        p1Chip.setBetType(players[0].currentBet);
                    }
                });

                p1ChipTimeline.to(this.player1Chip.element, 0.1, { scaleX: 1 });
                var fadeOutDelay = "+=2";
                if (winningPlayer != null && winningPlayer.playerId == players[0].playerId) {
                    p1ChipTimeline.to(this.player1Chip.element, 0.1, { scaleX: 0, delay: 1 });
                    p1ChipTimeline.to(this.player1Chip.element, 0.1, { scaleX: 1 });
                    fadeOutDelay = "+=0.6";
                }

                p1ChipTimeline.to(this.player1Chip.element, 0.4, { autoAlpha: 0, onComplete: function () {
                        p1Chip.setBetType(models.entities.BetType.Unknown);
                    } }, fadeOutDelay);
                p1ChipTimeline.play();

                var p2Chip = this.player2Chip;
                var p2ChipTimeline = new TimelineMax();
                p2ChipTimeline.to(this.player2Chip.element, 0.1, {
                    scaleX: 0,
                    delay: 1,
                    onComplete: function () {
                        p2Chip.setBetType(players[1].currentBet);
                    }
                });

                p2ChipTimeline.to(this.player2Chip.element, 0.1, { scaleX: 1 });
                fadeOutDelay = "+=2";
                if (winningPlayer != null && winningPlayer.playerId == players[1].playerId) {
                    p2ChipTimeline.to(this.player2Chip.element, 0.1, { scaleX: 0, delay: 1 });
                    p2ChipTimeline.to(this.player2Chip.element, 0.1, { scaleX: 1 });
                    fadeOutDelay = "+=0.6";
                }

                p2ChipTimeline.to(this.player2Chip.element, 0.4, { autoAlpha: 0, onComplete: function () {
                        p2Chip.setBetType(models.entities.BetType.Unknown);
                    } }, fadeOutDelay);
                p2ChipTimeline.play();

                this.player1Bullet.style.left = "-136px";
                this.player1Bullet.style.top = "300px";
                this.player2Bullet.style.left = "900px";
                this.player2Bullet.style.top = "300px";

                // fire bullets
                var p1Timeline = new TimelineLite();
                var p2Timeline = new TimelineLite();
                if (winningPlayer == null) {
                    p1Timeline.to(this.player1Bullet, 0.5, { left: 364, delay: 2, ease: Linear.easeNone });
                    p1Timeline.to(this.player1Bullet, 1, { left: -136, ease: Linear.easeNone });
                    p1Timeline.to(this.player1Bullet, 1, { top: -100 }, "-=1");

                    p2Timeline.to(this.player2Bullet, 0.5, { left: 400, delay: 2, ease: Linear.easeNone });
                    p2Timeline.to(this.player2Bullet, 1, { left: 900, ease: Linear.easeNone });
                    p2Timeline.to(this.player2Bullet, 1, { top: -100, onComplete: this.updatePlayersHealth.bind(this) }, "-=1");
                } else if (winningPlayer.playerId == players[0].playerId) {
                    p1Timeline.to(this.player1Bullet, 1, { left: 900, delay: 2, ease: Linear.easeNone, onComplete: this.updatePlayersHealth.bind(this) });
                } else {
                    p2Timeline.to(this.player2Bullet, 1, { left: -136, delay: 2, ease: Linear.easeNone, onComplete: this.updatePlayersHealth.bind(this) });
                }

                p1Timeline.play();
                p2Timeline.play();

                this.turnResults = {
                    winningPlayer: winningPlayer,
                    players: players,
                    betType: betType
                };
            };

            Duel.prototype.updatePlayersHealth = function () {
                this.turnInProgress = false;
                this.turnLocked = false;

                for (var i = 0; i < this.players.length; ++i) {
                    this.players[i].onTurnResult(this.turnResults.winningPlayer);
                }

                if (this.turnResults.winningPlayer != null) {
                    $('#duel-layer').effect('shake', 15);
                }

                // Update turn information
                this.updateTurnInformation(this.turnResults.players[0].currentBet, this.turnResults.players[1].currentBet, this.turnResults.betType, this.turnResults.winningPlayer ? this.turnResults.winningPlayer.playerId : null);

                this.datacontext.AdvanceGame();
            };

            Duel.prototype.startNewTurn = function () {
                if (this.turnInProgress) {
                    return;
                }

                this.turnResults = null;
                this.turnInProgress = true;
                this.flipNextChip();
            };

            Duel.prototype.flipNextChip = function () {
                if (this.activeChip != null) {
                    this.activeChip.element.onclick = null;
                }

                if (this.chips.length > 0) {
                    this.activeChip = this.chips.pop();
                    TweenLite.to(this.activeChip.element, 1.5, { top: -100 });
                    TweenMax.to(this.activeChip.element, 0.1, { scaleY: 0, yoyo: true, repeat: 8 });

                    TweenMax.fromTo(this.startTurnLabel, 0.5, { opacity: 0 }, { autoAlpha: 1, yoyo: true, repeat: 1, delay: 1, repeatDelay: 1.5 });
                    TweenMax.fromTo(this.startTurnLabel, 2.5, { marginLeft: 20 }, { marginLeft: -20, delay: 1 });

                    if (this.chips.length > 0) {
                        this.chips[this.chips.length - 1].element.onclick = this.startNewTurn.bind(this);
                    }
                }
            };

            Duel.prototype.activateInstruction = function (activeInstruction) {
                var _this = this;
                if ((this.activeInstruction != null) && this.activeInstruction.classList.contains('active-instruction')) {
                    this.activeInstruction.classList.remove('active-instruction');
                }
                if (this.activeButton) {
                    this.activeButton.onclick = null;
                }

                if (activeInstruction >= this.instructions.children.length) {
                    this.hideInstructions();
                } else {
                    this.activeInstruction = this.instructions.children[activeInstruction];
                    this.activeInstruction.classList.add('active-instruction');
                    this.activeButton = this.activeInstruction.getElementsByClassName('more-button')[0];
                    this.activeButton.onclick = function () {
                        _this.activateInstruction(activeInstruction + 1);
                        return false;
                    };

                    this.lessButton = this.activeInstruction.getElementsByClassName('less-button')[0];
                    if (this.lessButton) {
                        this.lessButton.onclick = function () {
                            _this.hideInstructions();
                            return false;
                        };
                    }
                }
            };

            Duel.prototype.hideInstructions = function () {
                this.activeInstruction.classList.remove('active-instruction');
                var tutor = this.layer.getElementsByClassName('tutor')[0];
                tutor.style.display = 'none';
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=duel.js.map
