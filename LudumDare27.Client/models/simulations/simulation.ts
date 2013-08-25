/// <reference path="../entities/betting.ts"/>

module models.simulations {

    enum SimulationState {
        NewGame,
        ChooseHand,
        ChooseBet,
        ShowResult,
        GameOver,
    }

    export class Simulation {

        private hat: models.entities.Hat;
        private players: Array<models.entities.Player>;
        private currentPlayer: number;
        private simulationState: SimulationState;

        public changingPlayer: Signal;
        public chooseHand: Signal;
        public canCommitHat: Signal;
        public chooseBet: Signal;
        public turnResult: Signal;
        public gameOver: Signal;

        constructor() {
            this.hat = new models.entities.Hat();
            this.players = [];
            this.players[0] = new models.entities.Player(0);
            this.players[1] = new models.entities.Player(1);

            this.currentPlayer = 0;
            this.simulationState = SimulationState.NewGame;
        }

        public update(elapsedTime: number) {
            if (SimulationState.NewGame === this.simulationState) {
                this.simulationState = SimulationState.ChooseHand;
                this.changingPlayer.dispatch(this.players[this.currentPlayer]);
            }
        }

        public PlayerReady() {
            if (SimulationState.ChooseHand == this.simulationState) {
                this.chooseHand.dispatch(this.players[this.currentPlayer]);
            } else {
                this.chooseBet.dispatch(this.players[this.currentPlayer]);
            }
        }

        public AdvanceGame() {
            if (this.hat.IsDone()) {
                this.simulationState = SimulationState.GameOver;

                var winningScore = Number.MIN_VALUE;
                var winningPlayer = null;
                for (var iPlayer in this.players) {
                    var player = this.players[iPlayer];
                    if (player.points > winningScore) {
                        winningPlayer = player;
                        winningScore = player.points;
                    } else if (player.points === winningScore) {
                        // A tie
                        winningPlayer = null;
                    }
                }
                this.gameOver.dispatch(winningPlayer, winningScore);
            } else {
                this.simulationState = SimulationState.ChooseBet;
                this.changingPlayer.dispatch(this.players[this.currentPlayer]);
            }
        }

        public ChooseBet(betType: models.entities.BetType) {
            this.players[this.currentPlayer].MakeBet(betType);
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
            if (0 == this.currentPlayer) {
                var bet = this.hat.GetNextBet();
                var winningPlayer = null;
                for (var iPlayer in this.players) {
                    var player = this.players[iPlayer];
                    if (player.currentBet === bet) {
                        if (null !== winningPlayer) {
                            // A tie
                            winningPlayer = null;
                            break;
                        }
                        winningPlayer = player;
                    }
                }
                if (winningPlayer) {
                    winningPlayer.AddPoint(1);
                }
                this.simulationState = SimulationState.ShowResult;
                this.turnResult.dispatch(winningPlayer, bet, this.players);
            } else {
                this.changingPlayer.dispatch(this.players[this.currentPlayer]);
            }
        }

        public AddBetToHat(betType: models.entities.BetType) {
            var hand = this.players[this.currentPlayer].GetHand();
            hand.AddBetToHat(betType);
            if (hand.GetBetCount() >= 5) {
                this.canCommitHat.dispatch(true);
            }
        }

        public RemoveBetFromHat(betType: models.entities.BetType) {
            var hand = this.players[this.currentPlayer].GetHand();
            hand.RemoveBetFromHat(betType);
            if (hand.GetBetCount() < 5) {
                this.canCommitHat.dispatch(false);
            }
        }

        public CommitHat() {
            var newBets = this.players[this.currentPlayer].GetHand().GetBets();
            for (var iBet in newBets) {
                var newBet = newBets[iBet];
                this.hat.AddBet(newBet);
            }
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
            if (0 == this.currentPlayer) {
                this.simulationState = SimulationState.ChooseBet;
                this.hat.ShuffleBets();
            }
            this.changingPlayer.dispatch(this.players[this.currentPlayer]);
        }
    }
}
