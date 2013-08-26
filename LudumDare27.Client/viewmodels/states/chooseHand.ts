/// <reference path="istate.ts"/>
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
            if (enable && (this.currentInstruction !== 3)) {
                this.instructionChanged.dispatch(3);
            }
        }

        public GetCurrentPlayerName(): string {
            var player: models.entities.Player = this.simulation.GetChoosingPlayer();
            return player ? player.name : "???!?!?!?";
        }

        public GetAvailableBets(): Array<models.entities.BetType> {
            return this.simulation.GetAvailableBets();
        }

        public AddBetToHat(betType: models.entities.BetType) {
            if (this.currentInstruction > 0) {
                this.currentInstruction--;
                this.instructionChanged.dispatch(this.currentInstruction);
            }
            this.simulation.AddBetToHat(betType);
        }

        public RemoveBetFromHat(betType: models.entities.BetType) {
            if (this.currentInstruction < 3) {
                this.currentInstruction++;
                this.instructionChanged.dispatch(this.currentInstruction);
            }
            this.simulation.RemoveBetFromHat(betType);
        }

        public chooseHand() {
            this.simulation.CommitHat();
            var player: models.entities.Player = this.simulation.GetChoosingPlayer();
            if (player) {
                this.stateChanged.dispatch(new ChooseHand(this.simulation), true);
            } else {
                this.stateChanged.dispatch(new Duel(this.simulation), true);
            }
        }
    }
}
