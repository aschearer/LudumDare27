/// <reference path="istate.ts"/>
/// <reference path="chooseHand.ts"/>

module viewmodels.states {
    export class GameOver implements IState {

        public id: string = "viewmodels.states.GameOver";

        public stateChanged: Signal = new Signal();

        private simulation: models.simulations.Simulation;

        constructor(simulation: models.simulations.Simulation) {
            this.simulation = simulation;
        }
        
        public enter() {
        }

        public exit() {
        }

        public endGame() {
            this.stateChanged.dispatch(null);
        }
    }
}
