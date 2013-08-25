/// <reference path="istate.ts"/>
/// <reference path="chooseHand.ts"/>

module viewmodels.states {
    export class ChangingPlayer implements IState {

        public id: string = "viewmodels.states.ChangingPlayer";

        public stateChanged: Signal = new Signal();

        private simulation: models.simulations.Simulation;

        constructor(simulation: models.simulations.Simulation) {
            this.simulation = simulation;
        }
        
        public enter() {
        }

        public exit() {
        }

        public playerReady() {
            this.stateChanged.dispatch(new ChooseHand(this.simulation), true);
        }
    }
}
