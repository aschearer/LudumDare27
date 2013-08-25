var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    (function (states) {
        var LocalGame = (function () {
            function LocalGame() {
                this.id = "viewmodels.states.LocalGame";
                this.stateChanged = new Signal();
            }
            LocalGame.prototype.enter = function () {
            };

            LocalGame.prototype.exit = function () {
            };

            LocalGame.prototype.goBack = function () {
                this.stateChanged.dispatch(null);
            };
            return LocalGame;
        })();
        states.LocalGame = LocalGame;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=localGame.js.map
