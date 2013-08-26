var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="gameOver.ts"/>
    (function (states) {
        var Duel = (function () {
            function Duel(simulation) {
                this.id = "viewmodels.states.Duel";
                this.turnReady = new Signal();
                this.turnResult = new Signal();
                this.stateChanged = new Signal();
                this.simulation = simulation;
            }
            Duel.prototype.enter = function () {
                this.simulation.gameOver.add(this.onGameOver, this);
                this.simulation.turnReady.add(this.onTurnReady, this);
                this.simulation.turnResult.add(this.onTurnResult, this);
            };

            Duel.prototype.exit = function () {
                this.simulation.gameOver.remove(this.onGameOver, this);
                this.simulation.turnReady.remove(this.onTurnReady, this);
                this.simulation.turnResult.remove(this.onTurnResult, this);
            };

            Duel.prototype.GetCurrentPlayers = function () {
                return this.simulation.GetCurrentPlayers();
            };

            Duel.prototype.MakeBet = function (playerId, betType) {
                return this.simulation.MakeBet(playerId, betType);
            };

            Duel.prototype.TakeTurn = function () {
                this.simulation.TakeTurn();
            };

            Duel.prototype.AdvanceGame = function () {
                return this.simulation.AdvanceGame();
            };

            Duel.prototype.onGameOver = function () {
                this.stateChanged.dispatch(new states.GameOver(this.simulation), true);
            };

            Duel.prototype.onTurnReady = function () {
                this.turnReady.dispatch();
            };

            Duel.prototype.onTurnResult = function (winningPlayer, betType, players) {
                this.turnResult.dispatch(winningPlayer, betType, players);
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=duel.js.map
