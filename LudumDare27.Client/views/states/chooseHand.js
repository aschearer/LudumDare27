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

                var bets = this.datacontext.GetAvailableBets();
                var lastType = null;
                var lastCount = 0;
                var iBet = 0;
                var cBets = bets.length;
                var iColumn = 0;
                var color = ['green', 'pink', 'yellow', 'purple'];
                do {
                    for (; iBet < cBets; ++iBet) {
                        if (lastType === bets[iBet]) {
                            ++lastCount;
                        } else if (null === lastType) {
                            lastType = bets[iBet];
                            ++lastCount;
                        } else {
                            break;
                        }
                    }
                    this.chipStacks.push(new views.choosehand.ChipStack(chips, iColumn, lastType, color[iColumn], lastCount));
                    ++iColumn;
                    lastType = null;
                    lastCount = 0;
                } while(iBet < cBets);
            }
            ChooseHand.prototype.enter = function (previousState) {
                var _this = this;
                if (this.datacontext.currentInstruction >= 0) {
                    this.activateInstruction();
                }

                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].reset();
                    this.chipStacks[i].chipStackChanged.add(this.onChipStackChanged, this);
                }

                this.datacontext.instructionChanged.add(this.instructionChanged, this);
                this.datacontext.showCanCommit.add(this.showCanCommit, this);

                this.readyButton.onclick = function (event) {
                    _this.datacontext.chooseHand();
                    for (var i = 0; i < _this.chipStacks.length; i++) {
                        _this.chipStacks[i].commit();
                    }
                };
            };

            ChooseHand.prototype.exit = function (nextState) {
                this.datacontext.instructionChanged.remove(this.instructionChanged, this);
                this.datacontext.showCanCommit.remove(this.showCanCommit, this);
                this.readyButton.onclick = null;

                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].chipStackChanged.remove(this.onChipStackChanged, this);
                }

                this.activeInstruction.classList.remove('active-instruction');
                this.activeInstruction = null;
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

            ChooseHand.prototype.onChipStackChanged = function (betType, added) {
                if (added) {
                    this.datacontext.AddBetToHat(betType);
                } else {
                    this.datacontext.RemoveBetFromHat(betType);
                }
            };

            ChooseHand.prototype.showCanCommit = function (enable) {
                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].setActiveEnabled(!enable);
                }
            };
            return ChooseHand;
        })();
        states.ChooseHand = ChooseHand;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=chooseHand.js.map
