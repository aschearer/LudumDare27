var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/chooseHand.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    /// <reference path="../choosehand/chipStack.ts"/>
    (function (states) {
        var ChooseHand = (function () {
            function ChooseHand(datacontext) {
                this.id = "views.states.ChooseHand";
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-layer');
                this.instructions = this.layer.getElementsByClassName('instructions')[0];
                this.readyButton = document.getElementById('choose-hand-button');

                this.chipStacks = [];
                var chips = this.layer.getElementsByClassName('chips')[0];

                // TODO: get count from datacontext
                this.chipStacks.push(new views.choosehand.ChipStack(chips, 0, 'green', 2));
                this.chipStacks.push(new views.choosehand.ChipStack(chips, 1, 'pink', 3));
                this.chipStacks.push(new views.choosehand.ChipStack(chips, 2, 'yellow', 2));
                this.chipStacks.push(new views.choosehand.ChipStack(chips, 3, 'purple', 1));
            }
            ChooseHand.prototype.enter = function (previousState) {
                var _this = this;
                if (this.datacontext.currentInstruction >= 0) {
                    this.activateInstruction();
                }

                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].reset();
                }

                this.datacontext.instructionChanged.add(this.instructionChanged, this);
                this.datacontext.showCanCommit.add(this.showCanCommit, this);
                this.layer.onclick = function (event) {
                    _this.datacontext.goBack();
                };

                this.readyButton.onclick = function (event) {
                    _this.datacontext.chooseHand();
                    for (var i = 0; i < _this.chipStacks.length; i++) {
                        _this.chipStacks[i].commit();
                    }
                };
            };

            ChooseHand.prototype.exit = function (nextState) {
                this.layer.onclick = null;
                this.datacontext.instructionChanged.remove(this.instructionChanged, this);
                this.datacontext.showCanCommit.remove(this.showCanCommit, this);
                this.readyButton.onclick = null;
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

            ChooseHand.prototype.showCanCommit = function (enable) {
                // TODO:
            };
            return ChooseHand;
        })();
        states.ChooseHand = ChooseHand;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=chooseHand.js.map
