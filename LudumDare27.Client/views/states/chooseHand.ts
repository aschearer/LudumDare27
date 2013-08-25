/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>

module views.states {

    export class ChooseHand implements IState {

        public id: string = "views.states.ChooseHand";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.ChooseHand;

        private instructions: HTMLUListElement;

        private activeInstruction: HTMLElement;

        constructor(datacontext: viewmodels.states.ChooseHand) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-layer');
            this.instructions = <HTMLUListElement>this.layer.getElementsByClassName('instructions')[0];
        }

        public enter(previousState: IState) {
            if (this.datacontext.currentInstruction >= 0) {
                this.activateInstruction();
            }

            this.datacontext.instructionChanged.add(this.instructionChanged, this);
            this.layer.onclick = (event) => {
                this.datacontext.goBack();
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
            this.datacontext.instructionChanged.remove(this.instructionChanged, this);
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
    }
}
