var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    (function (states) {
        var ChooseHand = (function () {
            function ChooseHand() {
                this.id = "viewmodels.states.ChooseHand";
                this.stateChanged = new Signal();
                this.instructionChanged = new Signal();
                this.currentInstruction = -1;
            }
            ChooseHand.prototype.enter = function () {
                this.currentInstruction = 0;
                this.instructionChanged.dispatch(this.currentInstruction);
            };

            ChooseHand.prototype.exit = function () {
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
