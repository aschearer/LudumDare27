var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="chooseHand.ts"/>
    (function (states) {
        var GameOver = (function () {
            function GameOver(simulation) {
                this.id = "viewmodels.states.GameOver";
                this.stateChanged = new Signal();
                this.simulation = simulation;
            }
            GameOver.prototype.enter = function () {
            };

            GameOver.prototype.exit = function () {
            };

            GameOver.prototype.GetWinningPlayerName = function () {
                var results = this.simulation.GetGameResults();
                return (results.winner) ? results.winner.name : null;
            };

            GameOver.prototype.endGame = function () {
                this.stateChanged.dispatch(null);
            };
            return GameOver;
        })();
        states.GameOver = GameOver;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=gameOver.js.map
