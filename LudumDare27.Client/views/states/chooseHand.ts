/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/chooseHand.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>
/// <reference path="../choosehand/chipStack.ts"/>

module views.states {

    export class ChooseHand implements IState {

        public id: string = "views.states.ChooseHand";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.ChooseHand;

        private instructions: HTMLUListElement;

        private activeInstruction: HTMLElement;

        private readyButton: HTMLButtonElement;

        private chipStacks: choosehand.ChipStack[];

        constructor(datacontext: viewmodels.states.ChooseHand) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-layer');
            this.instructions = <HTMLUListElement>this.layer.getElementsByClassName('instructions')[0];
            this.readyButton = <HTMLButtonElement> document.getElementById('choose-hand-button');

            this.chipStacks = [];
            var chips: HTMLDivElement = <HTMLDivElement>this.layer.getElementsByClassName('chips')[0];
            // TODO: get count from datacontext
            this.chipStacks.push(new choosehand.ChipStack(chips, 0, 'green', 2));
            this.chipStacks.push(new choosehand.ChipStack(chips, 1, 'pink', 3));
            this.chipStacks.push(new choosehand.ChipStack(chips, 2, 'yellow', 2));
            this.chipStacks.push(new choosehand.ChipStack(chips, 3, 'purple', 1));
        }

        public enter(previousState: IState) {
            if (this.datacontext.currentInstruction >= 0) {
                this.activateInstruction();
            }

            for (var i = 0; i < this.chipStacks.length; i++) {
                this.chipStacks[i].reset();
            }

            this.datacontext.instructionChanged.add(this.instructionChanged, this);
            this.datacontext.showCanCommit.add(this.showCanCommit, this);
            this.layer.onclick = (event) => {
                this.datacontext.goBack();
            };

            this.readyButton.onclick = (event) => {
                this.datacontext.chooseHand();
                for (var i = 0; i < this.chipStacks.length; i++) {
                    this.chipStacks[i].commit();
                }
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
            this.datacontext.instructionChanged.remove(this.instructionChanged, this);
            this.datacontext.showCanCommit.remove(this.showCanCommit, this);
            this.readyButton.onclick = null;
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

        private showCanCommit(enable: boolean) {
            // TODO:
        }
    }
}
