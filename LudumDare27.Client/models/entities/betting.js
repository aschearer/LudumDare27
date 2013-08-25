var models;
(function (models) {
    (function (entities) {
        (function (BetType) {
            BetType[BetType["Up"] = 0] = "Up";
            BetType[BetType["Left"] = 1] = "Left";
            BetType[BetType["Down"] = 2] = "Down";
            BetType[BetType["Right"] = 3] = "Right";
        })(entities.BetType || (entities.BetType = {}));
        var BetType = entities.BetType;

        var Hat = (function () {
            function Hat() {
                this.bets = new Array();
                this.lastBetIndex = 0;
            }
            Hat.prototype.AddBet = function (newBet) {
                this.bets.push(newBet);
            };

            Hat.prototype.ShuffleBets = function () {
                var tempBets = this.bets;
                var totalSlots = tempBets.length;
                this.bets = new Array();

                while (totalSlots > 0) {
                    var item = Math.random() * totalSlots;
                    this.bets.push(tempBets.splice(item, 1)[0]);
                    --totalSlots;
                }
            };

            Hat.prototype.GetNextBet = function () {
                var ret = this.bets[this.lastBetIndex];
                ++this.lastBetIndex;
                return ret;
            };

            Hat.prototype.IsDone = function () {
                return this.lastBetIndex >= this.bets.length;
            };
            return Hat;
        })();
        entities.Hat = Hat;

        var PossibleBets = (function () {
            function PossibleBets(betType, available) {
                this.betType = betType;
                this.available = available;
                this.selected = 0;
            }
            return PossibleBets;
        })();
        entities.PossibleBets = PossibleBets;

        var Hand = (function () {
            function Hand() {
                // $TEMP: hardcoding hand
                this.possibleBets = [];
                this.possibleBets[BetType.Down] = new PossibleBets(BetType.Down, 2);
                this.possibleBets[BetType.Left] = new PossibleBets(BetType.Left, 2);
                this.possibleBets[BetType.Right] = new PossibleBets(BetType.Right, 2);
                this.possibleBets[BetType.Up] = new PossibleBets(BetType.Up, 1);
            }
            Hand.prototype.AddBetToHat = function (betType) {
                var possibleBet = this.possibleBets[betType];
                if (possibleBet.available < possibleBet.selected) {
                    ++possibleBet.selected;
                }
            };

            Hand.prototype.RemoveBetFromHat = function (betType) {
                var possibleBet = this.possibleBets[betType];
                if (possibleBet.selected > 0) {
                    --possibleBet.selected;
                }
            };

            Hand.prototype.GetBetCount = function () {
                var ret = 0;
                for (var iBet in this.possibleBets) {
                    ret += this.possibleBets[iBet].selected;
                }

                return ret;
            };

            Hand.prototype.GetBets = function () {
                var ret = new Array();
                for (var iBet in this.possibleBets) {
                    var possible = this.possibleBets[possible];
                    for (var i = 0, c = possible.selected; i < c; ++i) {
                        ret.push(possible.betType);
                    }
                }

                return ret;
            };
            return Hand;
        })();
        entities.Hand = Hand;

        var Player = (function () {
            function Player(playerId) {
                this.playerId = playerId;
                this.hand = new Hand();
                this.currentBet = null;
                this.points = 0;
            }
            Player.prototype.AddPoint = function (newPoints) {
                this.points += newPoints;
            };

            Player.prototype.MakeBet = function (betType) {
                this.currentBet = betType;
            };

            Player.prototype.GetHand = function () {
                return this.hand;
            };
            return Player;
        })();
        entities.Player = Player;
    })(models.entities || (models.entities = {}));
    var entities = models.entities;
})(models || (models = {}));
//# sourceMappingURL=betting.js.map