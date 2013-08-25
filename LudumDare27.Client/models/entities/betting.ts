module models.entities {
    export enum BetType {
        Up,
        Left,
        Down,
        Right,
    }

    export enum PlayerId {
        One,
        Two,
    }

    export class Player {
        private playerId: PlayerId;

        public constructor(playerId: PlayerId) {
            this.playerId = playerId;
        }
    }

    export class Hat {
        private bets: Array<BetType>;
        private lastBetIndex: number;

        public constructor() {
            this.bets = new Array<BetType>();
            this.lastBetIndex = 0;
        }

        public AddBet(newBet: BetType) {
            this.bets.push(newBet);
        }

        public Shuffle() {
            var tempBets: Array<BetType> = this.bets;
            var totalSlots = tempBets.length;
            this.bets = new Array<BetType>();

            // Sort the items into the new bets
            while (totalSlots > 0) {
                var item = Math.random() * totalSlots;
                this.bets.push(tempBets.splice(item, 1)[0]);
                --totalSlots;
            }
        }

        public GetNextBet(): BetType {
            var ret: BetType = this.bets[this.lastBetIndex];
            ++this.lastBetIndex;
            return ret;
        }

        public IsDone(): boolean {
            return this.lastBetIndex >= this.bets.length;
        }
    }

    export class PossibleBets {
        public betType: BetType;
        public available: number;
        public selected: number;

        public constructor(betType: BetType, available: number) {
            this.betType = betType;
            this.available = available;
            this.selected = 0;
        }
    }

    export class Hand {
        private possibleBets: Array<PossibleBets>;

        public constructor() {
        }
    }
}
