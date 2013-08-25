var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="chooseHand.ts"/>
    (function (states) {
        var ChangingPlayer = (function () {
            function ChangingPlayer(simulation) {
                this.id = "viewmodels.states.ChangingPlayer";
                this.stateChanged = new Signal();
                this.simulation = simulation;
            }
            ChangingPlayer.prototype.enter = function () {
            };

            ChangingPlayer.prototype.exit = function () {
            };

            ChangingPlayer.prototype.GetCurrentPlayerName = function () {
                var player = this.simulation.GetChoosingPlayer();
                return player ? player.name : "???!?!?!?";
            };

            ChangingPlayer.prototype.playerReady = function () {
                this.stateChanged.dispatch(new states.ChooseHand(this.simulation), true);
            };
            return ChangingPlayer;
        })();
        states.ChangingPlayer = ChangingPlayer;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=changingPlayer.js.map
