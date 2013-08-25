var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    (function (states) {
        var LocalGame = (function () {
            function LocalGame() {
                this.id = "viewmodels.states.LocalGame";
                this.stateChanged = new Signal();
                this.showCanCommit = new Signal();
                this.showReady = new Signal();
                this.showSubState = new Signal();
            }
            LocalGame.prototype.enter = function () {
                this.simulation = new models.simulations.Simulation();
                this.simulation.changingPlayer.add(this.onChangingPlayer, this);
                this.simulation.canCommitHat.add(this.onCanCommitHat, this);
                this.simulation.chooseBets.add(this.onChooseBets, this);
                this.simulation.turnReady.add(this.onTurnReady, this);
                this.simulation.turnResult.add(this.onTurnResult, this);
                this.simulation.gameOver.add(this.onGameOver, this);
            };

            LocalGame.prototype.exit = function () {
                this.simulation.changingPlayer.remove(this.onChangingPlayer, this);
                this.simulation.canCommitHat.remove(this.onCanCommitHat, this);
                this.simulation.chooseBets.remove(this.onChooseBets, this);
                this.simulation.turnReady.remove(this.onTurnReady, this);
                this.simulation.turnResult.remove(this.onTurnResult, this);
                this.simulation.gameOver.remove(this.onGameOver, this);
            };

            LocalGame.prototype.StartGame = function () {
                this.simulation.StartGame();
            };

            LocalGame.prototype.onChangingPlayer = function (player) {
                this.currentPlayer = player;
                this.showSubState.dispatch("choosePlayer", player.playerId);
            };

            LocalGame.prototype.PlayerReady = function () {
                this.showSubState.dispatch("chooseHand", this.currentPlayer.GetHand());
            };

            LocalGame.prototype.onCanCommitHat = function (enable) {
                this.showCanCommit.dispatch(enable);
            };

            LocalGame.prototype.AddBetToHat = function (betType) {
                this.simulation.AddBetToHat(betType);
            };

            LocalGame.prototype.RemoveBetFromHat = function (betType) {
                this.simulation.RemoveBetFromHat(betType);
            };

            LocalGame.prototype.CommitHat = function () {
                this.simulation.CommitHat();
            };

            LocalGame.prototype.onChooseBets = function () {
                this.showSubState.dispatch("chooseBets");
            };

            LocalGame.prototype.MakeBet = function (playerId, betType) {
                if (this.simulation.MakeBet(playerId, betType)) {
                    this.showReady.dispatch(playerId);
                }
            };

            LocalGame.prototype.onTurnReady = function () {
                // TODO: animate start of turn
                this.showSubState.dispatch("turnReady");
            };

            LocalGame.prototype.TakeTurn = function () {
                this.simulation.TakeTurn();
            };

            LocalGame.prototype.onTurnResult = function () {
                // TODO: animate end of turn
                this.showSubState.dispatch("chooseBets");
            };

            LocalGame.prototype.onGameOver = function () {
                // TODO: animate end
                this.showSubState.dispatch("gameOver");
            };

            LocalGame.prototype.EndGame = function () {
                this.stateChanged.dispatch(null);
            };
            return LocalGame;
        })();
        states.LocalGame = LocalGame;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=localGame.js.map
