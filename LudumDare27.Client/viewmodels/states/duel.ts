/// <reference path="istate.ts"/>
/// <reference path="gameOver.ts"/>

module viewmodels.states {

    export class Duel implements IState {

        public id: string = "viewmodels.states.Duel";

        public turnReady: Signal = new Signal();
        public turnResult: Signal = new Signal();
        public stateChanged: Signal = new Signal();

        private simulation: models.simulations.Simulation;

        constructor(simulation: models.simulations.Simulation) {
            this.simulation = simulation;
        }

        public enter() {
            this.simulation.gameOver.add(this.onGameOver, this);
            this.simulation.turnReady.add(this.onTurnReady, this);
            this.simulation.turnResult.add(this.onTurnResult, this);
        }

        public exit() {
            this.simulation.gameOver.remove(this.onGameOver, this);
            this.simulation.turnReady.remove(this.onTurnReady, this);
            this.simulation.turnResult.remove(this.onTurnResult, this);
        }

        public GetCurrentPlayers(): Array<models.simulations.PlayerResult> {
            return this.simulation.GetCurrentPlayers();
        }

        public MakeBet(playerId: number, betType: models.entities.BetType) {
            return this.simulation.MakeBet(playerId, betType);
        }

        public TakeTurn() {
            this.simulation.TakeTurn();
        }

        public AdvanceGame(): boolean {
            return this.simulation.AdvanceGame();
        }

        private onGameOver() {
            window.setTimeout(function () {
                this.stateChanged.dispatch(new GameOver(this.simulation), true);
            }.bind(this), 350);
        }

        private onTurnReady() {
            this.turnReady.dispatch();
        }

        private onTurnResult(winningPlayer: models.entities.Player, betType: models.entities.BetType, players: Array<models.entities.Player>) {
            this.turnResult.dispatch(winningPlayer, betType, players);
        }
    }
}