var models;
(function (models) {
    /// <reference path="../entities/betting.ts"/>
    (function (simulations) {
        var SimulationState;
        (function (SimulationState) {
            SimulationState[SimulationState["NewGame"] = 0] = "NewGame";
            SimulationState[SimulationState["ChooseHand"] = 1] = "ChooseHand";
            SimulationState[SimulationState["ChooseBet"] = 2] = "ChooseBet";
            SimulationState[SimulationState["ShowResult"] = 3] = "ShowResult";
            SimulationState[SimulationState["GameOver"] = 4] = "GameOver";
        })(SimulationState || (SimulationState = {}));

        var Simulation = (function () {
            function Simulation() {
                this.hat = new models.entities.Hat();
                this.players = [];
                this.players[0] = new models.entities.Player(0);
                this.players[1] = new models.entities.Player(1);

                this.currentPlayer = 0;
                this.simulationState = SimulationState.NewGame;
            }
            Simulation.prototype.update = function (elapsedTime) {
                if (SimulationState.NewGame === this.simulationState) {
                    this.simulationState = SimulationState.ChooseHand;
                    this.changingPlayer.dispatch(this.players[this.currentPlayer]);
                }
            };

            Simulation.prototype.PlayerReady = function () {
                if (SimulationState.ChooseHand == this.simulationState) {
                    this.chooseHand.dispatch(this.players[this.currentPlayer]);
                } else {
                    this.chooseBet.dispatch(this.players[this.currentPlayer]);
                }
            };

            Simulation.prototype.AdvanceGame = function () {
                if (this.hat.IsDone()) {
                    this.simulationState = SimulationState.GameOver;

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
                    this.gameOver.dispatch(winningPlayer, winningScore);
                } else {
                    this.simulationState = SimulationState.ChooseBet;
                    this.changingPlayer.dispatch(this.players[this.currentPlayer]);
                }
            };

            Simulation.prototype.ChooseBet = function (betType) {
                this.players[this.currentPlayer].MakeBet(betType);
                this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
                if (0 == this.currentPlayer) {
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
                } else {
                    this.changingPlayer.dispatch(this.players[this.currentPlayer]);
                }
            };

            Simulation.prototype.AddBetToHat = function (betType) {
                var hand = this.players[this.currentPlayer].GetHand();
                hand.AddBetToHat(betType);
                if (hand.GetBetCount() >= 5) {
                    this.canCommitHat.dispatch(true);
                }
            };

            Simulation.prototype.RemoveBetFromHat = function (betType) {
                var hand = this.players[this.currentPlayer].GetHand();
                hand.RemoveBetFromHat(betType);
                if (hand.GetBetCount() < 5) {
                    this.canCommitHat.dispatch(false);
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
                    this.simulationState = SimulationState.ChooseBet;
                    this.hat.ShuffleBets();
                }
                this.changingPlayer.dispatch(this.players[this.currentPlayer]);
            };
            return Simulation;
        })();
        simulations.Simulation = Simulation;
    })(models.simulations || (models.simulations = {}));
    var simulations = models.simulations;
})(models || (models = {}));
//# sourceMappingURL=simulation.js.map
