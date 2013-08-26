/// <reference path="../entities/betting.ts"/>

module models.simulations {

    enum SimulationState {
        NewGame,
        ChooseHand,
        ChooseBets,
        ShowResult,
        GameOver,
    }

    export class PlayerResult {
        public player: models.entities.Player;
        public score: number;

        constructor(player: models.entities.Player, score: number) {
            this.player = player;
            this.score = score;
        }
    }

    var gameTypes = [
        [1, 2, 2, 2],
        [1, 2, 2, 2],
        [2, 1, 2, 2],
        [2, 1, 2, 2],
        [2, 2, 1, 2],
        [2, 2, 1, 2],
        [2, 2, 2, 1],
        [2, 2, 2, 1],
        [1, 3, 2, 2],
        [1, 3, 1, 1],
    ];

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
            var gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];

            this.hat = new models.entities.Hat();
            this.players = [];
            this.players[0] = new models.entities.Player(0, gameType);
            this.players[1] = new models.entities.Player(1, gameType);

            this.currentPlayer = 0;
            this.simulationState = SimulationState.NewGame;
        }

        public StartGame() {
            this.simulationState = SimulationState.ChooseHand;
            this.changingPlayer.dispatch(this.players[this.currentPlayer]);
        }

        public AdvanceGame(): boolean {
            var nextRound = false;

            if (this.hat.IsDone() || this.HasPlayerWon()) {
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
                nextRound = true;
            }

            return nextRound;
        }

        public GetGameResults(): PlayerResult {
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

            return new PlayerResult(winningPlayer, winningScore);
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

        public MakeBet(playerId: number, betType: models.entities.BetType): models.entities.BetType {
            var player = this.players[playerId];
            var previousBet = player.currentBet;

            player.MakeBet(betType);

            if ((null === previousBet) && this.AreAllPlayersReady()) {
                this.turnReady.dispatch();
            }

            return previousBet;
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
            var beforeCount = hand.GetBetCount();
            hand.AddBetToHat(betType);
            var afterCount = hand.GetBetCount();
            if (((beforeCount === 5) || (afterCount === 5)) && (beforeCount !== afterCount)) {
                this.canCommitHat.dispatch(afterCount === 5);
            }
        }

        public RemoveBetFromHat(betType: models.entities.BetType) {
            var hand = this.players[this.currentPlayer].GetHand();
            var beforeCount = hand.GetBetCount();
            hand.RemoveBetFromHat(betType);
            var afterCount = hand.GetBetCount();
            if (((beforeCount === 5) || (afterCount === 5)) && (beforeCount !== afterCount)) {
                this.canCommitHat.dispatch(afterCount === 5);
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

        public GetAvailableBets(): Array<models.entities.BetType> {
            return this.players[this.currentPlayer].GetHand().GetAvailableBets();
        }

        public GetCurrentPlayers(): Array<PlayerResult> {
            var ret = new Array<PlayerResult>();
            var totalScore = 0;
            for (var i = 0, col = this.players, c = col.length; i < c; ++i) {
                var player = col[i];
                totalScore += player.points;
            }

            for (var i = 0, col = this.players, c = col.length; i < c; ++i) {
                var player = col[i];
                ret.push(new PlayerResult(player, totalScore - player.points));
            }

            return ret;
        }

        public HasPlayerWon(): boolean {
            var ret = false;
            for (var i = 0, col = this.players, c = col.length; i < c; ++i) {
                var player = col[i];
                if (player.points >= 3) {
                    ret = true;
                    break;
                }
            }

            return ret;
        }
    }
}
