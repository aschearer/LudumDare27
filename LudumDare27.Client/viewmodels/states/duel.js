var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="chooseHand.ts"/>
    (function (states) {
        var Duel = (function () {
            function Duel() {
                this.id = "viewmodels.states.Duel";
                this.stateChanged = new Signal();
            }
            Duel.prototype.enter = function () {
            };

            Duel.prototype.exit = function () {
            };

            Duel.prototype.goBack = function () {
                this.stateChanged.dispatch(null);
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=duel.js.map
