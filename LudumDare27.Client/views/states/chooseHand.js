var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/chooseHand.ts"/>
    /// <reference path="../choosehand/chipStack.ts"/>
    (function (states) {
        var greetings = ["Welcome", "Howdy", "Ahoy", "Yo", "'Zup"];
        var insults = ["dastardly", "cowardly", "scurvy", "ill-mannered", "lily-livered"];
        var lastGreeting = null;
        var lastInsult = null;

        var discardText = [null, "one trap", "two traps", "three traps", "four traps"];

        function getRandomInstruction(instructions, lastInstruction) {
            var random = null;

            do {
                random = Math.floor(Math.random() * instructions.length);
            } while(instructions[random] === lastInstruction);

            return instructions[random];
        }
        states.getRandomInstruction = getRandomInstruction;

        var ChooseHand = (function () {
            function ChooseHand(datacontext) {
                this.id = "views.states.ChooseHand";
                this.activeEnabled = false;
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-layer');
                this.instructions = this.layer.getElementsByClassName('instructions')[0];
                this.readyButton = document.getElementById('choose-hand-button');

                this.chipStacks = [];
                var chips = this.layer.getElementsByClassName('chips')[0];

                // Remove all children
                chips.innerHTML = "";

                var bets = this.datacontext.GetAvailableBets();
                var lastType = null;
                var lastCount = 0;
                var iBet = 0;
                var cBets = bets.length;
                var iColumn = 0;
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
                    this.chipStacks.push(new views.choosehand.ChipStack(chips, iColumn, lastType, lastCount));
                    ++iColumn;
                    lastType = null;
                    lastCount = 0;
                } while(iBet < cBets);

                document.getElementById('instruction-discard-count').innerHTML = discardText[cBets - 5] || ("" + (cBets - 5) + " traps");
            }
            ChooseHand.prototype.enter = function (previousState) {
                var _this = this;
                document.getElementById('instruction-player-name').innerHTML = this.datacontext.GetCurrentPlayerName();
                document.getElementById('instruction-greeting').innerHTML = lastGreeting = getRandomInstruction(greetings, lastGreeting);
                document.getElementById('instruction-insult').innerHTML = lastInsult = getRandomInstruction(insults, lastInsult);

                if (this.datacontext.currentInstruction >= 0) {
                    this.activateInstruction(this.datacontext.currentInstruction);
                }

                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].enter();
                    this.chipStacks[i].chipStackChanged.add(this.onChipStackChanged, this);
                }

                this.datacontext.instructionChanged.add(this.instructionChanged, this);
                this.datacontext.showCanCommit.add(this.showCanCommit, this);

                this.readyButton.onclick = function (event) {
                    if (!_this.activeEnabled) {
                        return false;
                    }

                    for (var i = 0; i < _this.chipStacks.length; i++) {
                        _this.chipStacks[i].hideChips();
                    }
                    _this.readyButton.onclick = null;
                    var that = _this;
                    window.setTimeout(function () {
                        that.datacontext.chooseHand();
                    }, 200);

                    return false;
                };
            };

            ChooseHand.prototype.exit = function (nextState) {
                this.datacontext.instructionChanged.remove(this.instructionChanged, this);
                this.datacontext.showCanCommit.remove(this.showCanCommit, this);
                this.readyButton.onclick = null;

                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].exit();
                    this.chipStacks[i].chipStackChanged.remove(this.onChipStackChanged, this);
                }

                this.activeInstruction.classList.remove('active-instruction');
                this.activeInstruction = null;
            };

            ChooseHand.prototype.instructionChanged = function (activeInstruction) {
                if (this.activeInstruction != null) {
                    this.activeInstruction.classList.remove('active-instruction');
                }

                this.activateInstruction(activeInstruction);
            };

            ChooseHand.prototype.activateInstruction = function (activeInstruction) {
                this.activeInstruction = this.instructions.children[activeInstruction];
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
                this.activeEnabled = enable;
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
