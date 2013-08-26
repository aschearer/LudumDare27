/// <reference path="istate.ts"/>
/// <reference path="chooseHand.ts"/>
/// <reference path="..\..\models\simulations\Simulation.ts"/>

module viewmodels.states {

    export class Title implements IState {

        public id: string = "viewmodels.states.Title";

        public stateChanged: Signal = new Signal();

        public enter() {
        }

        public exit() {
        }

        public onPlayGame() {
            var simulation: models.simulations.Simulation = new models.simulations.Simulation();
            simulation.StartGame();
            this.stateChanged.dispatch(new ChooseHand(simulation));
        }
    }
}