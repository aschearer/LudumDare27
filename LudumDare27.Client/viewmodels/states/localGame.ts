/// <reference path="istate.ts"/>

module viewmodels.states {
    export class LocalGame implements IState {

        public id: string = "viewmodels.states.LocalGame";

        public stateChanged: Signal = new Signal();

        public showCanCommit: Signal = new Signal();
        public showReady: Signal = new Signal();
        public showSubState: Signal = new Signal();

        private simulation: models.simulations.Simulation;
        private currentPlayer: models.entities.Player;

        constructor() {
        }

        public enter() {
            this.simulation = new models.simulations.Simulation();
            this.simulation.changingPlayer.add(this.onChangingPlayer, this);
            this.simulation.canCommitHat.add(this.onCanCommitHat, this);
            this.simulation.chooseBets.add(this.onChooseBets, this);
            this.simulation.turnReady.add(this.onTurnReady, this);
            this.simulation.turnResult.add(this.onTurnResult, this);
            this.simulation.gameOver.add(this.onGameOver, this);
        }

        public exit() {
            this.simulation.changingPlayer.remove(this.onChangingPlayer, this);
            this.simulation.canCommitHat.remove(this.onCanCommitHat, this);
            this.simulation.chooseBets.remove(this.onChooseBets, this);
            this.simulation.turnReady.remove(this.onTurnReady, this);
            this.simulation.turnResult.remove(this.onTurnResult, this);
            this.simulation.gameOver.remove(this.onGameOver, this);
        }

        public StartGame() {
            this.simulation.StartGame();
        }

        private onChangingPlayer(player: models.entities.Player) {
            this.currentPlayer = player;
            this.showSubState.dispatch("choosePlayer", player.playerId);
        }

        public PlayerReady() {
            this.stateChanged.dispatch(new ChooseHand(this.simulation), true);
            //this.showSubState.dispatch("chooseHand", this.currentPlayer.GetHand());
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

        public CommitHat() {
            this.simulation.CommitHat();
        }

        private onChooseBets() {
            this.showSubState.dispatch("chooseBets");
        }

        public MakeBet(playerId: number, betType: models.entities.BetType) {
            if (this.simulation.MakeBet(playerId, betType)) {
                this.showReady.dispatch(playerId);
            }
        }

        private onTurnReady() {
            // TODO: animate start of turn
            this.simulation.TakeTurn();
        }

        private onTurnResult() {
            // TODO: animate end of turn
            this.showSubState.dispatch("turnResult");
        }

        public AdvanceGame() {
            this.simulation.AdvanceGame();
        }

        private onGameOver() {
            // TODO: animate end
            this.showSubState.dispatch("gameOver");
        }

        public EndGame() {
            this.stateChanged.dispatch(null);
        }
    }
}