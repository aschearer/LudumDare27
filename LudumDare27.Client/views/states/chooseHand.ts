/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/chooseHand.ts"/>
/// <reference path="../choosehand/chipStack.ts"/>

module views.states {

    var greetings = ["Welcome", "Howdy", "Ahoy", "Yo", "'Zup"];
    var insults = ["dastardly", "cowardly", "scurvy", "ill-mannered", "lily-livered"];
    var lastGreeting = null;
    var lastInsult = null;

    var discardText = [null, "one trap", "two traps", "three traps", "four traps"];

    export function getRandomInstruction(instructions: string[], lastInstruction: string): string {
        var random = null;

        do {
            random = Math.floor(Math.random() * instructions.length);
        } while (instructions[random] === lastInstruction);

        return instructions[random];
    }

    export class ChooseHand implements IState {

        public id: string = "views.states.ChooseHand";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.ChooseHand;

        private instructions: HTMLUListElement;

        private activeInstruction: HTMLElement;

        private readyButton: HTMLAnchorElement;

        private chipStacks: choosehand.ChipStack[];

        private activeEnabled: boolean = false;

        constructor(datacontext: viewmodels.states.ChooseHand) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-layer');
            this.instructions = <HTMLUListElement>this.layer.getElementsByClassName('instructions')[0];
            this.readyButton = <HTMLAnchorElement> document.getElementById('choose-hand-button');

            this.chipStacks = [];
            var chips: HTMLDivElement = <HTMLDivElement>this.layer.getElementsByClassName('chips')[0];

            // Remove all children
            chips.innerHTML = "";

            var bets: Array<models.entities.BetType> = this.datacontext.GetAvailableBets();
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
                this.chipStacks.push(new choosehand.ChipStack(chips, iColumn, lastType, lastCount));
                ++iColumn;
                lastType = null;
                lastCount = 0;
            } while (iBet < cBets);

            document.getElementById('instruction-discard-count').innerHTML = discardText[cBets - 5] || ("" + (cBets - 5) + " traps");
        }

        public enter(previousState: IState) {
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

            this.readyButton.onclick = (event) => {
                if (!this.activeEnabled) {
                    return false;
                }

                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].hideChips();
                }
                this.readyButton.onclick = null;
                var that = this;
                window.setTimeout(function () {
                    that.datacontext.chooseHand()
                }, 200);

                return false;
            };
        }

        public exit(nextState: IState) {
            this.datacontext.instructionChanged.remove(this.instructionChanged, this);
            this.datacontext.showCanCommit.remove(this.showCanCommit, this);
            this.readyButton.onclick = null;

            for (var i = 0; i < this.chipStacks.length; i++) {
                this.chipStacks[i].exit();
                this.chipStacks[i].chipStackChanged.remove(this.onChipStackChanged, this);
            }

            this.activeInstruction.classList.remove('active-instruction');
            this.activeInstruction = null;
        }

        private instructionChanged(activeInstruction: number) {
            if (this.activeInstruction != null) {
                this.activeInstruction.classList.remove('active-instruction');
            }

            this.activateInstruction(activeInstruction);
        }

        private activateInstruction(activeInstruction: number) {
            this.activeInstruction = <HTMLElement>this.instructions.children[activeInstruction];
            this.activeInstruction.classList.add('active-instruction');
        }

        private onChipStackChanged(betType: models.entities.BetType, added: boolean) {
            if (added) {
                this.datacontext.AddBetToHat(betType);
            } else {
                this.datacontext.RemoveBetFromHat(betType);
            }
        }

        private showCanCommit(enable: boolean) {
            this.activeEnabled = enable;
            for (var i = 0; i < this.chipStacks.length; i++) {
                this.chipStacks[i].setActiveEnabled(!enable);
            }
        }
    }
}
