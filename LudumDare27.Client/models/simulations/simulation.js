var models;
(function (models) {
    /// <reference path="../entities/betting.ts"/>
    (function (simulations) {
        var SimulationState;
        (function (SimulationState) {
            SimulationState[SimulationState["NewGame"] = 0] = "NewGame";
            SimulationState[SimulationState["ChooseHand"] = 1] = "ChooseHand";
            SimulationState[SimulationState["ChooseBets"] = 2] = "ChooseBets";
            SimulationState[SimulationState["ShowResult"] = 3] = "ShowResult";
            SimulationState[SimulationState["GameOver"] = 4] = "GameOver";
        })(SimulationState || (SimulationState = {}));

        var PlayerResult = (function () {
            function PlayerResult(player, score) {
                this.player = player;
                this.score = score;
            }
            return PlayerResult;
        })();
        simulations.PlayerResult = PlayerResult;

        var Simulation = (function () {
            function Simulation() {
                this.changingPlayer = new Signal();
                this.canCommitHat = new Signal();
                this.chooseBets = new Signal();
                this.turnReady = new Signal();
                this.turnResult = new Signal();
                this.gameOver = new Signal();
                this.hat = new models.entities.Hat();
                this.players = [];
                this.players[0] = new models.entities.Player(0);
                this.players[1] = new models.entities.Player(1);

                this.currentPlayer = 0;
                this.simulationState = SimulationState.NewGame;
            }
            Simulation.prototype.StartGame = function () {
                this.simulationState = SimulationState.ChooseHand;
                this.changingPlayer.dispatch(this.players[this.currentPlayer]);
            };

            Simulation.prototype.AdvanceGame = function () {
                if (this.hat.IsDone()) {
                    this.simulationState = SimulationState.GameOver;
                    var results = this.GetGameResults();
                    this.gameOver.dispatch(results);
                } else {
                    for (var iPlayer in this.players) {
                        var player = this.players[iPlayer];
                        player.currentBet = null;
                    }
                    this.simulationState = SimulationState.ChooseBets;
                    this.chooseBets.dispatch(this.players);
                }
            };

            Simulation.prototype.GetGameResults = function () {
                var winningScore = Number.MIN_VALUE;
                var winningPlayer = null;
                for (var iPlayer in this.players) {
                    var player = this.players[iPlayer];
                    if (player.points > winningScore) {
                        winningPlayer = player;
                        winningScore = player.points;
                    } else if (player.points === winningScore) {
                        // A tie
                        winningPlayer = null;
                    }
                }

                return new PlayerResult(winningPlayer, winningScore);
            };

            Simulation.prototype.AreAllPlayersReady = function () {
                var allPlayersReady = true;
                for (var iPlayer in this.players) {
                    var player = this.players[iPlayer];
                    if (player.currentBet === null) {
                        allPlayersReady = false;
                        break;
                    }
                }
                return allPlayersReady;
            };

            Simulation.prototype.MakeBet = function (playerId, betType) {
                var player = this.players[playerId];
                var wasPlayerNotReady = (null === player.currentBet);

                player.MakeBet(betType);

                if (wasPlayerNotReady && this.AreAllPlayersReady()) {
                    this.turnReady.dispatch();
                }

                return wasPlayerNotReady;
            };

            Simulation.prototype.TakeTurn = function () {
                var bet = this.hat.GetNextBet();
                var winningPlayer = null;
                for (var iPlayer in this.players) {
                    var player = this.players[iPlayer];
                    if (player.currentBet === bet) {
                        if (null !== winningPlayer) {
                            // A tie
                            winningPlayer = null;
                            break;
                        }
                        winningPlayer = player;
                    }
                }
                if (winningPlayer) {
                    winningPlayer.AddPoint(1);
                }
                this.simulationState = SimulationState.ShowResult;
                this.turnResult.dispatch(winningPlayer, bet, this.players);
            };

            Simulation.prototype.AddBetToHat = function (betType) {
                var hand = this.players[this.currentPlayer].GetHand();
                var beforeCount = hand.GetBetCount();
                hand.AddBetToHat(betType);
                var afterCount = hand.GetBetCount();
                if (((beforeCount === 5) || (afterCount === 5)) && (beforeCount !== afterCount)) {
                    this.canCommitHat.dispatch(afterCount === 5);
                }
            };

            Simulation.prototype.RemoveBetFromHat = function (betType) {
                var hand = this.players[this.currentPlayer].GetHand();
                var beforeCount = hand.GetBetCount();
                hand.RemoveBetFromHat(betType);
                var afterCount = hand.GetBetCount();
                if (((beforeCount === 5) || (afterCount === 5)) && (beforeCount !== afterCount)) {
                    this.canCommitHat.dispatch(afterCount === 5);
                }
            };

            Simulation.prototype.CommitHat = function () {
                var newBets = this.players[this.currentPlayer].GetHand().GetBets();
                for (var iBet in newBets) {
                    var newBet = newBets[iBet];
                    this.hat.AddBet(newBet);
                }
                this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
                if (0 == this.currentPlayer) {
                    this.simulationState = SimulationState.ChooseBets;
                    this.hat.ShuffleBets();
                    this.chooseBets.dispatch(this.players);
                } else {
                    this.simulationState = SimulationState.ChooseHand;
                    this.changingPlayer.dispatch(this.players[this.currentPlayer]);
                }
            };

            Simulation.prototype.GetChoosingPlayer = function () {
                if (this.simulationState === SimulationState.ChooseHand) {
                    return this.players[this.currentPlayer];
                }

                return null;
            };

            Simulation.prototype.GetAvailableBets = function () {
                return this.players[this.currentPlayer].GetHand().GetAvailableBets();
            };

            Simulation.prototype.GetCurrentPlayers = function () {
                var ret = new Array();
                var totalScore = 0;
                for (var i = 0, col = this.players, c = col.length; i < c; ++i) {
                    var player = col[i];
                    totalScore += player.points;
                }

                for (var i = 0, col = this.players, c = col.length; i < c; ++i) {
                    var player = col[i];
                    ret.push(new PlayerResult(player, 5 - (totalScore - player.points)));
                }

                return ret;
            };
            return Simulation;
        })();
        simulations.Simulation = Simulation;
    })(models.simulations || (models.simulations = {}));
    var simulations = models.simulations;
})(models || (models = {}));
//# sourceMappingURL=simulation.js.map
