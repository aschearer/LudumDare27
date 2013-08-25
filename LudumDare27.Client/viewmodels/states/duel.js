var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="gameOver.ts"/>
    (function (states) {
        var Duel = (function () {
            function Duel(simulation) {
                this.id = "viewmodels.states.Duel";
                this.stateChanged = new Signal();
                this.simulation = simulation;
            }
            Duel.prototype.enter = function () {
            };

            Duel.prototype.exit = function () {
            };

            Duel.prototype.goBack = function () {
                this.stateChanged.dispatch(new states.GameOver(this.simulation), true);
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=duel.js.map
