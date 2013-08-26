var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="chooseHand.ts"/>
    /// <reference path="..\..\models\simulations\Simulation.ts"/>
    (function (states) {
        var Title = (function () {
            function Title() {
                this.id = "viewmodels.states.Title";
                this.stateChanged = new Signal();
            }
            Title.prototype.enter = function () {
            };

            Title.prototype.exit = function () {
            };

            Title.prototype.onPlayGame = function () {
                var simulation = new models.simulations.Simulation();
                simulation.StartGame();
                this.stateChanged.dispatch(new states.ChooseHand(simulation));
            };
            return Title;
        })();
        states.Title = Title;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=title.js.map
