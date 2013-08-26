var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/duel.ts"/>
    (function (states) {
        var PlayerInfo = (function () {
            function PlayerInfo(root, playerInfo) {
                this.playerId = playerInfo.player.playerId;
                this.health = playerInfo.score;
                var playerElement = root.getElementsByClassName('player' + (this.playerId + 1))[0];
                this.iconElement = playerElement.getElementsByClassName('playericon')[0];
                this.nameElement = playerElement.getElementsByClassName('playername')[0];
                this.nameElement.innerText = playerInfo.player.name;
                this.healthElement = playerElement.getElementsByClassName('health')[0];
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
            }
            Duel.prototype.enter = function (previousState) {
                var _this = this;
                this.datacontext.turnReady.add(this.onTurnReady, this);
                this.datacontext.turnResult.add(this.onTurnResult, this);

                var that = this;
                this.showScoreboardButton.onclick = function (event) {
                    if (_this.scoreboardShown) {
                        document.getElementById('scoreboard').style.top = '-300px';
                        _this.showScoreboardButton.classList.remove('glyphicon-chevron-up');
                        _this.showScoreboardButton.classList.add('glyphicon-chevron-down');
                    } else {
                        document.getElementById('scoreboard').style.top = '84px';
                        _this.showScoreboardButton.classList.remove('glyphicon-chevron-down');
                        _this.showScoreboardButton.classList.add('glyphicon-chevron-up');
                    }

                    _this.scoreboardShown = !_this.scoreboardShown;
                };

                document.onkeyup = function (event) {
                    _this.onKeyUp(event.keyCode);
                };
            };

            Duel.prototype.exit = function (nextState) {
                this.datacontext.turnReady.remove(this.onTurnReady, this);
                this.datacontext.turnResult.remove(this.onTurnResult, this);
                this.showScoreboardButton.onclick = null;
                document.onkeyup = null;
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

            Duel.prototype.onTurnResult = function (winningPlayer, betType) {
                for (var i = 0; i < this.players.length; ++i) {
                    this.players[i].onTurnResult(winningPlayer);
                }
                this.datacontext.AdvanceGame();
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=duel.js.map
