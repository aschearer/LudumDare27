module models.entities {
    export enum BetType {
        Up,
        Left,
        Down,
        Right,
    }

    export class Hat {
        private bets: Array<BetType>;
        private lastBetIndex: number;

        constructor() {
            this.bets = new Array<BetType>();
            this.lastBetIndex = 0;
        }

        public AddBet(newBet: BetType) {
            this.bets.push(newBet);
        }

        public ShuffleBets() {
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

        constructor(betType: BetType, available: number) {
            this.betType = betType;
            this.available = available;
            this.selected = 0;
        }
    }

    export class Hand {
        private possibleBets: Array<PossibleBets>;

        constructor() {
            // $TEMP: hardcoding hand
            this.possibleBets = [];
            this.possibleBets[BetType.Down] = new PossibleBets(BetType.Down, 2);
            this.possibleBets[BetType.Left] = new PossibleBets(BetType.Left, 2);
            this.possibleBets[BetType.Right] = new PossibleBets(BetType.Right, 2);
            this.possibleBets[BetType.Up] = new PossibleBets(BetType.Up, 1);
        }

        public AddBetToHat(betType: BetType) {
            var possibleBet = this.possibleBets[betType];
            if (possibleBet.available < possibleBet.selected) {
                ++possibleBet.selected;
            }
        }

        public RemoveBetFromHat(betType: BetType) {
            var possibleBet = this.possibleBets[betType];
            if (possibleBet.selected > 0) {
                --possibleBet.selected;
            }
        }

        public GetBetCount(): number {
            var ret = 0;
            for (var iBet in this.possibleBets) {
                ret += this.possibleBets[iBet].selected;
            }

            return ret;
        }

        public GetBets(): Array<BetType> {
            var ret = new Array<BetType>();
            for (var iBet in this.possibleBets) {
                var possible = this.possibleBets[possible];
                for (var i = 0, c = possible.selected; i < c; ++i) {
                    ret.push(possible.betType);
                }
            }

            return ret;
        }
    }

    export class Player {
        public playerId: number;
        private hand: Hand;
        public currentBet: BetType;
        public points: number;

        constructor(playerId: number) {
            this.playerId = playerId;
            this.hand = new Hand();
            this.currentBet = null;
            this.points = 0;
        }

        public AddPoint(newPoints: number) {
            this.points += newPoints;
        }

        public MakeBet(betType: BetType) {
            this.currentBet = betType;
        }

        public GetHand(): Hand {
            return this.hand;
        }
    }

}
