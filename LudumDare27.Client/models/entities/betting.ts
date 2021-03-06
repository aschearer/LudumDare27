module models.entities {
    export enum BetType {
        Up,
        Left,
        Down,
        Right,
        Unknown,
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
            this.selected = available; // We default to all bets selected, and have the player unselect them
        }
    }

    export class Hand {
        private possibleBets: Array<PossibleBets>;

        constructor(possibleBets: number[]) {
            this.possibleBets = [];
            this.possibleBets[BetType.Up] = new PossibleBets(BetType.Up, possibleBets[0]);
            this.possibleBets[BetType.Left] = new PossibleBets(BetType.Left, possibleBets[1]);
            this.possibleBets[BetType.Down] = new PossibleBets(BetType.Down, possibleBets[2]);
            this.possibleBets[BetType.Right] = new PossibleBets(BetType.Right, possibleBets[3]);
        }

        public AddBetToHat(betType: BetType) {
            var possibleBet = this.possibleBets[betType];
            if (possibleBet.available > possibleBet.selected) {
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
                var possible = this.possibleBets[iBet];
                for (var i = 0, c = possible.selected; i < c; ++i) {
                    ret.push(possible.betType);
                }
            }

            return ret;
        }

        public GetAvailableBets(): Array<BetType> {
            var ret = new Array<BetType>();
            for (var iBet in this.possibleBets) {
                var possible = this.possibleBets[iBet];
                for (var i = 0, c = possible.available; i < c; ++i) {
                    ret.push(possible.betType);
                }
            }

            return ret;
        }
    }

    var playerIdentities = [];
    playerIdentities[0] = "Sally Sissypants";
    playerIdentities[1] = "Riley Roundbottom";

    export class Player {
        public playerId: number;
        private hand: Hand;
        public currentBet: BetType;
        public points: number;
        public name: string;

        constructor(playerId: number, possibleBets: number[]) {
            this.playerId = playerId;
            this.hand = new Hand(possibleBets);
            this.currentBet = null;
            this.points = 0;

            this.name = playerIdentities[playerId] || ("" + (playerId + 1));
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
