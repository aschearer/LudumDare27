/// <reference path="istate.ts"/>
/// <reference path="gameOver.ts"/>

module viewmodels.states {

    export class Duel implements IState {

        public id: string = "viewmodels.states.Duel";

        public stateChanged: Signal = new Signal();

        private simulation: models.simulations.Simulation;

        constructor(simulation: models.simulations.Simulation) {
            this.simulation = simulation;
        }

        public enter() {
        }

        public exit() {
        }

        public GetCurrentPlayers(): Array<models.simulations.PlayerResult> {
            return this.simulation.GetCurrentPlayers();
        }

        public MakeBet(playerId: number, betType: models.entities.BetType) {
            return this.simulation.MakeBet(playerId, betType);
        }

        public goBack() {
            this.stateChanged.dispatch(new GameOver(this.simulation), true);
        }
    }
}