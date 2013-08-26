var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="duel.ts"/>
    (function (states) {
        var ChooseHand = (function () {
            function ChooseHand(simulation) {
                this.id = "viewmodels.states.ChooseHand";
                this.showCanCommit = new Signal();
                this.stateChanged = new Signal();
                this.instructionChanged = new Signal();
                this.currentInstruction = -1;
                this.simulation = simulation;
            }
            ChooseHand.prototype.enter = function () {
                this.currentInstruction = 0;
                this.instructionChanged.dispatch(this.currentInstruction);
                this.simulation.canCommitHat.add(this.onCanCommitHat, this);
            };

            ChooseHand.prototype.exit = function () {
                this.simulation.canCommitHat.remove(this.onCanCommitHat, this);
            };

            ChooseHand.prototype.onCanCommitHat = function (enable) {
                this.showCanCommit.dispatch(enable);
            };

            ChooseHand.prototype.GetCurrentPlayerName = function () {
                var player = this.simulation.GetChoosingPlayer();
                return player ? player.name : "???!?!?!?";
            };

            ChooseHand.prototype.GetAvailableBets = function () {
                return this.simulation.GetAvailableBets();
            };

            ChooseHand.prototype.AddBetToHat = function (betType) {
                this.simulation.AddBetToHat(betType);
                if (this.currentInstruction > 0) {
                    this.currentInstruction--;
                    this.instructionChanged.dispatch(this.currentInstruction);
                }
            };

            ChooseHand.prototype.RemoveBetFromHat = function (betType) {
                this.simulation.RemoveBetFromHat(betType);
                if (this.currentInstruction < 2) {
                    this.currentInstruction++;
                    this.instructionChanged.dispatch(this.currentInstruction);
                }
            };

            ChooseHand.prototype.chooseHand = function () {
                this.simulation.CommitHat();
                var player = this.simulation.GetChoosingPlayer();
                if (player) {
                    this.stateChanged.dispatch(new ChooseHand(this.simulation), true);
                } else {
                    this.stateChanged.dispatch(new states.Duel(this.simulation), true);
                }
            };
            return ChooseHand;
        })();
        states.ChooseHand = ChooseHand;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=chooseHand.js.map
