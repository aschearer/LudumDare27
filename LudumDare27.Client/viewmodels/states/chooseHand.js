var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    /// <reference path="changingPlayer.ts"/>
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

            ChooseHand.prototype.AddBetToHat = function (betType) {
                this.simulation.AddBetToHat(betType);
            };

            ChooseHand.prototype.RemoveBetFromHat = function (betType) {
                this.simulation.RemoveBetFromHat(betType);
            };

            ChooseHand.prototype.chooseHand = function () {
                this.simulation.CommitHat();
                this.stateChanged.dispatch(new states.ChangingPlayer(this.simulation), true);
            };

            ChooseHand.prototype.goBack = function () {
                if (this.currentInstruction < 1) {
                    this.currentInstruction++;
                    this.instructionChanged.dispatch(this.currentInstruction);
                }
            };
            return ChooseHand;
        })();
        states.ChooseHand = ChooseHand;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=chooseHand.js.map
