var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    (function (states) {
        var ChooseHand = (function () {
            function ChooseHand(datacontext) {
                this.id = "views.states.ChooseHand";
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-layer');
                this.instructions = this.layer.getElementsByClassName('instructions')[0];
            }
            ChooseHand.prototype.enter = function (previousState) {
                var _this = this;
                if (this.datacontext.currentInstruction >= 0) {
                    this.activateInstruction();
                }

                this.datacontext.instructionChanged.add(this.instructionChanged, this);
                this.layer.onclick = function (event) {
                    _this.datacontext.goBack();
                };
            };

            ChooseHand.prototype.exit = function (nextState) {
                this.layer.onclick = null;
                this.datacontext.instructionChanged.remove(this.instructionChanged, this);
            };

            ChooseHand.prototype.instructionChanged = function (activeInstruction) {
                if (this.activeInstruction != null) {
                    this.activeInstruction.classList.remove('active-instruction');
                }

                this.activateInstruction();
            };

            ChooseHand.prototype.activateInstruction = function () {
                this.activeInstruction = this.instructions.children[this.datacontext.currentInstruction];
                this.activeInstruction.classList.add('active-instruction');
            };
            return ChooseHand;
        })();
        states.ChooseHand = ChooseHand;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=chooseHand.js.map
