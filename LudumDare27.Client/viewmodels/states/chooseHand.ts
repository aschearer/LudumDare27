/// <reference path="istate.ts"/>
/// <reference path="changingPlayer.ts"/>
/// <reference path="duel.ts"/>

module viewmodels.states {
    export class ChooseHand implements IState {

        public id: string = "viewmodels.states.ChooseHand";

        public showCanCommit: Signal = new Signal();
        public stateChanged: Signal = new Signal();
        public instructionChanged: Signal = new Signal();

        public currentInstruction: number = -1;

        private simulation: models.simulations.Simulation;

        constructor(simulation: models.simulations.Simulation) {
            this.simulation = simulation;
        }
        
        public enter() {
            this.currentInstruction = 0;
            this.instructionChanged.dispatch(this.currentInstruction);
            this.simulation.canCommitHat.add(this.onCanCommitHat, this);
        }

        public exit() {
            this.simulation.canCommitHat.remove(this.onCanCommitHat, this);
        }

        private onCanCommitHat(enable: boolean) {
            this.showCanCommit.dispatch(enable);
        }

        public AddBetToHat(betType: models.entities.BetType) {
            this.simulation.AddBetToHat(betType);
        }

        public RemoveBetFromHat(betType: models.entities.BetType) {
            this.simulation.RemoveBetFromHat(betType);
        }

        public chooseHand() {
            this.simulation.CommitHat();
            this.stateChanged.dispatch(new ChangingPlayer(this.simulation), true);
        }

        public goBack() {
            if (this.currentInstruction < 1) {
                this.currentInstruction++;
                this.instructionChanged.dispatch(this.currentInstruction);
            }
        }
    }
}
