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

        public GetWinningPlayerName() : string {
            var results: models.simulations.PlayerResult = this.simulation.GetGameResults();
            return (results.player) ? results.player.name : null;
        }

        public endGame() {
            this.stateChanged.dispatch(null);
        }
    }
}
