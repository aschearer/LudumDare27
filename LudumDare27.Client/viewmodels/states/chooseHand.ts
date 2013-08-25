/// <reference path="istate.ts"/>
/// <reference path="duel.ts"/>

module viewmodels.states {
    export class ChooseHand implements IState {

        public id: string = "viewmodels.states.ChooseHand";

        public stateChanged: Signal = new Signal();

        public instructionChanged: Signal = new Signal();

        public currentInstruction: number = -1;

        public enter() {
            this.currentInstruction = 0;
            this.instructionChanged.dispatch(this.currentInstruction);
        }

        public exit() {
        }

        public chooseHand() {
            this.stateChanged.dispatch(new Duel());
        }

        public goBack() {
            if (this.currentInstruction < 1) {
                this.currentInstruction++;
                this.instructionChanged.dispatch(this.currentInstruction);
            }
        }
    }
}
