/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/chooseHand.ts"/>
/// <reference path="../choosehand/chipStack.ts"/>

module views.states {

    export class ChooseHand implements IState {

        public id: string = "views.states.ChooseHand";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.ChooseHand;

        private instructions: HTMLUListElement;

        private activeInstruction: HTMLElement;

        private readyButton: HTMLAnchorElement;

        private chipStacks: choosehand.ChipStack[];

        constructor(datacontext: viewmodels.states.ChooseHand) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-layer');
            this.instructions = <HTMLUListElement>this.layer.getElementsByClassName('instructions')[0];
            this.readyButton = <HTMLAnchorElement> document.getElementById('choose-hand-button');

            this.chipStacks = [];
            var chips: HTMLDivElement = <HTMLDivElement>this.layer.getElementsByClassName('chips')[0];

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
        }

        public enter(previousState: IState) {
            if (this.datacontext.currentInstruction >= 0) {
                this.activateInstruction();
            }

            for (var i = 0; i < this.chipStacks.length; i++) {
                this.chipStacks[i].reset();
                this.chipStacks[i].chipStackChanged.add(this.onChipStackChanged, this);
            }

            this.datacontext.instructionChanged.add(this.instructionChanged, this);
            this.datacontext.showCanCommit.add(this.showCanCommit, this);

            this.readyButton.onclick = (event) => {
                this.datacontext.chooseHand();
                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].commit();
                }
            };
        }

        public exit(nextState: IState) {
            this.datacontext.instructionChanged.remove(this.instructionChanged, this);
            this.datacontext.showCanCommit.remove(this.showCanCommit, this);
            this.readyButton.onclick = null;

            for (var i = 0; i < this.chipStacks.length; i++) {
                this.chipStacks[i].chipStackChanged.remove(this.onChipStackChanged, this);
            }

            this.activeInstruction.classList.remove('active-instruction');
            this.activeInstruction = null;
        }

        private instructionChanged(activeInstruction: number) {
            if (this.activeInstruction != null) {
                this.activeInstruction.classList.remove('active-instruction');
            }

            this.activateInstruction();
        }

        private activateInstruction() {
            this.activeInstruction = <HTMLElement>this.instructions.children[this.datacontext.currentInstruction];
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
            for (var i = 0; i < this.chipStacks.length; i++) {
                this.chipStacks[i].setActiveEnabled(!enable);
            }
        }
    }
}
