module viewmodels.states {
    export class Help implements IState {

        public id: string = "viewmodels.states.Help";

        public stateChanged: Signal = new Signal();

        private simulation: models.simulations.Simulation;

        constructor(simulation: models.simulations.Simulation) {
            this.simulation = simulation;
        }

        public enter() {
        }

        public exit() {
        }

        public goBack() {
            this.stateChanged.dispatch(null);
        }
    }
}