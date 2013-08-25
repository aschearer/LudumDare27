/// <reference path="../entities/betting.ts"/>

module models.simulations {

    enum SimulationState {
        NewGame,
        ChooseHand,
        ChooseBets,
        ShowResult,
        GameOver,
    }

    export class GameResults {
        public winner: models.entities.Player;
        public score: number;

        constructor(winner: models.entities.Player, score: number) {
            this.winner = winner;
            this.score = score;
        }
    }

    export class Simulation {

        private hat: models.entities.Hat;
        private players: Array<models.entities.Player>;
        private currentPlayer: number;
        private simulationState: SimulationState;

        public changingPlayer: Signal = new Signal();
        public canCommitHat: Signal = new Signal();
        public chooseBets: Signal = new Signal();
        public turnReady: Signal = new Signal();
        public turnResult: Signal = new Signal();
        public gameOver: Signal = new Signal();

        constructor() {
            this.hat = new models.entities.Hat();
            this.players = [];
            this.players[0] = new models.entities.Player(0);
            this.players[1] = new models.entities.Player(1);

            this.currentPlayer = 0;
            this.simulationState = SimulationState.NewGame;
        }

        public StartGame() {
            this.simulationState = SimulationState.ChooseHand;
            this.changingPlayer.dispatch(this.players[this.currentPlayer]);
        }

        public AdvanceGame() {
            if (this.hat.IsDone()) {
                this.simulationState = SimulationState.GameOver;
                var results = this.GetGameResults();
                this.gameOver.dispatch(results);
            } else {
                // clear all bets before a second round
                for (var iPlayer in this.players) {
                    var player = this.players[iPlayer];
                    player.currentBet = null;
                }
                this.simulationState = SimulationState.ChooseBets;
                this.chooseBets.dispatch(this.players);
            }
        }

        public GetGameResults(): GameResults {
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

            return new GameResults(winningPlayer, winningScore);
        }

        private AreAllPlayersReady(): boolean {
            var allPlayersReady = true;
            for (var iPlayer in this.players) {
                var player = this.players[iPlayer];
                if (player.currentBet === null) {
                    allPlayersReady = false;
                    break;
                }
            }
            return allPlayersReady;
        }

        public MakeBet(playerId: number, betType: models.entities.BetType): boolean {
            var player = this.players[playerId];
            var wasPlayerNotReady = (null === player.currentBet);

            player.MakeBet(betType);

            if (wasPlayerNotReady && this.AreAllPlayersReady()) {
                this.turnReady.dispatch();
            }

            return wasPlayerNotReady;
        }

        public TakeTurn() {
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
                this.simulationState = SimulationState.ChooseBets;
                this.hat.ShuffleBets();
                this.chooseBets.dispatch(this.players);
            } else {
                this.simulationState = SimulationState.ChooseHand;
                this.changingPlayer.dispatch(this.players[this.currentPlayer]);
            }
        }

        public GetChoosingPlayer() : models.entities.Player {
            if (this.simulationState === SimulationState.ChooseHand) {
                return this.players[this.currentPlayer];
            }

            return null;
        }
    }
}
